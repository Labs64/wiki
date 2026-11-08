---
layout: default
title: "Orb Licensing Integration"
nav_title: "Orb"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 180
description: "Connect Orb usage-based billing to NetLicensing: subscription start creates a license, plan changes replace it, subscription end deactivates it."
permalink: orb
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Orb signs its webhooks with HMAC-SHA256. Because Orb bills for usage, the license follows the subscription rather than each invoice: your receiver creates it when the subscription starts and deactivates it when it ends.

[Orb](https://www.withorb.com){:target="_blank"}{:rel="noopener nofollow"} handles usage-based, seat-based and hybrid billing. Its webhooks tell your receiver when a customer or subscription changes and when an invoice is paid, so the license can follow the subscription.

## What Orb sends

Orb sends an HTTPS `POST` with JSON. The envelope has `id`, `created_at`, `type`, `payload_style` (`standard` or `expanded`), `subscription` and `properties`. The standard subscription payload is a summary with `id`, `name`, `status`, `start_date`, `end_date`, `created_at` and `metadata`, with the plan and the customer as references. Customers are identified by `external_customer_id` (an alias you set) and have a `payment_provider_id`.

## Map Orb events to NetLicensing

| Orb event | What to do in NetLicensing |
|----------------|---------------------|
| `customer.created` | Create a licensee |
| `subscription.started` | A subscription begins: create a license from the plan's template, from a licensing model without an end date (see [usage-based billing](billing-platforms#grant-time)) |
| `invoice.payment_succeeded` | Automated payment collection for an invoice succeeded: informational, because the license follows the subscription, not the invoice |
| `subscription.plan_changed`, `subscription.plan_change_scheduled`, `subscription.plan_version_changed` | Create a license from the new template and deactivate the old one |
| `subscription.cancellation_scheduled` | Deactivate at the end of the period (`subscription.cancellation_unscheduled` reverses it) |
| `subscription.ended` | The customer's subscription ends or lapses: deactivate the license (`active=false`) |
| `invoice.payment_failed`, `invoice.dunning_schedule_created` | Your choice: keep access during the platform's retry period, or deactivate |
| `invoice.manually_marked_as_paid` | An invoice was marked as paid manually: informational, like a successful payment |

Orb's event list has no `subscription.activated`, `subscription.terminated`, `invoice.paid` or separate payment-overdue event; `subscription.created` exists without a description. Usage thresholds arrive as `subscription.usage_exceeded`, `subscription.cost_exceeded` and `subscription.spend_exceeded`.

## Check that the request comes from Orb

Orb sends the headers `X-Orb-Signature` (in the form `v1=<signature>`) and `X-Orb-Timestamp`. The signature is an HMAC-SHA256 over the string `v1:`, the ISO timestamp, a colon and the **raw request body**, keyed with the secret configured for the endpoint. Orb also publishes the IP addresses it sends from (`52.21.32.65`, `3.228.69.0`, `18.208.234.85`).

## Retries and duplicates

Orb guarantees **at-least-once** delivery and expects a `2xx` response within five seconds. Retries come after 5 seconds, 5 minutes, 30 minutes, 2 hours, 5 hours, and twice after 10 hours. Orb automatically disables an endpoint that returns `5xx` for more than 99% of deliveries over 7 days. Deduplicate on the event `id`.

## Match the customer and the plan

Identify the customer by `external_customer_id` and the subscription by its `id`; map the plan to your `licenseTemplateNumber` with a lookup table. The subscription summary carries `metadata`: use it to hold the NetLicensing licensee or template number. The pages we read do not show the fields of the `customer.created` payload, so read the customer from the Orb API (email) when you need it. Use the `expanded` payload style if you want more fields in the event.

To report usage from your product to Orb, Orb's event ingestion takes `event_name`, `timestamp`, `external_customer_id` and `properties`, with up to 500 events per request by default.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Orb                         Your receiver                 NetLicensing
|                           |                             |
| subscription.started ---->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=ext. customer       |
|                           | POST /license ------------->|
|                           |  number=sub id              |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Orb calls your receiver

```http
POST /webhooks/orb HTTP/1.1
Content-Type: application/json
X-Orb-Timestamp: 2026-11-08T10:00:00.000000
X-Orb-Signature: v1=<hex HMAC-SHA256>

{
  "id": "<event id>",
  "created_at": "2026-11-08T10:00:00Z",
  "type": "subscription.started",
  "payload_style": "standard",
  "subscription": { "id": "sub_9x...", "status": "active", "metadata": { } },
  "properties": { }
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_orb(raw_body: bytes, signature_header: str, timestamp_header: str, secret: str) -> bool:
    signed = f"v1:{timestamp_header}:".encode() + raw_body
    expected = "v1=" + hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_header)
```

This mirrors the Python sample on Orb's webhook security page.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# customer.created: your external_customer_id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=acme-corp&name=Acme%20Corp" \
  $NLIC/licensee

# subscription.started: one license for the subscription, from a template without an end date
curl --user $AUTH --header "Accept: application/json" \
  --data "number=sub_9x&licenseeNumber=acme-corp&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# subscription.ended
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/sub_9x
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

### 4. Optional: your product reports usage to Orb

```bash
curl --request POST https://api.withorb.com/v1/ingest \
  --header "Authorization: Bearer $ORB_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"events": [{
      "event_name": "api_call",
      "timestamp": "2026-11-08T10:00:00Z",
      "idempotency_key": "evt-0001",
      "external_customer_id": "acme-corp",
      "properties": {}
  }]}'
```

## Sources

- [Orb: webhook event types](https://docs.withorb.com/integrations-and-exports/webhooks/event-types){:target="_blank"}{:rel="noopener nofollow"}
- [Orb: webhook security](https://docs.withorb.com/integrations-and-exports/webhooks/security){:target="_blank"}{:rel="noopener nofollow"}
- [Orb: webhook delivery](https://docs.withorb.com/integrations-and-exports/webhooks/delivery){:target="_blank"}{:rel="noopener nofollow"}
- [Orb: payload styles](https://docs.withorb.com/integrations-and-exports/webhooks/payload-styles){:target="_blank"}{:rel="noopener nofollow"}
- [Orb: event ingestion](https://docs.withorb.com/events-and-metrics/event-ingestion){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host an Orb connector. The Orb details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
