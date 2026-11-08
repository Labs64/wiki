---
layout: default
title: "Mollie Licensing Integration"
nav_title: "Mollie"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 160
description: "Connect Mollie payments and subscriptions to NetLicensing: fetch each paid payment from the Mollie API, create a license, deactivate on refund."
permalink: mollie
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Mollie's webhook only carries the id of the payment that changed. Your receiver fetches the payment from the Mollie API, which also proves it is genuine, creates a license when it is paid and deactivates it on refund or chargeback.

[Mollie](https://www.mollie.com){:target="_blank"}{:rel="noopener nofollow"} works differently from most platforms in this section: its webhook is a **bare call** that carries only the id of the object that changed. You fetch the object from the Mollie API to see what happened. Mollie notes that Next-gen Webhooks (beta) with new event types exist; this guide covers the classic webhook.

## What Mollie sends

Mollie sends a `POST`, form-encoded, with a single field, for example `id=tr_5B8cwPMGnU6qLbRvo7qEZo`. The webhook contains no status, no buyer email and no product. Mollie states that fake calls to your webhook "will never result in orders being processed without being actually paid", because you read the real status from Mollie.

## Map Mollie events to NetLicensing

| Mollie event | What to do in NetLicensing |
|----------------|---------------------|
| Payment became `paid` (after you fetch it) | Create a licensee and create a license from the plan's template. If the payment has a `subscriptionId`, it is a subscription payment: create an additional license for the next period |
| Payment `failed`, `expired` or `canceled` | No license; for a subscription, see the retry note below |
| Refund `refunded` or chargeback received | Deactivate the license (`active=false`) |

Mollie says it provides **no webhooks for status changes of a subscription itself**: subscription payments call the same payment webhook, and a cancelled subscription has no event of its own. Track cancellations through your own subscription records or by reading the subscription from the Mollie API. For a failed subscription payment, Mollie retries the payment up to 5 times.

## Check that the request comes from Mollie

There is no signature. The protection is the design: your receiver only trusts what it **fetches from the Mollie API** for the id in the webhook, never the webhook body. Mollie discourages validating by IP address.

## Retries and duplicates

Answer `200 OK` within 15 seconds. Mollie makes 10 attempts over about 26 hours. A `301` or `302` redirect drops the `POST`, so if you redirect, use `307` or `308`.

## Match the customer and the plan

Because the webhook carries only an id, read the buyer, the amount, the status and the `subscriptionId` from the payment object in the Mollie API. The pages we read do not describe metadata, so keep the mapping from Mollie customer or subscription to the NetLicensing licensee in your receiver, and map your Mollie products (or amounts) to a `licenseTemplateNumber` with a lookup table.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Mollie                      Your receiver                 NetLicensing
|                           |                             |
| id=tr_... --------------->|                             |
|                           | (nothing to verify)         |
|< GET /v2/payments/{id} ---|                             |
|                           | POST /licensee ------------>|
|                           |  number=cst_...             |
|                           | POST /license ------------->|
|                           |  number=tr_...              |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Mollie calls your receiver

```http
POST /webhooks/mollie HTTP/1.1
Content-Type: application/x-www-form-urlencoded

id=tr_5B8cwPMGnU6qLbRvo7qEZo
```

### 2. Your receiver checks the request

There is nothing to verify in the request itself: it carries only an id. Fetch the payment from Mollie (step 3) and act only on what the API returns.

### 3. Your receiver calls Mollie

```bash
curl https://api.mollie.com/v2/payments/tr_5B8cwPMGnU6qLbRvo7qEZo \
  --header "Authorization: Bearer $MOLLIE_API_KEY"
# -> the payment with its status, amount and, for subscription payments, subscriptionId
```

### 4. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# First paid payment: your Mollie customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=cst_8wmqcHMN4U&name=Jane%20Doe" \
  $NLIC/licensee

# Payment status paid: one license per payment
curl --user $AUTH --header "Accept: application/json" \
  --data "number=tr_5B8cwPMGnU6qLbRvo7qEZo&licenseeNumber=cst_8wmqcHMN4U&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Refund or chargeback
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/tr_5B8cwPMGnU6qLbRvo7qEZo
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Mollie: webhooks](https://docs.mollie.com/docs/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Mollie: recurring payments](https://docs.mollie.com/docs/recurring-payments){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Mollie connector. The Mollie details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
