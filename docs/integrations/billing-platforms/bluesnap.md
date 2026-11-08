---
layout: default
title: "BlueSnap Licensing Integration"
nav_title: "BlueSnap"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 30
description: "Connect BlueSnap to NetLicensing: CHARGE and RECURRING IPNs create licenses, cancellations, refunds and chargebacks deactivate them."
permalink: bluesnap
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: BlueSnap sends form-encoded IPNs. The first payment arrives as `CHARGE` and each later one as `RECURRING`, so your receiver creates one license per paid period and deactivates it on cancellation, refund or chargeback. BlueSnap documents no signature, so confirm each transaction before you issue a license.

[BlueSnap](https://www.bluesnap.com){:target="_blank"}{:rel="noopener nofollow"} sends webhooks, also called IPNs, for transaction events. You enable the events you need in the BlueSnap settings or through its API, which has flags such as `sendCharge`, `sendRecurring`, `sendRefund`, `sendChargeback`, `sendCancellation`, `sendCancelOnRenewal`, `sendDecline`, `sendCcFailure` and `sendSubCcFailure`.

## What BlueSnap sends

BlueSnap sends an HTTP `POST` to your URL. The documented examples are form-encoded `key=value` text. The parameter lists include `email`, `invoiceEmail`, `referenceNumber`, `subscriptionId`, `contractId`, `productId`, `productName`, `merchantTransactionId`, and `custom1`, `custom2` and so on, plus an `authkey` field.

## Map BlueSnap events to NetLicensing

| BlueSnap event | What to do in NetLicensing |
|----------------|---------------------|
| `CHARGE` | A new purchase was completed, one-time or recurring; the first payment of a subscription arrives as `CHARGE`. Create a licensee and create a license from the plan's template |
| `RECURRING` | A charge was made for a subscription contract, **only for the second and later charges**: create an additional license for the next period |
| `CANCEL_ON_RENEWAL` | A customer asked to cancel a subscription that auto-renews; it ends at the end of the period: deactivate at period end |
| `CANCELLATION` | A recurring charge was cancelled by the customer, you or BlueSnap: deactivate the license (`active=false`) |
| `REFUND`, `CANCELLATION_REFUND` | A refund was processed (for `REFUND`, the subscription is cancelled): deactivate the license (`active=false`) |
| `CHARGEBACK` | A shopper challenged a transaction: deactivate or hold the license (`CHARGEBACK_STATUS_CHANGED` reports updates) |
| `SUBSCRIPTION_CHARGE_FAILURE` | A recurring payment failed: Your choice: keep access during the platform's retry period, or deactivate |
| `CC_CHARGE_FAILED`, `DECLINE` | An initial card payment failed or a transaction was rejected: do not issue a license |

## Check that the request comes from BlueSnap

BlueSnap's documentation we read describes **no signature**. Every parameter list contains an `authkey` field, but the pages do not explain how to use it. Use an HTTPS URL with a long random path, and before you issue a license confirm the transaction in your BlueSnap account or through its API.

## Retries and duplicates

BlueSnap's support FAQ says that if it cannot deliver a webhook, it makes up to 11 attempts to resend it. The expected HTTP status code is not documented on the pages we read; return `200`. Deduplicate on `referenceNumber` together with the event type.

## Match the customer and the plan

Identify the buyer by `email`, the subscription by `subscriptionId` and `contractId`, and the plan by `productId`. Map `productId` to your `licenseTemplateNumber` with a lookup table. The pages we read do not describe how `custom1`, `custom2` and `merchantTransactionId` are filled; test them in a BlueSnap sandbox before you use them to carry a NetLicensing licensee number.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
BlueSnap                    Your receiver                 NetLicensing
|                           |                             |
| RECURRING IPN ----------->|                             |
|                           | check URL secret path       |
|                           | POST /licensee ------------>|
|                           |  number=shopper             |
|                           | POST /license ------------->|
|                           |  number=ref. number         |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. BlueSnap calls your receiver

```http
POST /webhooks/bluesnap/<long-random-path> HTTP/1.1
Content-Type: application/x-www-form-urlencoded

transactionType=RECURRING&referenceNumber=1012345678&subscriptionId=2312345&contractId=2154321&productId=123456&email=jane%40example.com&custom1=&authkey=<value>
```

### 2. Your receiver checks the request

BlueSnap documents no signature for these IPNs. Use an HTTPS URL with a long random path, and confirm the transaction (`referenceNumber`) in your BlueSnap account or through its API before you issue a license. The parameter names come from BlueSnap's IPN reference; check a sandbox IPN for the exact set your account sends.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# First CHARGE: your customer id (or the email) becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=bs-jane%40example.com&name=Jane%20Doe" \
  $NLIC/licensee

# CHARGE and RECURRING: one license per charge, numbered with referenceNumber
curl --user $AUTH --header "Accept: application/json" \
  --data "number=1012345678&licenseeNumber=bs-jane%40example.com&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# REFUND, CHARGEBACK or immediate CANCELLATION
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/1012345678
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [BlueSnap: webhooks (IPNs)](https://developers.bluesnap.com/reference/webhooks-ipns){:target="_blank"}{:rel="noopener nofollow"}
- [BlueSnap: webhook name reference](https://support.bluesnap.com/docs/ipns-name-reference){:target="_blank"}{:rel="noopener nofollow"}
- [BlueSnap: IPN FAQs](https://support.bluesnap.com/docs/ipn-faqs){:target="_blank"}{:rel="noopener nofollow"}
- [BlueSnap: subscriptions](https://developers.bluesnap.com/reference/subscriptions){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a BlueSnap connector. The BlueSnap details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
