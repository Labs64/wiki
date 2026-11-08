---
layout: default
title: "Microsoft Marketplace (Azure) Licensing Integration"
nav_title: "Microsoft Marketplace"
parent: Cloud Marketplaces
grand_parent: Integrations
nav_order: 20
description: "Sell SaaS on the Microsoft commercial marketplace with NetLicensing: subscribe, renew, suspend and unsubscribe webhooks drive licenses. Entra token check."
permalink: azure-marketplace
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: the Microsoft commercial marketplace calls your connection webhook with an Entra ID token for each subscription change. Your service creates the license on `Subscribe`, adds one on `Renew`, and deactivates it on `Suspend` or `Unsubscribe`.

When you publish a **transactable SaaS offer** in Microsoft Partner Center, you provide a **connection webhook URL**. Microsoft calls it when a customer's subscription changes, and your receiver updates the licenses in NetLicensing.

## What Microsoft Marketplace sends

Microsoft sends an HTTP call with a JSON body. Top-level fields are `id`, `activityId`, `publisherId`, `offerId`, `planId`, `quantity`, `subscriptionId`, `action`, `status` and `timeStamp`. The nested `subscription` has `id`, `planId`, `quantity`, `beneficiary` and `purchaser` (each with `tenantId`, `objectId` and `emailId`), `saasSubscriptionStatus`, `term`, `autoRenew`, `isFreeTrial` and `isTest`. Microsoft advises not to use strict deserialization of the webhook schema, because it can change.

## Map Microsoft Marketplace events to NetLicensing

| Microsoft Marketplace event | What to do in NetLicensing |
|----------------|---------------------|
| `Subscribe` | Create a licensee from the beneficiary, then create a license from the plan's template |
| `ChangePlan` | Accept or reject within 10 seconds (PATCH with success or failure, or a `4xx` response; no reply means accepted). Create a license from the new template and deactivate the old one |
| `ChangeQuantity` | Accept or reject within 10 seconds in the same way; adjust the license quantity |
| `Renew` | Create an additional license for the next period |
| `Suspend` | Deactivate the license until `Reinstate` |
| `Reinstate` | Reactivate the license; if you cannot accept it, call the delete API to trigger deletion |
| `Unsubscribe` | Deactivate the license (`active=false`) (a notify-only event: there is nothing to acknowledge) |

Respond HTTP 200 to acknowledge an event. `ChangePlan` and `ChangeQuantity` can be triggered for tests only from the Partner Center admin center. The landing page and token resolution part of the fulfillment API was not available on the pages we read.

## Check that the request comes from Microsoft Marketplace

Microsoft calls your webhook with an `Authorization` header that carries a **Microsoft Entra token (JWT)**. Validate it: the `aud` claim must be the Entra application id from your offer's technical configuration, the `appid` or `azp` claim must be the resource id you use for the publisher authorization token, and `tid` must be your Entra tenant id. In addition, Microsoft requires that the SaaS service call the **Get Operation API** to validate and authorize the webhook call and payload data before it acts. Do not put security tokens or SAS tokens in the webhook URL.

## Retries and duplicates

Microsoft has a retry policy for the webhook call: 500 retries over eight hours. The webhook URL service must be up 24 hours a day, 7 days a week.

## Match the customer and the plan

Identify the subscription by `subscriptionId` and the customer by the `beneficiary` and `purchaser` (`emailId`, `tenantId`, `objectId`). Use `subscriptionId` as the NetLicensing licensee `number` (see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids)), and map `planId` (and `offerId`) to your `licenseTemplateNumber` with a lookup table. `isTest` and `isFreeTrial` tell you about test and trial subscriptions.

## Example: the calls

```text
Microsoft                   Your receiver                 NetLicensing
|                           |                             |
| Subscribe --------------->|                             |
|                           | validate Entra JWT          |
|< GET operation -----------|                             |
|                           | POST /licensee ------------>|
|                           |  number=subscriptionId      |
|                           | POST /license ------------->|
|                           |  number=sub-term            |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Microsoft calls your webhook

```http
POST /webhooks/microsoft-marketplace HTTP/1.1
Content-Type: application/json
Authorization: Bearer <Microsoft Entra JWT>

{
  "id": "<operation id>",
  "activityId": "<guid>",
  "publisherId": "XXX",
  "offerId": "YYY",
  "planId": "plan1",
  "quantity": 100,
  "subscriptionId": "<guid>",
  "timeStamp": "2026-11-08T10:00:00.0000000Z",
  "action": "Subscribe",
  "status": "Succeeded"
}
```

### 2. Your receiver checks the request

Validate the JWT in the `Authorization` header: `aud` is your offer's Entra application id, `appid` or `azp` is the resource id used for the publisher authorization token, and `tid` is your tenant id. Then confirm the call with the Get Operation API (step 3), as Microsoft requires.

### 3. Your receiver calls Microsoft

```bash
# Confirm the webhook: the operation id is the "id" from the webhook body
curl "https://marketplaceapi.microsoft.com/api/saas/subscriptions/$SUBSCRIPTION_ID/operations/$OPERATION_ID?api-version=2018-08-31" \
  --header "Authorization: Bearer $PUBLISHER_TOKEN" \
  --header "content-type: application/json"
```

### 4. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# Subscribe: the marketplace subscriptionId becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=37f9dea2-4345-438f-b0bd-03d40d28c7e0&name=Contoso" \
  $NLIC/licensee

# Subscribe: one license for the subscription; Renew adds one per term if your plan is time-based
curl --user $AUTH --header "Accept: application/json" \
  --data "number=37f9dea2-4345-438f-b0bd-03d40d28c7e0-1&licenseeNumber=37f9dea2-4345-438f-b0bd-03d40d28c7e0&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Suspend or Unsubscribe
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/37f9dea2-4345-438f-b0bd-03d40d28c7e0-1
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Microsoft: SaaS fulfillment webhook](https://learn.microsoft.com/en-us/partner-center/marketplace-offers/pc-saas-fulfillment-webhook){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Microsoft Marketplace connector. The Microsoft Marketplace details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Cloud Marketplaces](cloud-marketplaces).
