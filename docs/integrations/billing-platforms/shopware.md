---
layout: default
title: "Shopware 6 Licensing Integration"
nav_title: "Shopware"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 260
description: "Connect Shopware 6 to NetLicensing: app webhooks or the Flow Builder Call URL action create licenses after payment and deactivate them on cancellation."
permalink: shopware
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Shopware 6 calls your URL through a signed app webhook or the Flow Builder action *Call URL*. Your receiver creates the licensee and the license when the payment is complete, and deactivates the license when the order is cancelled.

Shopware 6 has two ways to call an external URL after an event:

- **App System webhooks.** An app declares webhooks in its manifest, for example `<webhook name="product-changed" url="..." event="product.written"/>`, and Shopware signs each request.
- **Flow Builder, action *Call URL (Webhook)*.** You build a flow in the Administration without an app. This action needs the **Shopware Commercial** extension ("from the Evolve Plan onwards") and supports GET, POST, PUT, PATCH and DELETE.

Shopware 5 documentation is no longer maintained by Shopware: its developer site points to SafeFive. This guide covers Shopware 6.

## What Shopware sends

An App System webhook is an HTTP `POST` with a JSON body: `source` (`url`, `appVersion`, `shopId`, `eventId`), `data` (the event name and its payload) and `timestamp`. The `eventId` does not change if Shopware retries the webhook. The Flow Builder action has no fixed schema: you map parameters and write the body with Shopware variables.

## Map Shopware events to NetLicensing

| Shopware event | What to do in NetLicensing |
|----------------|---------------------|
| `checkout.order.placed` | An order was placed (the payload names the `order` entity): create the licensee |
| `checkout.customer.register` | Create a licensee |
| `state_enter.order_transaction.state.paid` (Flow Builder trigger) | Payment is complete: create a license from the plan's template |
| `state_enter.order.state.cancelled` (Flow Builder trigger; the `state_enter.order.state.*` events also exist as app webhooks) | Deactivate the license (`active=false`) |

App webhooks for entity changes use the form `order.written` and `order.deleted`, with the payload `entity`, `operation`, `primaryKey` and `payload`.

## Check that the request comes from Shopware

**App System webhooks:** the header `shopware-shop-signature` is a SHA256 HMAC of the request body, signed with the secret your app received from the shop during registration. Shopware's documentation points to its PHP SDK and Symfony bundle for the verification code. **Flow Builder Call URL:** it supports Basic Auth and custom headers; the documentation we checked describes no request signing, so use a secret header or Basic Auth and keep the endpoint private to Shopware.

## Retries and duplicates

Shopware's documentation says that app webhooks are retried (the `eventId` stays the same), but gives no retry policy, count or backoff. Treat `eventId` as the deduplication key.

## Match the customer and the plan

Neither the Flow Builder page nor the events page lists fixed fields for customer email, order id or product id: with the app route, request the data you need through the event's payload or the Shopware APIs; with Flow Builder, add the variables you need to the body. Map each product to your `licenseTemplateNumber` with a lookup table.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Shopware                    Your receiver                 NetLicensing
|                           |                             |
| order paid -------------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=customer no.        |
|                           | POST /license ------------->|
|                           |  number=order-line          |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Shopware calls your receiver

```http
POST /webhooks/shopware HTTP/1.1
Content-Type: application/json
shopware-shop-signature: <HMAC-SHA256 of the body>

{
  "source": { "url": "https://shop.example.com", "appVersion": "1.0.0", "shopId": "<shop id>", "eventId": "<event id>" },
  "data": { "event": "state_enter.order_transaction.state.paid", "payload": { } },
  "timestamp": 1731052800
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_shopware_app(raw_body: bytes, signature_header: str, secret: str) -> bool:
    # signature_header = request.headers["shopware-shop-signature"]
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_header)
```

The key is the shop secret your app received at registration. This matches the check in Shopware's official PHP app SDK (`RequestVerifier`, `hash_hmac('sha256', ...)`), which you can use directly. For the Flow Builder *Call URL* action, protect the URL with Basic auth or a secret header.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# checkout.customer.register or the first paid order: your customer number becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=SW-10001&name=Jane%20Doe" \
  $NLIC/licensee

# Payment state paid: one license per order line
curl --user $AUTH --header "Accept: application/json" \
  --data "number=SW-ORDER-10045-1&licenseeNumber=SW-10001&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Order state cancelled
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/SW-ORDER-10045-1
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Shopware: Flow Builder](https://docs.shopware.com/en/shopware-6-en/settings/flow-builder){:target="_blank"}{:rel="noopener nofollow"}
- [Shopware: webhooks (apps)](https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/webhook.html){:target="_blank"}{:rel="noopener nofollow"}
- [Shopware: webhook events reference](https://developer.shopware.com/docs/resources/references/app-reference/webhook-events-reference.html){:target="_blank"}{:rel="noopener nofollow"}
- [Shopware: app signature verification](https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-signature-verification.html){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Shopware connector. The Shopware details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
