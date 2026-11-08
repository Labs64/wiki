---
layout: default
title: "SendOwl Licensing Integration"
nav_title: "SendOwl"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 240
description: "Connect SendOwl to NetLicensing: completed orders and subscription payments create licenses, cancellations and refunds deactivate them. HMAC check."
permalink: sendowl
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: SendOwl signs its webhooks with HMAC-SHA256. Your receiver creates a license for each product in a completed one-time order, one license per subscription payment, and deactivates it on cancellation, refund or chargeback.

[SendOwl](https://www.sendowl.com){:target="_blank"}{:rel="noopener nofollow"} sells digital products. A Gateway connector for SendOwl was requested ([issue #5](https://github.com/Labs64/NetLicensing-Gateway/issues/5){:target="_blank"}{:rel="noopener"}) but does not exist. The webhook route below does not need one.

Create the webhook in *Settings → Advanced settings → Developer → Webhooks → Add a webhook*. You can limit it to orders that contain a product, a discount code, or a sale referred by an affiliate.

## What SendOwl sends

SendOwl sends an HTTP `POST` with a **raw JSON body** (not form parameters) that holds the order under an `order` key. The event that fired is in the header `X-SENDOWL-EVENT`; the body shows the order's state at that moment. Useful fields: `buyer_email`, `buyer_name`, `id` (the order id), `state`, `for_subscription`, `cart.cart_items[].product.id` and `order_custom_checkout_fields`.

## Map SendOwl events to NetLicensing

| SendOwl event | What to do in NetLicensing |
|----------------|---------------------|
| `complete` (Order completed) | One-time products: create a licensee from `buyer_email`, then a license for each cart item. Subscription orders are licensed by `new_payment` |
| `free` (Free order issued) | Same as a completed order |
| `subscription_active` | Create the licensee if it does not exist yet; no license |
| `new_payment` | SendOwl: "A payment has been made on any type of order", including the first payment of a subscription. For subscription orders, create one license per payment |
| `subscription_cancelling` | Cancelled, access allowed until the period ends: deactivate at period end |
| `subscription_cancelled`, `subscription_complete` | Deactivate the license (`active=false`) (`subscription_complete`: all payments were made; SendOwl does not revoke access) |
| `refund`, `chargeback` | Deactivate the license (`active=false`) |
| `failed`, `fraud_review`, `in_dispute` | No license, or hold the license until the order resolves |

Other events: `imported` (order imported from another system) and `subscription_setup` (the buyer set up a subscription at the gateway, and SendOwl waits for it to activate).

## Check that the request comes from SendOwl

Webhooks you create in the dashboard now use the current scheme, which sends the header `X-SENDOWL-HMAC-SHA256`. Compute the SHA256 HMAC of the **raw request JSON**, keyed with the *Secret* of your **Signing key** (*Settings → Advanced settings → Developer → SendOwl API*), Base64-encode it and compare. Webhooks created under the original scheme still run, but send no signature and no event header, so upgrade them.

## Retries and duplicates

SendOwl queues a request when an order changes state and sends it about 10 seconds later. A `2XX` or `3XX` response is a success. Any other response is retried with exponential back-off, up to 10 attempts in total; after the tenth failure SendOwl stops and emails the account admin. *Test web hook* sends a sample call to your URL.

## Match the customer and the plan

The buyer is identified by `buyer_email` and the order by `id`; the sample payload has no separate subscription id. Map `cart.cart_items[].product.id` to your `licenseTemplateNumber` with a lookup table, or use the order's custom checkout fields to carry your own value. SendOwl's webhook page also points to its Zapier integration as a simpler alternative to webhooks.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
SendOwl                     Your receiver                 NetLicensing
|                           |                             |
| new_payment ------------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=email               |
|                           | POST /license ------------->|
|                           |  number=order-period        |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. SendOwl calls your receiver

```http
POST /webhooks/sendowl HTTP/1.1
Content-Type: application/json
X-SENDOWL-EVENT: new_payment
X-SENDOWL-HMAC-SHA256: <base64 HMAC-SHA256>

{
  "order": {
    "id": 12345,
    "state": "complete",
    "for_subscription": true,
    "buyer_email": "jane@example.com",
    "buyer_name": "Jane Doe",
    "cart": { "cart_items": [ { "product": { "id": 678 } } ] }
  }
}
```

### 2. Your receiver checks the request

```python
import base64, hashlib, hmac

def verify_sendowl(raw_body: bytes, signature_header: str, secret: str) -> bool:
    # signature_header = request.headers["X-SENDOWL-HMAC-SHA256"]
    digest = hmac.new(secret.encode(), raw_body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64encode(digest).decode(), signature_header)
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. The key is the *Secret* of your SendOwl signing key. Webhooks created under the original scheme are not signed; recreate them.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# complete or subscription_active: the buyer's email becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=jane%40example.com&name=Jane%20Doe" \
  $NLIC/licensee

# complete (one-time) or new_payment (subscription): one license per order item or payment
curl --user $AUTH --header "Accept: application/json" \
  --data "number=so-12345-2026-11&licenseeNumber=jane%40example.com&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# refund or chargeback
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/so-12345-2026-11
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

The sample payload has no payment id, so build the number from the order id and the billing period you track.

## Sources

- [SendOwl: using webhooks](https://help.sendowl.com/help/using-web-hooks){:target="_blank"}{:rel="noopener nofollow"}
- [SendOwl: API introduction](https://dashboard.sendowl.com/developers/api/introduction){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a SendOwl connector. The SendOwl details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
