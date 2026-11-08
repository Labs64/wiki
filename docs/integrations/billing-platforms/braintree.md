---
layout: default
title: "Braintree Licensing Integration"
nav_title: "Braintree"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 40
description: "Connect Braintree subscriptions to NetLicensing: activation and each new billing cycle create licenses, cancellation deactivates them. SDK signature check."
permalink: braintree
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Braintree sends signed webhook notifications that you parse with the Braintree SDK. Your receiver creates a license when a subscription goes active and another for each new billing cycle, and deactivates it when the subscription is canceled or expires.

[Braintree](https://www.braintreepayments.com){:target="_blank"}{:rel="noopener nofollow"}, a PayPal service, sends webhook notifications for subscription events. You configure the destination URL in the Braintree Control Panel (Webhooks tab); a valid HTTPS path is required.

## What Braintree sends

Braintree sends an HTTPS `POST` with two form-encoded parameters, `bt_signature` and `bt_payload`. The notification has a `timestamp` (UTC), a `kind` and the Braintree object, for subscriptions the subscription object (`id`, `plan_id`, `status`, `price`, `next_billing_date`, `failure_count`, `days_past_due`, `payment_method_token` and more).

## Map Braintree events to NetLicensing

| Braintree event | What to do in NetLicensing |
|----------------|---------------------|
| `subscription_went_active` | Create a license from the plan's template (fires when the first authorized transaction is created, and when a past-due subscription recovers) |
| `subscription_charged_successfully` | A subscription moved to the next billing cycle: create one license for that cycle. Braintree also sends it for a mid-cycle proration charge on an upgrade, so number the license `<subscription id>-<current_billing_cycle>`: a second charge in the same cycle then fails as a duplicate |
| `subscription_canceled`, `subscription_expired` | Deactivate the license (`active=false`) |
| `subscription_went_past_due` | Your choice: keep access during the platform's retry period, or deactivate (fires when the initial transaction of a billing cycle is declined) |
| `subscription_charged_unsuccessfully` | Your choice: keep access during the platform's retry period, or deactivate |
| `subscription_trial_ended`, `subscription_billing_skipped` | Informational; act only if your plans depend on them |

## Check that the request comes from Braintree

The payload is signed. Pass `bt_signature` and `bt_payload` to the parse method of a Braintree SDK, for example `gateway.webhook_notification.parse(bt_signature, bt_payload)`; an invalid signature raises an exception. The pages we checked do not describe the HMAC algorithm itself, so use the SDK rather than your own implementation.

## Retries and duplicates

A response slower than 30 seconds counts as a timeout and is retried. Braintree resends every hour for up to 24 hours in production (3 hours in sandbox) until it gets a `2xx` response within 30 seconds. Notifications may not be delivered in sequence: use the timestamp.

## Match the customer and the plan

The subscription object page does **not** list a customer id, name or email, and no custom fields. Your receiver therefore needs its own record of which customer a Braintree subscription id belongs to, for example saved when your app creates the subscription. Map `plan_id` to your `licenseTemplateNumber`. In a webhook, only the 20 most recent `transactions` of a subscription are included.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Braintree                   Your receiver                 NetLicensing
|                           |                             |
| charged_successfully ---->|                             |
|                           | SDK parse (verifies)        |
|                           | POST /licensee ------------>|
|                           |  number=customer            |
|                           | POST /license ------------->|
|                           |  number=sub-cycle           |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Braintree calls your receiver

```http
POST /webhooks/braintree HTTP/1.1
Content-Type: application/x-www-form-urlencoded

bt_signature=<signature>&bt_payload=<base64 payload>
```

### 2. Your receiver checks the request

```python
import braintree  # official Braintree SDK

gateway = braintree.BraintreeGateway(braintree.Configuration(
    braintree.Environment.Sandbox, merchant_id="...", public_key="...", private_key="..."))

# form = the POSTed form fields (bt_signature, bt_payload)
notification = gateway.webhook_notification.parse(
    form["bt_signature"], form["bt_payload"])   # raises an exception if the signature is invalid
subscription = notification.subscription
license_number = f"{subscription.id}-{subscription.current_billing_cycle}"
```

Braintree does not document the signing algorithm, so use the SDK. `current_billing_cycle` is part of the subscription object; numbering by cycle keeps a mid-cycle proration charge from adding a second period.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# Your own customer record: Braintree's subscription object carries no customer id
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=bt-cust-42&name=Jane%20Doe" \
  $NLIC/licensee

# subscription_went_active / subscription_charged_successfully: one license per billing cycle
curl --user $AUTH --header "Accept: application/json" \
  --data "number=sub_abc-2&licenseeNumber=bt-cust-42&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# subscription_canceled or subscription_expired with paid time left, or a refund
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/sub_abc-2
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Braintree: webhooks overview](https://developer.paypal.com/braintree/docs/guides/webhooks/overview){:target="_blank"}{:rel="noopener nofollow"}
- [Braintree: parse a webhook](https://developer.paypal.com/braintree/docs/guides/webhooks/parse){:target="_blank"}{:rel="noopener nofollow"}
- [Braintree: subscription webhooks](https://developer.paypal.com/braintree/docs/reference/general/webhooks/subscription){:target="_blank"}{:rel="noopener nofollow"}
- [Braintree: subscription object](https://developer.paypal.com/braintree/docs/reference/response/subscription){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Braintree connector. The Braintree details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
