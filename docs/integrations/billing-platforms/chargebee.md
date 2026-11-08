---
layout: default
title: "Chargebee Licensing Integration"
nav_title: "Chargebee"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 50
description: "Connect Chargebee to NetLicensing: subscription_created and subscription_renewed create licenses, cancellations deactivate them. Auth, retries and ID matching."
permalink: chargebee
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Chargebee posts JSON webhooks without a signature, so you protect the URL with Basic auth or a random key. Your receiver creates a license when a subscription is created and another one on each renewal, and deactivates it when the subscription is cancelled.

[Chargebee](https://www.chargebee.com){:target="_blank"}{:rel="noopener nofollow"} sends webhooks for customer, subscription and payment events. You configure the endpoint in the Chargebee console.

## What Chargebee sends

Chargebee sends an HTTP `POST` with `Content-Type: application/json`. The body has `id`, `occurred_at` (Unix seconds), `event_type`, `source`, `api_version` and `content`. The `content` object holds the related `subscription`, `customer` and `invoice` objects, depending on the event.

## Map Chargebee events to NetLicensing

| Chargebee event | What to do in NetLicensing |
|----------------|---------------------|
| `customer_created` | Create a licensee |
| `subscription_created` | Create a license from the plan's template |
| `subscription_renewed` | Create an additional license for the next period |
| `payment_succeeded` | Payment collected. `subscription_created` and `subscription_renewed` already cover the periods, so do not add a license here as well |
| `subscription_changed` | Recurring items changed: create a license from the new template and deactivate the old one |
| `subscription_cancelled` | Deactivate the license (`active=false`) |
| `payment_failed` | Your choice: keep access during the platform's retry period, or deactivate |

Chargebee's event list has no named past-due event; `dunning_updated` exists without a description.

## Check that the request comes from Chargebee

Chargebee does not document a signature header. Protect the endpoint with **basic authentication** on the webhook URL, or with a random key in the URL, and restrict the sender with Chargebee's published IP address lists (US, EU and AU).

## Retries and duplicates

Answer with HTTP `200`. A non-2xx response triggers retries with increasing delays. Chargebee's documentation says both "up to 2 days" and "around 3 days and 7 hours" for the last retry, so plan for a multi-day window. Retries can duplicate events: deduplicate on the event `id` and keep processed ids for at least 3 days and 7 hours. Events can arrive out of order; compare `resource_version`.

## Match the customer and the plan

`customer.id` and `customer.email` are in the customer object. Chargebee supports `meta_data` (JSON, up to 65,535 characters) on subscriptions, customers, items, item prices and coupons, and custom fields on customers, subscriptions, invoices, credit notes, item families and items. Custom fields are created in the web interface only. Use one of them, or a lookup table from the plan's item id, to carry the `licenseTemplateNumber`. The exact name of the plan or item id inside the subscription object is in Chargebee's subscription reference.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Chargebee                   Your receiver                 NetLicensing
|                           |                             |
| subscription_renewed ---->|                             |
|                           | check Basic auth            |
|                           | POST /licensee ------------>|
|                           |  number=cust_...            |
|                           | POST /license ------------->|
|                           |  number=inv_...             |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Chargebee calls your receiver

```http
POST /webhooks/chargebee HTTP/1.1
Content-Type: application/json
Authorization: Basic <base64 of user:password set on the webhook>

{
  "id": "ev_...",
  "occurred_at": 1731052800,
  "event_type": "subscription_renewed",
  "api_version": "v2",
  "content": {
    "subscription": { "id": "sub_..." },
    "customer": { "id": "cust_...", "email": "jane@example.com" },
    "invoice": { "id": "inv_..." }
  }
}
```

### 2. Your receiver checks the request

```python
import base64, hmac

def basic_auth_ok(authorization_header: str, user: str, password: str) -> bool:
    expected = "Basic " + base64.b64encode(f"{user}:{password}".encode()).decode()
    return hmac.compare_digest(authorization_header or "", expected)
```

Chargebee does not sign webhooks, so Basic auth on the URL is the check. Field names inside `content` follow Chargebee's object reference; inspect a test event before you map them.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# customer_created: the Chargebee customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=cust_123&name=Jane%20Doe" \
  $NLIC/licensee

# subscription_created and subscription_renewed: one license per period, numbered with the invoice id when the event carries one
curl --user $AUTH --header "Accept: application/json" \
  --data "number=inv_456&licenseeNumber=cust_123&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Refund or immediate cancellation
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/inv_456
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Chargebee: webhooks](https://apidocs.chargebee.com/docs/api/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Chargebee: events](https://apidocs.chargebee.com/docs/api/events){:target="_blank"}{:rel="noopener nofollow"}
- [Chargebee: event types](https://apidocs.chargebee.com/docs/api/events/event-types){:target="_blank"}{:rel="noopener nofollow"}
- [Chargebee: subscription_created](https://apidocs.chargebee.com/docs/api/events/webhook/subscription_created){:target="_blank"}{:rel="noopener nofollow"}
- [Chargebee: customers (custom fields, meta_data)](https://apidocs.chargebee.com/docs/api/customers){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Chargebee connector. The Chargebee details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
