---
layout: default
title: "Lago Licensing Integration"
nav_title: "Lago"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 120
description: "Connect Lago open-source billing to NetLicensing: subscription start creates a license, termination deactivates it. JWT or HMAC signature, retries."
permalink: lago
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Lago signs its webhooks with HMAC or JWT. The license follows the subscription: your receiver creates it on `subscription.started` and deactivates it on `subscription.terminated`. Your product can report usage to Lago at the same time.

[Lago](https://getlago.com){:target="_blank"}{:rel="noopener nofollow"} builds open-source, API-first billing infrastructure, available as Lago Cloud and as a self-hosted deployment. You add webhook endpoints in the Lago dashboard (*Developers > Webhooks*) or through its API, and you can choose which events each endpoint receives (up to 10 endpoints).

## What Lago sends

Lago sends a `POST` with a JSON body for each event. The event types below are documented with schema examples at [swagger.getlago.com](https://swagger.getlago.com){:target="_blank"}{:rel="noopener nofollow"}; the pages we read do not list the payload fields, so open the schema example of each event you subscribe to before you map fields.

## Map Lago events to NetLicensing

| Lago event | What to do in NetLicensing |
|----------------|---------------------|
| `customer.created` | Create a licensee |
| `subscription.started` | A subscription starts; `previous_plan_code` is filled if it replaces another plan by upgrade or downgrade: create a license from the plan's template, from a licensing model without an end date (see [usage-based billing](billing-platforms#grant-time)) |
| `invoice.created` | An invoice was finalized: informational, because the license follows the subscription (Lago's event list has no `invoice.paid`; `invoice.payment_status_updated` and `payment.succeeded` report payments) |
| `payment.succeeded` | A payment succeeded: informational |
| `subscription.updated` | A subscription was updated, including a downgrade scheduled for the end of the period or changed entitlements: read it and adjust the license |
| `subscription.terminated` | The subscription ended; `next_plan_code` is filled on an upgrade or downgrade: deactivate the license (`active=false`) |
| `subscription.canceled` | Only for an `incomplete` subscription cancelled before it activated: no license |
| `invoice.payment_failure`, `invoice.payment_overdue`, `payment_request.payment_failure` | Your choice: keep access during the platform's retry period, or deactivate |
| `subscription.termination_alert` | Sent 45 days and 15 days before a subscription's end date: inform the customer |

Lago's event list has no `subscription.created`, `subscription.activated` or `invoice.paid`.

## Check that the request comes from Lago

For each endpoint you choose a signature option: **JWT** (the default, which embeds the payload in the signature header, so the header can grow large) or **HMAC** (a short signature header). In the dashboard find the *HMAC signature token* under *Developers > Webhooks*. The pages we read do not name the signature header or describe the HMAC computation, so take both from Lago's documentation and test with a delivery from the *Deliveries* tab before you rely on it.

## Retries and duplicates

Answer with `200`, `201`, `202` or `204`; any other response counts as failed. Lago makes up to 3 delivery attempts per event: the initial call plus 2 retries (self-hosted instances set this with `LAGO_WEBHOOK_ATTEMPTS`, default 3, and `LAGO_WEBHOOK_TIMEOUT_SECONDS`, default 30). Every event has a unique key (an idempotency key), visible in the delivery log. Plan for missed events: reconcile through the Lago API.

## Match the customer and the plan

Lago identifies customers by an `external_customer_id` that you set when you create the customer, and subscriptions by an `external_subscription_id`. Use your NetLicensing licensee number as the external customer id to link the two systems, and map the plan code to your `licenseTemplateNumber` with a lookup table. The pages we read do not say whether metadata appears in webhook payloads.

To report usage from your product, Lago takes `POST /api/v1/events` (and `/api/v1/events/batch` for up to 100 events) with `Authorization: Bearer <API key>`, a unique `transaction_id`, an `external_subscription_id`, a `code` and `properties`.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Lago                        Your receiver                 NetLicensing
|                           |                             |
| subscription.started ---->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=ext. customer       |
|                           | POST /license ------------->|
|                           |  number=external_id         |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Lago calls your receiver

```http
POST /webhooks/lago HTTP/1.1
Content-Type: application/json
X-Lago-Signature: <base64 HMAC-SHA256>
X-Lago-Signature-Algorithm: hmac
X-Lago-Unique-Key: <webhook id>

{
  "webhook_type": "subscription.started",
  "object_type": "subscription",
  "organization_id": "<organization id>",
  "subscription": {
    "lago_id": "<uuid>",
    "external_id": "lago-sub-acme-1",
    "external_customer_id": "acme-corp",
    "plan_code": "pro",
    "status": "active"
  }
}
```

### 2. Your receiver checks the request

```python
import base64, hashlib, hmac

def verify_lago(raw_body: bytes, signature_header: str, secret: str) -> bool:
    # signature_header = request.headers["X-Lago-Signature"]
    digest = hmac.new(secret.encode(), raw_body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64encode(digest).decode(), signature_header)
```

Choose **HMAC** as the endpoint's signature option and use the *HMAC signature token* from *Developers > Webhooks* as the secret. Lago's documentation does not spell out the headers; they come from the open-source [lago-api](https://github.com/getlago/lago-api){:target="_blank"}{:rel="noopener nofollow"} code (`app/models/webhook.rb`), which signs the JSON body with HMAC-SHA256, Base64-encodes it, and sends `X-Lago-Unique-Key` for deduplication. The body shape (`webhook_type`, `object_type`, `organization_id` and the object) and the subscription fields come from the same code.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# customer.created: your external_customer_id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=acme-corp&name=Acme%20Corp" \
  $NLIC/licensee

# subscription.started: one license per subscription (external_id), from a template without an end date
curl --user $AUTH --header "Accept: application/json" \
  --data "number=lago-sub-acme-1&licenseeNumber=acme-corp&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# subscription.terminated
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/lago-sub-acme-1
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

### 4. Optional: your product reports usage to Lago

```bash
# Lago Cloud; for a self-hosted Lago use your own host
curl --request POST https://api.getlago.com/api/v1/events \
  --header "Authorization: Bearer $LAGO_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"event": {
      "transaction_id": "evt-0001",
      "external_subscription_id": "lago-sub-acme-1",
      "code": "api_calls",
      "properties": {}
  }}'
```

## Sources

- [Lago: webhooks guide](https://getlago.com/docs/guide/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Lago: webhook messages](https://getlago.com/docs/api-reference/webhooks/messages){:target="_blank"}{:rel="noopener nofollow"}
- [Lago: ingesting usage](https://getlago.com/docs/guide/events/ingesting-usage){:target="_blank"}{:rel="noopener nofollow"}
- [Lago: about](https://getlago.com/docs/about){:target="_blank"}{:rel="noopener nofollow"}
- [Lago: webhook signing code (lago-api, open source)](https://github.com/getlago/lago-api/blob/main/app/models/webhook.rb){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Lago connector. The Lago details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
