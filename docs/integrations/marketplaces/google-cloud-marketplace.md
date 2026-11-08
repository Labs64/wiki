---
layout: default
title: "Google Cloud Marketplace Licensing Integration"
nav_title: "Google Cloud Marketplace"
parent: Cloud Marketplaces
grand_parent: Integrations
nav_order: 30
description: "Sell SaaS on Google Cloud Marketplace with NetLicensing: Pub/Sub entitlement events and Procurement API approvals create and deactivate licenses."
permalink: google-cloud-marketplace
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Google Cloud Marketplace publishes account and entitlement events to Pub/Sub. Your service approves them through the Partner Procurement API, creates the NetLicensing license when an entitlement becomes active, and deactivates it when the entitlement is cancelled.

For an **integrated SaaS** product on Google Cloud Marketplace, Google sends account and entitlement events through **Pub/Sub**, and you answer through the **Partner Procurement API**: you approve or reject purchases and plan changes. Your receiver creates and revokes the NetLicensing licenses around those approvals.

Requirements stated by Google: access to the Partner Procurement API, and the *Pub/Sub Editor* role for the service account used for the Pub/Sub subscription. For usage-based pricing, a Google Partner Engineer must create a service.

## What Google Cloud Marketplace sends

Pub/Sub messages carry `eventId`, `eventType`, `providerId` and an `entitlement` (with `id` and `updateTime`; on a plan change also fields such as `newPendingPlan`, `newProduct` and `newPendingOffer`). With account notifications turned on, the first purchase sends an `account` (`id`, `updateTime`). The product, plan and state are read with a `GET` of the entitlement.

## Map Google Cloud Marketplace events to NetLicensing

| Google Cloud Marketplace event | What to do in NetLicensing |
|----------------|---------------------|
| `ACCOUNT_ACTIVE` | The buyer's account is active: create a licensee with the `account.id` |
| First purchase: `account` message | Your app must call the Partner Procurement API and approve the account: `POST v1/providers/YOUR_PARTNER_ID/accounts/USER_ACCOUNT_ID:approve` with `{'approvalName': 'signup'}` |
| `ENTITLEMENT_CREATION_REQUESTED` | Approve with `POST v1/providers/YOUR_PARTNER_ID/entitlements/ENTITLEMENT_ID:approve`, or reject with `:reject` (optional `reason`); rejection moves the entitlement to `ENTITLEMENT_CANCELLED` |
| `ENTITLEMENT_ACTIVE` | Create a license from the plan's template |
| `ENTITLEMENT_PLAN_CHANGE_REQUESTED`, then `ENTITLEMENT_PLAN_CHANGED` | Approve with `:approvePlanChange` (body `pendingPlanName`); after the change, create a license from the new template and deactivate the old one (`ENTITLEMENT_PLAN_CHANGE_CANCELLED` reverses a request) |
| `ENTITLEMENT_RENEWED` | Create an additional license for the next period |
| `ENTITLEMENT_PENDING_CANCELLATION` | Deactivate at the end of the term (`ENTITLEMENT_CANCELLATION_REVERTED` reverses it) |
| `ENTITLEMENT_CANCELLED`, `ENTITLEMENT_CANCELLING`, `ENTITLEMENT_OFFER_ENDED` | Deactivate the license (`active=false`) |
| `ENTITLEMENT_DELETED` | Google states that, to protect the user's privacy, **you must delete their data from your servers** when you are notified: deactivate the license (`active=false`) and delete the NetLicensing licensee and its custom data with `forceCascade` |

Other documented events: `ENTITLEMENT_OFFER_ACCEPTED` and `ACCOUNT_DELETED`; `ACCOUNT_CREATION_REQUESTED` is deprecated.

## Check that the request comes from Google Cloud Marketplace

The events arrive through your own Pub/Sub subscription, so access is controlled with Google Cloud permissions (the service account for the subscription). The Google pages we read describe no additional message signature and no retry or acknowledgment rules; follow Pub/Sub's own documentation for acknowledgment and make the handler idempotent (use `eventId`).

## Retries and duplicates

Approve a new entitlement or account promptly: the buyer's purchase stays pending until you do. Check the current state with `GET v1/providers/YOUR_PARTNER_ID/entitlements/ENTITLEMENT_ID` rather than relying on the order of events.

## Match the customer and the plan

Use `account.id` (the user account id) as the NetLicensing licensee `number` and the entitlement `id` as the license `number` (see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids)). The product and plan come from the entitlement (`product`, `plan`, `state`): map them to your `licenseTemplateNumber` with a lookup table.

## Example: the calls

```text
Pub/Sub                     Your receiver                 NetLicensing
|                           |                             |
| ENTITLEMENT_ACTIVE ------>|                             |
|                           | IAM-protected topic         |
|< approve + GET -----------|                             |
|                           | POST /licensee ------------>|
|                           |  number=account id          |
|                           | POST /license ------------->|
|                           |  number=entitlement         |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Google Cloud Marketplace notifies you

The message data, Base64-decoded:

```json
{
  "eventId": "<event id>",
  "eventType": "ENTITLEMENT_CREATION_REQUESTED",
  "providerId": "<your partner id>",
  "entitlement": { "id": "<entitlement id>", "updateTime": "2026-11-08T10:00:00Z" }
}
```

### 2. Your receiver checks the request

The message arrives through your own Pub/Sub subscription, so the check is Google Cloud permissions on it. Make the handler idempotent with `eventId`.

### 3. Your receiver calls Google Cloud

```bash
API=https://cloudcommerceprocurement.googleapis.com/v1/providers/$PARTNER_ID
TOKEN=$(gcloud auth print-access-token)   # a service account with access to the Procurement API

# Read the entitlement: product, plan and state are not in the message
curl "$API/entitlements/$ENTITLEMENT_ID" --header "Authorization: Bearer $TOKEN"

# Approve the entitlement creation request
curl --request POST "$API/entitlements/$ENTITLEMENT_ID:approve" \
  --header "Authorization: Bearer $TOKEN" --header "Content-Type: application/json" --data '{}'

# First purchase: approve the account
curl --request POST "$API/accounts/$ACCOUNT_ID:approve" \
  --header "Authorization: Bearer $TOKEN" --header "Content-Type: application/json" \
  --data '{"approvalName": "signup"}'
```

### 4. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# ACCOUNT_ACTIVE: the account id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=E-1234-5678&name=Buyer%20E-1234-5678" \
  $NLIC/licensee

# ENTITLEMENT_ACTIVE: one license per entitlement, from a template without an end date
curl --user $AUTH --header "Accept: application/json" \
  --data "number=ent-9a8b7c&licenseeNumber=E-1234-5678&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# ENTITLEMENT_CANCELLED
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/ent-9a8b7c
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Google Cloud Marketplace: backend integration](https://docs.cloud.google.com/marketplace/docs/partners/integrated-saas/backend-integration){:target="_blank"}{:rel="noopener nofollow"}
- [Google Cloud Marketplace: manage entitlements](https://docs.cloud.google.com/marketplace/docs/partners/integrated-saas/manage-entitlements){:target="_blank"}{:rel="noopener nofollow"}
- [Google Cloud Marketplace: manage user accounts](https://docs.cloud.google.com/marketplace/docs/partners/integrated-saas/manage-user-accounts){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Google Cloud Marketplace connector. The Google Cloud Marketplace details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Cloud Marketplaces](cloud-marketplaces).
