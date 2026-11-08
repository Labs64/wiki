---
layout: default
title: "WooCommerce Licensing Integration"
nav_title: "WooCommerce"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 280
description: "Connect WooCommerce to NetLicensing: a completed order creates a customer and licenses, a cancelled or refunded order deactivates them. HMAC check."
permalink: woocommerce
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: WooCommerce signs its webhooks with HMAC-SHA256. Your receiver creates the licensee and one license per line item when an order is completed, and deactivates them when the order is cancelled or refunded.

[WooCommerce](https://woocommerce.com){:target="_blank"}{:rel="noopener nofollow"} can send webhooks for coupons, customers, orders, products and custom actions. You create a webhook with a name, status, topic, delivery URL and secret. This guide covers orders and customers; the WooCommerce Subscriptions documentation we checked describes no webhook topics.

## What WooCommerce sends

WooCommerce sends an HTTP `POST` with `Content-Type: application/json`. For orders and customers the body is the REST API resource (`/wc/v3/...`), so an order carries its `line_items`, billing details with `email` and its `status`. Delivery headers include `X-WC-Webhook-Topic`, `X-WC-Webhook-Resource`, `X-WC-Webhook-Event`, `X-WC-Webhook-ID`, `X-WC-Webhook-Delivery-ID` and `X-WC-Webhook-Signature`. Topics have the form `resource.event`, for example `order.created`.

## Map WooCommerce events to NetLicensing

| WooCommerce event | What to do in NetLicensing |
|----------------|---------------------|
| `order.created` | A new order exists, possibly not yet paid; wait for the paid or completed status |
| `order.updated` (status becomes completed) | Create a licensee from the billing email, then create a license for each `line_items` entry |
| `customer.created` | Create a licensee |
| `order.updated` (status cancelled or refunded) | Deactivate the license (`active=false`) |
| `order.deleted` | Payload is only `{"id": ...}`: look up the licenses you stored for that order id |

## Check that the request comes from WooCommerce

The header `X-WC-Webhook-Signature` is the Base64-encoded HMAC-SHA256 of the **payload body**, keyed with the webhook secret. If you leave the secret empty, WooCommerce uses the consumer secret of the API user. The first time you save a webhook as *Active*, WooCommerce sends a **ping** to the delivery URL: a form body `webhook_id=<id>`, not JSON, so your receiver must answer it with a `2xx` response.

## Retries and duplicates

A response with a `2xx`, `301` or `302` status counts as success. In the source code, a delivery is made once and there is no retry loop. WooCommerce disables a webhook after repeated consecutive failures (documented as more than five; the threshold can be changed with the filter `woocommerce_max_webhook_delivery_failures`). Check the delivery log under *WooCommerce > Status > Logs* (source `webhooks-delivery`). Because retries are not guaranteed, make the receiver fast and reconcile from the WooCommerce REST API if you suspect a missed event.

## Match the customer and the plan

Use the customer id or the billing email from the order as the NetLicensing licensee `number`, and the order and line item ids for the license `number`, so a retried webhook cannot create a second license; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids). Map each line item's product id to your `licenseTemplateNumber` with a lookup table.

## Example: the calls

```text
WooCommerce                 Your receiver                 NetLicensing
|                           |                             |
| order.updated ----------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=customer            |
|                           | POST /license ------------->|
|                           |  number=order-item          |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. WooCommerce calls your receiver

```http
POST /webhooks/woocommerce HTTP/1.1
Content-Type: application/json
X-WC-Webhook-Topic: order.updated
X-WC-Webhook-Delivery-ID: <id>
X-WC-Webhook-Signature: <base64 HMAC-SHA256>

{
  "id": 727,
  "status": "completed",
  "customer_id": 25,
  "billing": { "email": "jane@example.com" },
  "line_items": [ { "id": 315, "product_id": 93 } ]
}
```

### 2. Your receiver checks the request

```python
import base64, hashlib, hmac

def verify_woocommerce(raw_body: bytes, signature_header: str, secret: str) -> bool:
    # signature_header = request.headers["X-WC-Webhook-Signature"]
    digest = hmac.new(secret.encode(), raw_body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64encode(digest).decode(), signature_header)
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. When you activate a webhook, WooCommerce first sends a ping with the form body `webhook_id=<id>`: it is not an order, so just answer it with `2xx`.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# Order completed: the customer id or billing email becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=wc-25&name=Jane%20Doe" \
  $NLIC/licensee

# Order completed: one license per line item
curl --user $AUTH --header "Accept: application/json" \
  --data "number=wc-727-315&licenseeNumber=wc-25&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Order cancelled or refunded
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/wc-727-315
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [WooCommerce: webhooks](https://woocommerce.com/document/webhooks/){:target="_blank"}{:rel="noopener nofollow"}
- [WooCommerce: webhook class source](https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/includes/class-wc-webhook.php){:target="_blank"}{:rel="noopener nofollow"}
- [WooCommerce: REST API reference](https://woocommerce.github.io/woocommerce-rest-api-docs/){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a WooCommerce connector. The WooCommerce details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
