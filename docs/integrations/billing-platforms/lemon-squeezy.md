---
layout: default
title: "Lemon Squeezy Licensing Integration"
nav_title: "Lemon Squeezy"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 130
description: "Connect Lemon Squeezy to NetLicensing: orders and subscription payments create licenses, cancellation and expiry deactivate them. Signed webhooks."
permalink: lemon-squeezy
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Lemon Squeezy signs its webhooks with HMAC-SHA256 (`X-Signature`). Your receiver creates a license for a one-time order, one license per successful subscription payment, and deactivates it when the subscription expires or is refunded.

[Lemon Squeezy](https://www.lemonsqueezy.com){:target="_blank"}{:rel="noopener nofollow"} sends webhooks for orders, subscriptions and license keys. Lemon Squeezy also issues its own license keys (`license_key_created`); when NetLicensing is your licensing system, you can ignore those events and let NetLicensing create the licenses.

## What Lemon Squeezy sends

Lemon Squeezy sends an HTTP `POST` with `Content-Type: application/json` and the header `X-Event-Name`. The body is a JSON:API resource for the event: an order, a subscription or a license key. `meta.event_name` names the event, `data.id` and `data.attributes` describe the resource. An order has `customer_id`, `user_email`, `status`, `identifier` and `order_number`.

## Map Lemon Squeezy events to NetLicensing

| Lemon Squeezy event | What to do in NetLicensing |
|----------------|---------------------|
| `order_created` | One-time purchase: create the licensee and the license. A subscription order is licensed by `subscription_payment_success` |
| `subscription_created` | Create the licensee; no license yet |
| `subscription_payment_success` | Create one license per paid subscription invoice, numbered with the invoice id. Lemon Squeezy sends it for the first payment and for every renewal |
| `subscription_updated` | Plan or status change: create a license from the new template and deactivate the old one |
| `subscription_cancelled`, `subscription_expired` | Deactivate the license (`active=false`) |
| `subscription_paused`, `subscription_unpaused` | Deactivate on pause; reactivate or create a new license on unpause |
| `subscription_payment_failed`, `subscription_payment_recovered` | Your choice: keep access during the platform's retry period, or deactivate. `subscription_payment_recovered` always arrives together with `subscription_payment_success`, so do not add a period for it |
| `order_refunded`, `subscription_payment_refunded` | Deactivate the license (`active=false`) |

Lemon Squeezy recommends listening to at least `order_created`, `subscription_created`, `subscription_payment_success` and `subscription_updated`.

## Check that the request comes from Lemon Squeezy

The header `X-Signature` holds the hex HMAC-SHA256 of the **raw payload**, keyed with the signing secret you set when you create the webhook (6 to 40 characters). Compare with a timing-safe function.

## Retries and duplicates

Answer with `200`. Any other status is retried up to three more times with exponential backoff (the documentation's example is 5, 25 and 125 seconds), then the delivery counts as failed.

## Match the customer and the plan

Customer id and email are in the order (`customer_id`, `user_email`). Custom data passed through checkout appears as `meta.custom_data` on order, subscription and license key events: use it to carry your NetLicensing `licenseeNumber` or `licenseTemplateNumber`. Lemon Squeezy's documentation links to its "Taking payments" guide for how to pass custom data; we did not check that page.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Lemon Squeezy               Your receiver                 NetLicensing
|                           |                             |
| payment_success --------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=customer id         |
|                           | POST /license ------------->|
|                           |  number=invoice id          |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Lemon Squeezy calls your receiver

```http
POST /webhooks/lemon-squeezy HTTP/1.1
Content-Type: application/json
X-Event-Name: subscription_payment_success
X-Signature: <hex HMAC-SHA256>

{
  "meta": { "event_name": "subscription_payment_success", "custom_data": { } },
  "data": {
    "type": "subscription-invoices",
    "id": "123456",
    "attributes": { "subscription_id": 4321, "customer_id": 98765, "billing_reason": "initial" }
  }
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_lemon_squeezy(raw_body: bytes, signature_header: str, secret: str) -> bool:
    # signature_header = request.headers["X-Signature"]
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_header)
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. The attributes follow Lemon Squeezy's subscription invoice object, where `billing_reason` is `initial` for the first payment.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# subscription_created or order_created: the customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=ls-98765&name=Jane%20Doe" \
  $NLIC/licensee

# subscription_payment_success: one license per paid subscription invoice
curl --user $AUTH --header "Accept: application/json" \
  --data "number=ls-inv-123456&licenseeNumber=ls-98765&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# order_refunded or subscription_payment_refunded
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/ls-inv-123456
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Lemon Squeezy: webhooks](https://docs.lemonsqueezy.com/help/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Lemon Squeezy: event types](https://docs.lemonsqueezy.com/help/webhooks/event-types){:target="_blank"}{:rel="noopener nofollow"}
- [Lemon Squeezy: signing requests](https://docs.lemonsqueezy.com/help/webhooks/signing-requests){:target="_blank"}{:rel="noopener nofollow"}
- [Lemon Squeezy: webhook requests](https://docs.lemonsqueezy.com/help/webhooks/webhook-requests){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Lemon Squeezy connector. The Lemon Squeezy details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
