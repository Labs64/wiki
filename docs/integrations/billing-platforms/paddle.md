---
layout: default
title: "Paddle Licensing Integration"
nav_title: "Paddle"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 190
description: "Connect Paddle Billing to NetLicensing: each completed transaction creates a license, cancellations deactivate it. Signed webhooks, retries, ID matching."
permalink: paddle
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Paddle signs every webhook with an HMAC-SHA256 `Paddle-Signature` header. Your receiver creates one NetLicensing license per completed transaction, for the first purchase and for each renewal, and deactivates the license when the subscription is canceled.

[Paddle](https://www.paddle.com){:target="_blank"}{:rel="noopener nofollow"} Billing sends webhooks for customer and subscription events. This guide covers **Paddle Billing**. Paddle's documentation states that Paddle Classic no longer accepts new signups; existing Classic subscriptions stay untouched until you choose to migrate.

## What Paddle sends

Paddle sends an HTTP `POST` with a JSON envelope to the notification destination you configure: `event_id`, `event_type`, `occurred_at`, `notification_id` and `data`. In a subscription event, `data.id` is the subscription, `data.customer_id` the customer, and `data.items[].price.id` and `data.items[].price.product_id` identify what was bought.

## Map Paddle events to NetLicensing

| Paddle event | What to do in NetLicensing |
|----------------|---------------------|
| `customer.created` | Create a licensee (the email is in `data.email`) |
| `subscription.created` | No license yet: the first payment arrives as `transaction.completed` |
| `subscription.updated` | Catch-all for upgrades, downgrades, pauses, resumes and scheduled cancellations: read the subscription's status and items, then replace or deactivate the license |
| `subscription.canceled` | Deactivate the license (`active=false`) |
| `transaction.completed` | Create one license per completed transaction, numbered with the transaction id (`txn_...`). The `origin` field tells a checkout (`web`) from a renewal (`subscription_recurring`) and from a charge for a plan change (`subscription_update`); create a period license for `web` and `subscription_recurring` |
| `subscription.past_due`, `transaction.payment_failed` | Your choice: keep access during the platform's retry period, or deactivate |

Paddle documents no dedicated renewal event. A renewal creates a transaction with the `origin` `subscription_recurring`, and its `subscription_id` points to the subscription.

## Check that the request comes from Paddle

Paddle sends the header `Paddle-Signature` in the form `ts=<unix timestamp>;h1=<hex signature>`. The signature is an HMAC-SHA256 over the timestamp, a colon and the **raw request body**, keyed with the secret of your notification destination (it starts with `pdl_ntfset_`). Paddle also publishes the IP addresses it sends from, with separate lists for sandbox and live.

## Retries and duplicates

Answer with `200` within 5 seconds. In live mode Paddle makes up to 60 attempts over about two days; in sandbox it makes 3 attempts within about two minutes. Duplicates are possible, so deduplicate on `event_id`. Order is not guaranteed, so compare `occurred_at`. Notifications that exhaust their attempts get the status `failed` and can be replayed; Paddle keeps them for 90 days.

## Match the customer and the plan

The subscription payload holds the customer id but **not the email**. Use the Paddle customer id (`ctm_...`) as the NetLicensing licensee `number`: every later event carries it (`data.customer_id`), so your receiver can address the licensee directly. Take the email from `customer.created` for the licensee `name`. Use the transaction id (`txn_...`) as the license `number`, so a retried webhook cannot create a second license; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

To pick the license template, keep a lookup table from `price.id` (`pri_...`) or `product_id` (`pro_...`) to your `licenseTemplateNumber`. Paddle objects also carry a `custom_data` field for your own key-value data (customers, products and subscriptions show it in the documented payloads); the pages we checked do not describe how to set it, so the lookup table is the documented route.

## Example: the calls

```text
Paddle                      Your receiver                 NetLicensing
|                           |                             |
| transaction.completed --->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=ctm_...             |
|                           | POST /license ------------->|
|                           |  number=txn_...             |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Paddle calls your receiver

```http
POST /webhooks/paddle HTTP/1.1
Content-Type: application/json
Paddle-Signature: ts=1731052800;h1=<hex HMAC-SHA256>

{
  "event_id": "evt_01...",
  "event_type": "transaction.completed",
  "occurred_at": "2026-11-08T10:00:00.000Z",
  "notification_id": "ntf_01...",
  "data": {
    "id": "txn_01h04vsbhqc62t8hmd4z3b578c",
    "origin": "web",
    "customer_id": "ctm_01grnn4zta5a1mf02jjze7y2ys",
    "subscription_id": "sub_01h04vsc0qhwtsbsxh3422wjs4"
  }
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_paddle(raw_body: bytes, header: str, secret: str) -> bool:
    # header = request.headers["Paddle-Signature"], e.g. "ts=1731052800;h1=..."
    parts = dict(item.split("=", 1) for item in header.split(";"))
    signed = parts["ts"].encode() + b":" + raw_body
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, parts["h1"])
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. The secret is the one of your notification destination (`pdl_ntfset_...`).

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# customer.created: the Paddle customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=ctm_01grnn4zta5a1mf02jjze7y2ys&name=Jane%20Doe" \
  $NLIC/licensee

# transaction.completed with origin web or subscription_recurring: one license per transaction
curl --user $AUTH --header "Accept: application/json" \
  --data "number=txn_01h04vsbhqc62t8hmd4z3b578c&licenseeNumber=ctm_01grnn4zta5a1mf02jjze7y2ys&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Refund or immediate cancellation: deactivate that period's license
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/txn_01h04vsbhqc62t8hmd4z3b578c
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Paddle: webhooks overview](https://developer.paddle.com/webhooks/overview){:target="_blank"}{:rel="noopener nofollow"}
- [Paddle: signature verification](https://developer.paddle.com/webhooks/about/signature-verification){:target="_blank"}{:rel="noopener nofollow"}
- [Paddle: respond to webhooks](https://developer.paddle.com/webhooks/about/respond-to-webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Paddle: subscription.updated](https://developer.paddle.com/webhooks/subscriptions/subscription-updated){:target="_blank"}{:rel="noopener nofollow"}
- [Paddle: customer.created](https://developer.paddle.com/webhooks/customers/customer-created){:target="_blank"}{:rel="noopener nofollow"}
- [Paddle Classic status](https://classic.paddle.com/){:target="_blank"}{:rel="noopener nofollow"}
- [Paddle: transaction.completed](https://developer.paddle.com/webhooks/transactions/transaction-completed){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Paddle connector. The Paddle details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
