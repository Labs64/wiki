---
layout: default
title: "Shopify Licensing Integration"
nav_title: "Shopify"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 250
description: "Connect Shopify to NetLicensing: the orders/paid webhook creates a customer and a license per line item, cancelled orders deactivate them. HMAC check."
permalink: shopify
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: a Shopify app subscribes to order webhooks, which Shopify signs with HMAC-SHA256. Your receiver creates a NetLicensing licensee and one license per line item when an order is paid, and deactivates them when the order is cancelled.

[Shopify](https://www.shopify.com){:target="_blank"}{:rel="noopener nofollow"} sends webhooks for order and customer events. Webhooks are subscribed by an app, either in the app configuration file (`topics = [...]` in `shopify.app.toml`) or through the GraphQL Admin API. This guide covers orders; it does not cover third-party subscription apps.

## What Shopify sends

Shopify sends an HTTPS `POST` with a JSON body, by default the full order resource. Useful headers: `X-Shopify-Topic`, `X-Shopify-Shop-Domain`, `X-Shopify-Webhook-Id` and `X-Shopify-Event-Id`. The order carries `id`, `email`, `customer.id`, `line_items`, `note_attributes` and `tags`. Use `include_fields` to narrow the payload.

## Map Shopify events to NetLicensing

| Shopify event | What to do in NetLicensing |
|----------------|---------------------|
| `orders/paid` | Create a licensee from `email` and `customer.id`, then create a license for each `line_items` entry |
| `customers/create` | Create a licensee |
| `orders/cancelled` | Deactivate the license (`active=false`) |
| `orders/updated`, `orders/edited` | Read the changed order; adjust or replace licenses if line items changed |
| `orders/fulfilled` | Use it instead of `orders/paid` if you create licenses on fulfillment |

## Check that the request comes from Shopify

The header `X-Shopify-Hmac-Sha256` holds the Base64-encoded HMAC-SHA256 of the **raw request body**, keyed with the app's client secret. Compare in constant time. Shopify delivers webhooks over HTTPS only.

## Retries and duplicates

If Shopify gets no response or an error (any non-2xx, including a 3xx), it retries 8 times over the next 4 hours. The timeout is 1 second to connect and 5 seconds for the whole request. After 8 consecutive failures, a subscription created through the Admin API is deleted automatically; subscriptions declared in the app configuration file are not. Use `X-Shopify-Webhook-Id` to deduplicate deliveries.

## Match the customer and the plan

Use the Shopify customer id (`customer.id`) as the NetLicensing licensee `number`, and the order and line item ids for the license `number`, for example `<order id>-<line item id>`, so a retried webhook cannot create a second license; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids). Map each line item's product to your `licenseTemplateNumber` with a lookup table. The `note_attributes` and `tags` of an order are free-form and can carry your own values.

## Example: the calls

```text
Shopify                     Your receiver                 NetLicensing
|                           |                             |
| orders/paid ------------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=customer.id         |
|                           | POST /license ------------->|
|                           |  number=order-item          |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Shopify calls your receiver

```http
POST /webhooks/shopify HTTP/1.1
Content-Type: application/json
X-Shopify-Topic: orders/paid
X-Shopify-Shop-Domain: example.myshopify.com
X-Shopify-Webhook-Id: <id>
X-Shopify-Hmac-Sha256: <base64 HMAC-SHA256>

{
  "id": 820982911946154508,
  "email": "jane@example.com",
  "customer": { "id": 115310627314723954 },
  "line_items": [ { "id": 466157049, "product_id": 632910392 } ],
  "note_attributes": [],
  "tags": ""
}
```

### 2. Your receiver checks the request

```python
import base64, hashlib, hmac

def verify_shopify(raw_body: bytes, signature_header: str, secret: str) -> bool:
    # signature_header = request.headers["X-Shopify-Hmac-Sha256"]
    digest = hmac.new(secret.encode(), raw_body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64encode(digest).decode(), signature_header)
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. The key is your app's client secret.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# orders/paid: the Shopify customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=115310627314723954&name=Jane%20Doe" \
  $NLIC/licensee

# orders/paid: one license per line item
curl --user $AUTH --header "Accept: application/json" \
  --data "number=820982911946154508-466157049&licenseeNumber=115310627314723954&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# orders/cancelled
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/820982911946154508-466157049
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Shopify: webhooks](https://shopify.dev/docs/apps/build/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Shopify: verify deliveries](https://shopify.dev/docs/apps/build/webhooks/verify-deliveries){:target="_blank"}{:rel="noopener nofollow"}
- [Shopify: subscribe to webhooks](https://shopify.dev/docs/apps/build/webhooks/subscribe){:target="_blank"}{:rel="noopener nofollow"}
- [Shopify: delivery structure](https://shopify.dev/docs/apps/build/webhooks/delivery-structure){:target="_blank"}{:rel="noopener nofollow"}
- [Shopify: webhook topics reference](https://shopify.dev/docs/api/webhooks/latest){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Shopify connector. The Shopify details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
