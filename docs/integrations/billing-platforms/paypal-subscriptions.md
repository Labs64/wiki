---
layout: default
title: "PayPal Subscriptions Licensing Integration"
nav_title: "PayPal Subscriptions"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 210
description: "Connect PayPal Subscriptions to NetLicensing: each subscription payment creates a license, cancellation deactivates it. Signature check, retries, IDs."
permalink: paypal-subscriptions
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: PayPal signs its webhooks, and you verify them with PayPal's certificate or its verification API. Your receiver creates one NetLicensing license per subscription payment and deactivates the license when the subscription is cancelled, suspended or refunded.

Use this guide if you sell through **PayPal Subscriptions** on your own site or app and want each subscription to drive licenses in NetLicensing. If you sell through [NetLicensing Shop](paypal), PayPal payments, including recurring ones, work without any code and you do not need this guide.

PayPal notifies you with webhooks: HTTPS posts from PayPal to an endpoint on your server. PayPal only delivers webhooks to port 443.

## What PayPal sends

PayPal sends JSON with `event_type` and `resource`. The webhook is configured on your PayPal app, where you select the event types and receive a **webhook id**.

The subscription resource, as described in PayPal's Subscriptions API schema, has `id` (the PayPal subscription id), `plan_id`, `custom_id`, `subscriber` (with `name`, `email_address` and `payer_id`), `status` and `billing_info`. PayPal's documentation we read does not list the exact fields of each webhook event, so inspect a mock event from the PayPal webhook simulator, or fetch the subscription from the PayPal API using the id in the event.

## Map PayPal events to NetLicensing

| PayPal event | What to do in NetLicensing |
|----------------|---------------------|
| `BILLING.SUBSCRIPTION.CREATED` | A subscription was created. Wait for activation before you issue a license |
| `BILLING.SUBSCRIPTION.ACTIVATED` | Create the licensee from the subscriber; the paid periods arrive as `PAYMENT.SALE.COMPLETED` |
| `PAYMENT.SALE.COMPLETED` | PayPal describes it as "a payment is made on a subscription": create one license per payment, numbered with the sale `id`. Check in the sandbox that the first payment of your plan sends it too |
| `BILLING.SUBSCRIPTION.UPDATED` | A subscription was updated: read it and replace the license if the plan changed |
| `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.EXPIRED` | Deactivate the license (`active=false`) |
| `BILLING.SUBSCRIPTION.SUSPENDED` | Hold or deactivate the license until the subscription is active again |
| `BILLING.SUBSCRIPTION.PAYMENT.FAILED` | Your choice: keep access during the platform's retry period, or deactivate |
| `PAYMENT.SALE.REFUNDED` | A merchant refunded a sale: deactivate the license (`active=false`) |
| `CUSTOMER.DISPUTE.CREATED` | A dispute was created: hold the license until it is resolved |

## Check that the request comes from PayPal

PayPal signs each webhook. The headers are `paypal-transmission-id`, `paypal-transmission-time`, `paypal-transmission-sig` and `paypal-cert-url`. To verify it yourself, build the string `transmissionId|timeStamp|webhookId|crc32`, where `crc32` is the CRC32 checksum, in decimal form, of the **original raw body** (do not parse and re-stringify it). Download the public key from the certificate at `paypal-cert-url` (cache it) and validate the Base64 signature in `paypal-transmission-sig` against that string. PayPal states that self verification is faster and avoids an API dependency.

Alternatively, post the event back to PayPal's `verify-webhook-signature` REST endpoint (`/v1/notifications/verify-webhook-signature`; PayPal's example uses the sandbox host `api.sandbox.paypal.com`) with an access token. This does not work for mock events, which use the webhook id `WEBHOOK_ID`.

## Retries and duplicates

Return HTTP `200` or another `2xx` status. Any non-2xx status makes PayPal retry delivery up to 25 times over 3 days.

## Match the customer and the plan

