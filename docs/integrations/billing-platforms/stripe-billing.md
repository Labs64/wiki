---
layout: default
title: "Stripe Billing Licensing Integration"
nav_title: "Stripe Billing"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 270
description: "Connect your own Stripe Billing subscriptions to NetLicensing: each paid invoice creates a license, subscription deletion deactivates it. Signed webhooks."
permalink: stripe-billing
redirect_from:
  - /moonclerk
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Stripe signs every webhook with the `Stripe-Signature` header. Your receiver creates one NetLicensing license per paid invoice (`invoice.paid`), which covers the first period and every renewal, and deactivates it when the subscription is deleted.

[NetLicensing Shop](stripe) can take card payments into **your** Stripe account without any code. Use this guide only if you sell through your own Stripe Billing subscriptions or Checkout and want those purchases to create licenses in NetLicensing.

## What Stripe sends

Stripe sends an HTTP `POST` with a JSON event: `type` and `data.object`. Stripe's documentation describes "thin" events as the default for new integrations, with snapshot events as the alternative; thin events need a separate endpoint. The event names below are snapshot events.

## Map Stripe events to NetLicensing

| Stripe event | What to do in NetLicensing |
|----------------|---------------------|
| `checkout.session.completed` | The customer finished Checkout: create the licensee. For a one-time payment, also create the license here |
| `customer.subscription.created` | No license yet: the first invoice is paid separately and arrives as `invoice.paid` |
| `invoice.paid` | Create one license for the paid period, numbered with the invoice id (`in_...`). Stripe's subscription webhook guide says to grant access on this event when the subscription's `status` is `active`. `billing_reason` tells the first invoice (`subscription_create`) from a renewal (`subscription_cycle`) |
| `customer.subscription.updated` | Plan or status change: create a license from the new template and deactivate the old one |
| `customer.subscription.deleted` | Deactivate the license (`active=false`) |
| `invoice.payment_failed` | Your choice: keep access during the platform's retry period, or deactivate |

`invoice.payment_succeeded` and `customer.subscription.trial_will_end` also exist in Stripe's event list.

## Check that the request comes from Stripe

The header `Stripe-Signature` contains a timestamp (`t=`) and a signature (`v1=`). The signature is an HMAC-SHA256 over the timestamp, a dot and the **raw request body**, keyed with the endpoint's signing secret (`whsec_...`). Stripe's libraries use a default tolerance of 5 minutes between the timestamp and the current time. During secret rotation, several signatures can be sent for up to 24 hours. Do not modify the body before you verify it.

## Retries and duplicates

In live mode Stripe retries with exponential backoff for up to 3 days; in a sandbox it retries 3 times within a few hours. Events are not guaranteed to arrive in order, and you should deduplicate on the event id. You can resend an event within 15 days from the Dashboard or 30 days from the CLI.

## Match the customer and the plan

Use the Stripe customer id (`cus_...`) as the NetLicensing licensee `number` and the invoice id (`in_...`) as the license `number`; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids). To pick the license template, keep a lookup table from the Stripe price or product id to your `licenseTemplateNumber`.

## Example: the calls

```text
Stripe                      Your receiver                 NetLicensing
|                           |                             |
| invoice.paid ------------>|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=cus_...             |
|                           | POST /license ------------->|
|                           |  number=in_...              |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Stripe calls your receiver

```http
POST /webhooks/stripe HTTP/1.1
Content-Type: application/json
Stripe-Signature: t=1731052800,v1=<signature>

{
  "id": "evt_...",
  "type": "invoice.paid",
  "data": {
    "object": {
      "object": "invoice",
      "id": "in_1QaBcD",
      "customer": "cus_NeZwdNtLEOXuvB",
      "billing_reason": "subscription_create"
    }
  }
}
```

### 2. Your receiver checks the request

```python
import stripe  # official Stripe library

event = stripe.Webhook.construct_event(
    raw_body,                                # bytes, unmodified
    request.headers["Stripe-Signature"],
    "whsec_...",                             # the endpoint's signing secret
)  # raises SignatureVerificationError if the signature does not match
```

Stripe's libraries check the timestamp with a default tolerance of 5 minutes. Before you grant access, Stripe's subscription guide says to check that the subscription's `status` is `active`; read the subscription through the Stripe API if the event does not tell you. Where the subscription id and the line item prices sit inside the invoice depends on your Stripe API version, so look them up in the invoice object reference for your version.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# checkout.session.completed: the Stripe customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=cus_NeZwdNtLEOXuvB&name=Jane%20Doe" \
  $NLIC/licensee

# invoice.paid (subscription_create or subscription_cycle): one license per paid invoice
curl --user $AUTH --header "Accept: application/json" \
  --data "number=in_1QaBcD&licenseeNumber=cus_NeZwdNtLEOXuvB&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Refund or immediate cancellation: deactivate the license of that invoice
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/in_1QaBcD
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Stripe: Billing webhooks](https://docs.stripe.com/billing/subscriptions/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Stripe: webhooks](https://docs.stripe.com/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Stripe: event types](https://docs.stripe.com/api/events/types){:target="_blank"}{:rel="noopener nofollow"}
- [NetLicensing: Stripe payments in the Shop](https://netlicensing.io/wiki/stripe){:target="_blank"}{:rel="noopener nofollow"}
- [Stripe: the invoice object (billing_reason)](https://docs.stripe.com/api/invoices/object){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Stripe connector. The Stripe details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
