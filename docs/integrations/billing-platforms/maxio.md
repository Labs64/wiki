---
layout: default
title: "Maxio (Chargify) Licensing Integration"
nav_title: "Maxio (Chargify)"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 140
description: "Connect Maxio Advanced Billing, formerly Chargify, to NetLicensing: signup and renewal webhooks create licenses, cancellations deactivate them."
permalink: maxio
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Maxio, formerly Chargify, signs its form-encoded webhooks with HMAC-SHA256. Your receiver creates a license on `signup_success` and another on each `renewal_success`, and deactivates it when the subscription is canceled.

Maxio Advanced Billing is the product formerly known as Chargify (the old developer site `developers.chargify.com` redirects to `developers.maxio.com`). It sends an HTTP `POST` for subscription, billing and payment events.

## What Maxio sends

Maxio sends the body as `application/x-www-form-urlencoded` with the keys `id`, `event` and `payload[...]`, for example `payload[subscription][product][name]`. The documented payload examples contain the subscription (`subscription.id`) with its nested customer (`customer.id`, `customer.email`) and product (`product.id`, `product.handle`, `product.name`). The header `X-Chargify-Webhook-Id` identifies the delivery. You can set up to 5 endpoints per site by default.

## Map Maxio events to NetLicensing

| Maxio event | What to do in NetLicensing |
|----------------|---------------------|
| `customer_create` | Create a licensee |
| `signup_success` | Create a license from the plan's template |
| `renewal_success` | Create an additional license for the next period |
| `payment_success` | Payment succeeded. `signup_success` and `renewal_success` already cover the periods, so do not add a license here as well |
| `subscription_product_change`, `upgrade_downgrade_success` | Create a license from the new template and deactivate the old one |
| `pending_cancellation_change` | Fires when cancellation at the end of the period is set or cleared: deactivate at period end, or reactivate if cleared |
| `subscription_state_change` | General state change: read the new state, for example `past_due` or `canceled` |
| `payment_failure`, `renewal_failure`, `dunning_step_reached` | Your choice: keep access during the platform's retry period, or deactivate |

Maxio documents no named event for an immediate cancellation; use `subscription_state_change`. We found no event named `subscription_created`; `signup_success` is the documented event for "any successful signup, where a subscription is created".

## Check that the request comes from Maxio

Maxio signs each request. The header `X-Chargify-Webhook-Signature-Hmac-Sha-256` holds the hex HMAC-SHA-256 of the **raw request body**, keyed with the site's *Shared Key* (Edit Current Site). The older MD5 header `X-Chargify-Webhook-Signature` is deprecated: validate only the HMAC-SHA-256 signature. Maxio accepts HTTP endpoints only while the site is in test mode; switch to HTTPS before going live.

## Retries and duplicates

Answer with `200`. Any other response, or no timely response, triggers retries: up to 6 attempts in total, roughly after 10 s, 15 s, 90 s, 180 s and 15 minutes. After failures 1 to 25 an endpoint stays enabled; after 26 to 50 it is paused and you can resend from the Webhooks panel; from 51 it is disabled. Delivery is asynchronous and events can arrive out of order.

## Match the customer and the plan

Customer id and email, and the product `id` and `handle`, are in the payload: map `product.handle` or `product.id` to your `licenseTemplateNumber`. Maxio custom fields exist for subscriptions and customers (up to 100 per record type), but they are **not part of an ordinary webhook payload**; their changes arrive in a separate `custom_field_value_change` event.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Maxio                       Your receiver                 NetLicensing
|                           |                             |
| renewal_success --------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=customer id         |
|                           | POST /license ------------->|
|                           |  number=sub-period          |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Maxio calls your receiver

```http
POST /webhooks/maxio HTTP/1.1
Content-Type: application/x-www-form-urlencoded
X-Chargify-Webhook-Id: 123456
X-Chargify-Webhook-Signature-Hmac-Sha-256: <hex HMAC-SHA256>

id=123456&event=renewal_success&payload[subscription][id]=987&payload[subscription][customer][id]=55&payload[subscription][customer][email]=jane%40example.com&payload[subscription][product][handle]=pro-monthly
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_maxio(raw_body: bytes, signature_header: str, secret: str) -> bool:
    # signature_header = request.headers["X-Chargify-Webhook-Signature-Hmac-Sha-256"]
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_header)
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. The key is the site's *Shared Key*. Ignore the deprecated MD5 header.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# customer_create: the Maxio customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=maxio-55&name=Jane%20Doe" \
  $NLIC/licensee

# signup_success and renewal_success: one license per period: <subscription id>-<period you track>
curl --user $AUTH --header "Accept: application/json" \
  --data "number=maxio-987-2026-11&licenseeNumber=maxio-55&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Cancellation that ends access now
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/maxio-987-2026-11
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Maxio: configure and test webhooks](https://docs.maxio.com/configuration/advanced-billing/webhooks/configure-and-test-webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Maxio: review webhook events](https://docs.maxio.com/configuration/advanced-billing/webhooks/review-webhook-events){:target="_blank"}{:rel="noopener nofollow"}
- [Maxio: webhook payload examples](https://docs.maxio.com/configuration/advanced-billing/webhooks/review-webhook-payload-examples){:target="_blank"}{:rel="noopener nofollow"}
- [Maxio: custom fields FAQ](https://docs.maxio.com/configuration/advanced-billing/custom-fields/custom-fields-faq){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Maxio connector. The Maxio details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