Use the PayPal payer id (`subscriber.payer_id`) or the subscription `id` (`I-...`) as the NetLicensing licensee `number`, and the sale `id` of each payment as the license `number`; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids). Map `plan_id` to your `licenseTemplateNumber` with a lookup table. When you create the subscription through the PayPal API, you can set `custom_id` (up to 127 characters, "can be invoice id") to carry your own value, such as an existing NetLicensing licensee number.

## Example: the calls

```text
PayPal                      Your receiver                 NetLicensing
|                           |                             |
| PAYMENT.SALE.COMPLETED -->|                             |
|                           | keep headers + body         |
|< verify-webhook-signature |                             |
|                           | POST /licensee ------------>|
|                           |  number=payer id            |
|                           | POST /license ------------->|
|                           |  number=sale id             |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. PayPal calls your receiver

```http
POST /webhooks/paypal HTTP/1.1
Content-Type: application/json
PAYPAL-AUTH-ALGO: <algorithm>
PAYPAL-CERT-URL: <certificate URL>
PAYPAL-TRANSMISSION-ID: <id>
PAYPAL-TRANSMISSION-SIG: <base64 signature>
PAYPAL-TRANSMISSION-TIME: 2026-11-08T10:00:00Z

{
  "id": "WH-...",
  "event_type": "PAYMENT.SALE.COMPLETED",
  "resource": { "id": "<sale id>" }
}
```

### 2. Your receiver checks the request

Verify with PayPal's `verify-webhook-signature` endpoint (step 3), or verify the certificate signature yourself as described above. Inspect the full `resource` of a sandbox event before you map more fields.

### 3. Your receiver calls PayPal

```bash
# Live: https://api-m.paypal.com   Sandbox: https://api-m.sandbox.paypal.com
curl --request POST https://api-m.paypal.com/v1/notifications/verify-webhook-signature \
  --header "Authorization: Bearer $PAYPAL_ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "auth_algo":         "<PAYPAL-AUTH-ALGO header>",
    "cert_url":          "<PAYPAL-CERT-URL header>",
    "transmission_id":   "<PAYPAL-TRANSMISSION-ID header>",
    "transmission_sig":  "<PAYPAL-TRANSMISSION-SIG header>",
    "transmission_time": "<PAYPAL-TRANSMISSION-TIME header>",
    "webhook_id":        "<your webhook id>",
    "webhook_event":     <the received event JSON>
  }'
# -> {"verification_status": "SUCCESS"}   (or "FAILURE")
```

The request fields and the `SUCCESS`/`FAILURE` result come from PayPal's published OpenAPI specification for Webhooks v1. Mock events from the simulator cannot be verified this way.

### 4. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# BILLING.SUBSCRIPTION.ACTIVATED: the PayPal payer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=QYR5Z8XDVJNXQ&name=Jane%20Doe" \
  $NLIC/licensee

# PAYMENT.SALE.COMPLETED: one license per payment, numbered with the sale id
curl --user $AUTH --header "Accept: application/json" \
  --data "number=80021663DE681814L&licenseeNumber=QYR5Z8XDVJNXQ&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# PAYMENT.SALE.REFUNDED: deactivate the license of that sale
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/80021663DE681814L
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [PayPal: webhooks](https://developer.paypal.com/api/rest/webhooks/){:target="_blank"}{:rel="noopener nofollow"}
- [PayPal: webhook event names](https://developer.paypal.com/api/rest/webhooks/event-names/){:target="_blank"}{:rel="noopener nofollow"}
- [PayPal: verify webhook signatures](https://developer.paypal.com/api/rest/webhooks/rest/){:target="_blank"}{:rel="noopener nofollow"}
- [PayPal: Subscriptions webhooks](https://developer.paypal.com/docs/subscriptions/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [PayPal: Subscriptions API schema](https://developer.paypal.com/api/subscriptions/v1/schema.json){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a PayPal connector. The PayPal details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
