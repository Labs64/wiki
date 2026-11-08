---
layout: default
title: "Metronome Licensing Integration"
nav_title: "Metronome"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 150
description: "Connect Metronome usage billing, part of Stripe, to NetLicensing: contract start creates a license, contract end deactivates it. HMAC-SHA256 check."
permalink: metronome
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Metronome signs its webhooks with HMAC-SHA256. The license follows the contract: your receiver creates it when the contract or subscription starts and deactivates it when it ends. Metronome sends no customer or invoice-paid events.

[Metronome](https://metronome.com){:target="_blank"}{:rel="noopener nofollow"} provides usage-based billing and is now part of Stripe (Metronome's announcement of January 13, 2026 says the acquisition is complete). Its webhooks report contracts, subscriptions, credits and thresholds.

## What Metronome sends

Metronome sends a `POST` with JSON. The top-level fields are `id`, `type`, `timestamp`, `environment_type`, `contract_id`, `contract_custom_fields`, `customer_id`, `customer_custom_fields` and, for subscriptions, `subscription_id`. Threshold and invoice notifications nest these under `properties` (`customer_id`, `alert_id`, `invoice_id`, `threshold` and so on).

## Map Metronome events to NetLicensing

| Metronome event | What to do in NetLicensing |
|----------------|---------------------|
| `contract.create`, `contract.start` | Create a licensee for the `customer_id`, then a license from the plan's template, from a licensing model without an end date (see [usage-based billing](billing-platforms#grant-time)) |
| `subscription.create`, `subscription.start` | Create a license from the plan's template |
| `contract.edit` | Read the contract and adjust or replace the license |
| `contract.end`, `subscription.end`, `contract.archive` | Deactivate the license (`active=false`) |
| `alerts.usage_threshold_reached`, `alerts.spend_threshold_reached`, `alerts.low_remaining_credit_balance_reached` | Warn the customer or your team; optionally limit the license |
| `invoice.finalized` | An invoice was finalized: informational, because the license follows the contract. Metronome states that you contact its support portal to set up this notification |

Metronome's webhook page lists **no `customer.*` event, no invoice-paid event and no named payment-failure event**; it says no webhook fires for errors entirely within Stripe, such as payment failures. `payment_gate.payment_status` carries a failed status for payment-gated workflows only.

## Check that the request comes from Metronome

The header `Metronome-Webhook-Signature` is the hex HMAC-SHA256 of the value of the `X-Metronome-Date` header, a newline, and the **raw request body**, keyed with the secret that is unique to each webhook. Ignore requests older than five minutes.

## Retries and duplicates

A response status above 299 triggers a retry. Retries use exponential backoff up to a 15-minute cadence and continue until the notification is accepted or two days have passed (about 200 retries). Duplicates are possible: deduplicate on the notification `id`.

## Match the customer and the plan

Customer and contract **custom fields** arrive in the payload as `customer_custom_fields` and `contract_custom_fields`: store the NetLicensing template number there, so no lookup table is needed. Otherwise, map the contract or plan to your `licenseTemplateNumber` with a lookup table. Use the Metronome `customer_id` as the licensee `number` and the `contract_id` as the license `number`; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

To report usage from your product, Metronome's ingest endpoint takes `transaction_id`, `customer_id`, `timestamp` and `event_type` with optional `properties`; events with a repeated `transaction_id` within 34 days are treated as duplicates.

## Example: the calls

```text
Metronome                   Your receiver                 NetLicensing
|                           |                             |
| contract.start ---------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=customer_id         |
|                           | POST /license ------------->|
|                           |  number=contract_id         |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Metronome calls your receiver

```http
POST /webhooks/metronome HTTP/1.1
Content-Type: application/json
X-Metronome-Date: <date>
Metronome-Webhook-Signature: <hex HMAC-SHA256>

{
  "id": "4dcef5c4-ed3b-5d0e-baa4-beec74544158",
  "type": "contract.start",
  "timestamp": "2025-08-07T00:00:00Z",
  "environment_type": "PRODUCTION",
  "contract_id": "33d206f6-7455-49f6-857d-2172c37db68d",
  "contract_custom_fields": { "org_key": "g_major" },
  "customer_id": "1ed86915-97f1-4d92-8fa6-763c0235093a",
  "customer_custom_fields": { "bill_customer_id": "0cu21JDIRIUDQKDS6wmx" }
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_metronome(raw_body: bytes, date_header: str, signature_header: str, secret: str) -> bool:
    signed = date_header.encode() + b"\n" + raw_body
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_header)
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. Ignore requests older than five minutes. The payload is Metronome's own `contract.start` example; custom fields such as `org_key` are whatever you define.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# contract.start: the Metronome customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=1ed86915-97f1-4d92-8fa6-763c0235093a&name=Acme%20Corp" \
  $NLIC/licensee

# contract.start: one license for the contract, from a template without an end date
curl --user $AUTH --header "Accept: application/json" \
  --data "number=33d206f6-7455-49f6-857d-2172c37db68d&licenseeNumber=1ed86915-97f1-4d92-8fa6-763c0235093a&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# contract.end or contract.archive
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/33d206f6-7455-49f6-857d-2172c37db68d
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

### 4. Optional: your product reports usage to Metronome

```bash
curl --request POST https://api.metronome.com/v1/ingest \
  --header "Authorization: Bearer $METRONOME_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '[{
      "transaction_id": "evt-0001",
      "customer_id": "1ed86915-97f1-4d92-8fa6-763c0235093a",
      "event_type": "api_call",
      "timestamp": "2026-11-08T10:00:00Z",
      "properties": {}
  }]'
```

## Sources

- [Metronome: webhook types](https://docs.metronome.com/guides/platform-configuration/webhooks/webhook-types){:target="_blank"}{:rel="noopener nofollow"}
- [Metronome: webhook best practices](https://docs.metronome.com/guides/platform-configuration/webhooks/best-practices){:target="_blank"}{:rel="noopener nofollow"}
- [Metronome: sending usage events](https://docs.metronome.com/guides/events/send-usage-events){:target="_blank"}{:rel="noopener nofollow"}
- [Metronome is now part of Stripe](https://metronome.com/blog/our-next-chapter-metronome-is-now-part-of-stripe){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Metronome connector. The Metronome details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
