---
layout: default
title: "Frisbii (Reepay, Billwerk) Licensing Integration"
nav_title: "Frisbii (Reepay, Billwerk)"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 100
description: "Connect Frisbii, formerly Reepay and Billwerk, to NetLicensing: each settled invoice creates a license, expiry deactivates it. Signature, retries, IDs."
permalink: frisbii
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Frisbii, the platform formerly known as Reepay and Billwerk, sends webhooks with ids only and an HMAC-SHA256 signature. Your receiver fetches the details, creates one license per settled invoice and deactivates it when the subscription expires.

Frisbii Billing & Pay sends webhooks for customer, subscription and invoice events. Frisbii's documentation describes an "evolution from Reepay and Billwerk to Frisbii" with a rebranding of domains (for example `api.reepay.com` becomes `api.frisbii.com`; both work during the transition). If you know the platform as Reepay or Billwerk, this is the same documentation family. For new accounts, webhooks are disabled: enable them in the settings and choose the events you need.

## What Frisbii sends

Frisbii sends an HTTP `POST` with JSON: `id`, `event_id`, `event_type`, `timestamp`, `signature` and the related objects (`customer`, `subscription`, `invoice`, `transaction` and others, as ids). **The payload does not carry the state of the objects**; Frisbii recommends fetching the object through its API after receiving the event.

## Map Frisbii events to NetLicensing

| Frisbii event | What to do in NetLicensing |
|----------------|---------------------|
| `customer_created` | Create a licensee |
| `subscription_created` | Create the licensee if it does not exist yet; the paid periods arrive as `invoice_settled` |
| `subscription_renewal` | Frisbii: "An invoice has been made and new billing period has started". Wait until the invoice is paid (`invoice_settled`) |
| `invoice_settled` | The invoice was paid: create one license for the period, numbered with the invoice id |
| `subscription_changed` | Plan or scheduling changed: create a license from the new template and deactivate the old one |
| `subscription_cancelled` | Cancelled at the end of the period: deactivate at period end (`subscription_uncancelled` reverses it) |
| `subscription_expired` | Deactivate the license (`active=false`) |
| `invoice_failed`, `invoice_dunning`, `subscription_on_hold_dunning` | Your choice: keep access during the platform's retry period, or deactivate |

## Check that the request comes from Frisbii

The `signature` field is `hexencode(hmac_sha_256(webhook_secret, timestamp + id))`: it covers the **timestamp and the event id, not the body**. Generate the secret in the webhook settings. As an alternative, configure HTTP Basic Auth on the webhook. Frisbii also lists the IP addresses it sends from. Only ports 80 and 443 are allowed.

## Retries and duplicates

Any `2xx` response is a success; redirects count as a failure (except for accounts created before 2022-10-01). The endpoint timeout is 10 seconds. Retries come after 2, 5, 10, 20 and 30 minutes, and then every hour for three days (24 hours on test accounts). Events are delivered first-in-first-out per customer and per URL. The settings API includes "Re-send webhooks" and "Get webhook requests".

## Match the customer and the plan

Because the payload carries ids only, your receiver calls the Frisbii API to read the customer (email) and the subscription (plan). Frisbii offers metadata endpoints for customers, subscriptions, invoices, plans, coupons, discounts and add-ons; whether metadata is included in webhooks is not documented. A lookup table from the plan id to your `licenseTemplateNumber` is the documented route.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Frisbii                     Your receiver                 NetLicensing
|                           |                             |
| invoice_settled --------->|                             |
|                           | verify signature            |
|< GET invoice (API) -------|                             |
|                           | POST /licensee ------------>|
|                           |  number=customer            |
|                           | POST /license ------------->|
|                           |  number=invoice             |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Frisbii calls your receiver

```http
POST /webhooks/frisbii HTTP/1.1
Content-Type: application/json

{
  "id": "8ab4b56439944e62ababca7954355578",
  "event_id": "680bd8055b5c444bb467dcb731c65bf9",
  "event_type": "invoice_settled",
  "timestamp": "2015-06-25T12:10:00.64Z",
  "signature": "7a591eddc400af4c8a64ff551ff90b37d79471bd2c9a5a2fcd4ed6944f39cb09",
  "customer": "OVAFIJ",
  "subscription": "sub-2001",
  "invoice": "inv-3001"
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_frisbii(event: dict, webhook_secret: str) -> bool:
    # The signature covers timestamp + id, not the body
    signed = (event["timestamp"] + event["id"]).encode()
    expected = hmac.new(webhook_secret.encode(), signed, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, event["signature"])
```

`id`, `event_id`, `timestamp`, `signature` and `customer` are the values of Frisbii's own example; `id` is the webhook id that the signature covers. The payload carries ids only. Fetch the invoice, subscription and customer through the Frisbii API (see the API reference in *Sources*) before you act, and use the fetched state, not the webhook, as the truth.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# customer_created: the Frisbii customer handle becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=OVAFIJ&name=Jane%20Doe" \
  $NLIC/licensee

# invoice_settled: one license per paid invoice
curl --user $AUTH --header "Accept: application/json" \
  --data "number=inv-3001&licenseeNumber=OVAFIJ&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# subscription_expired before the paid time ran out, or a refund
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/inv-3001
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Frisbii: webhook reference](https://docs.frisbii.com/reference/intro_webhooks.md){:target="_blank"}{:rel="noopener nofollow"}
- [Frisbii: events](https://docs.frisbii.com/reference/event.md){:target="_blank"}{:rel="noopener nofollow"}
- [Frisbii: rebranding and domains](https://docs.frisbii.com/reference/rebranding-domains.md){:target="_blank"}{:rel="noopener nofollow"}
- [Frisbii: webhook settings](https://docs.frisbii.com/reference/webhook.md){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Frisbii connector. The Frisbii details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
