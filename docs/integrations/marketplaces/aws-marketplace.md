---
layout: default
title: "AWS Marketplace Licensing Integration"
nav_title: "AWS Marketplace"
parent: Cloud Marketplaces
grand_parent: Integrations
nav_order: 10
description: "Sell SaaS on AWS Marketplace with NetLicensing: SNS or EventBridge events create a licensee and a license, unsubscribe events deactivate it."
permalink: aws-marketplace
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: AWS Marketplace tells you about subscriptions through Amazon SNS or, for newer sellers, Amazon EventBridge. Your service resolves the buyer with `ResolveCustomer`, creates the NetLicensing licensee and license, and deactivates the license when the buyer unsubscribes.

When you sell a SaaS product through **AWS Marketplace**, AWS tells you when a buyer subscribes, changes the contract or cancels. Your receiver uses these notifications to create and revoke licenses in NetLicensing.

> **SNS or EventBridge?** AWS states: "If you registered your seller account after July 15, 2026, use Amazon EventBridge to receive events", and that new notifications are available only in EventBridge. Sellers registered on or before that date can keep using SNS. AWS also states that, starting June 1, 2026, all new SaaS products must support updated integration requirements (concurrent agreements).

## What AWS Marketplace sends

**Registration.** The buyer is redirected to your registration URL with an HTTP `POST` and a temporary `x-amzn-marketplace-token`. Exchange it by calling `ResolveCustomer` to get `CustomerAWSAccountId`, `LicenseArn` and `ProductCode`. AWS states that for new SaaS integrations the `CustomerIdentifier` is **not populated**: use `CustomerAWSAccountId` and `LicenseArn` to identify the customer.

**SNS (sellers registered on or before July 15, 2026).** Two topics, in the form `arn:aws:sns:us-east-1:123456789012:aws-mp-subscription-notification-PRODUCTCODE`: `aws-mp-subscription-notification` for all pricing models, with the fields `action`, `customer-identifier`, `product-code`, `offer-identifier` and `isFreeTrialTermPresent`; and `aws-mp-entitlement-notification` for contract pricing only, with the single action `entitlement-updated`. You can only subscribe to these topics from the AWS account that sells the product, and AWS recommends an SQS queue that a service continually polls.

**EventBridge.** Events arrive on your default event bus with the source `aws.agreement-marketplace` and the detail types *Purchase Agreement Created - Manufacturer*, *Purchase Agreement Amended - Manufacturer*, *Purchase Agreement Ended - Manufacturer*, *License Updated - Manufacturer*, *License Deprovisioned - Manufacturer* and *Purchase Agreement Advisory Issued - Manufacturer*.

## Map AWS Marketplace events to NetLicensing

| AWS Marketplace event | What to do in NetLicensing |
|----------------|---------------------|
| SNS `subscribe-success` (EventBridge: purchase agreement created) | The seller may begin to send metering records: create a licensee for the buyer's AWS account, then create a license from the plan's template |
| SNS `subscribe-fail` | The buyer may have transitioned even though payment failed: wait for `subscribe-success` before you allow use. No license |
| SNS `entitlement-updated` (EventBridge: license updated) | Contract products: call `GetEntitlements` to read what changed (the notification does not contain it), then adjust the license |
| SNS `unsubscribe-pending` (EventBridge: license deprovisioned) | About one hour remains for final metering records: prepare to deactivate |
| SNS `unsubscribe-success` (EventBridge: purchase agreement ended) | Deactivate the license (`active=false`) |

AWS states that the SNS action names do not map one-to-one to the EventBridge detail types on the pages we read. EventBridge event body fields, delivery retries and message signing are described in the AWS Seller Guide pages that we did not read; check them for the fields that identify the customer before you map events.

## Check that the request comes from AWS Marketplace

The notifications reach you through AWS services under your own AWS account: the SNS topics can be subscribed only from the selling account, and EventBridge delivers to your own event bus. Restrict who may publish or read from your queue or bus with AWS permissions. The AWS pages we read describe no message signing.

## Retries and duplicates

Run the receiver where AWS can reach it from your account, for example a service that polls the SQS queue, or an EventBridge rule that invokes your function. The pages we read state no retry policy for SNS or EventBridge delivery; design the handler to be idempotent and reconcile through the AWS Marketplace APIs.

## Match the customer and the plan

Use `CustomerAWSAccountId` from `ResolveCustomer` as the NetLicensing licensee `number` (see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids)), and the `ProductCode` plus the offer or contract dimensions to pick the `licenseTemplateNumber` with a lookup table. For contract products, the entitlement read with `GetEntitlements` decides the quantity, for example the license quantity or `maxSessions`. The license follows the subscription, so use a licensing model without an end date and deactivate on `unsubscribe-success`.

## Example: the calls

```text
AWS (SQS)                   Your receiver                 NetLicensing
|                           |                             |
| subscribe-success ------->|                             |
|                           | IAM-protected queue         |
|                           | POST /licensee ------------>|
|                           |  number=AWS account         |
|                           | POST /license ------------->|
|                           |  number=agreement           |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. AWS Marketplace notifies you

The `Message` field of an SQS message from the `aws-mp-subscription-notification` SNS topic:

```json
{
  "action": "subscribe-success",
  "customer-identifier": "<customer identifier>",
  "product-code": "<product code>",
  "offer-identifier": "<offer id>",
  "isFreeTrialTermPresent": "false"
}
```

### 2. Your receiver checks the request

There is no signature to check: the message reaches you through your own SNS subscription and SQS queue, so the check is AWS permissions on them. With EventBridge, the event arrives on your default event bus with the source `aws.agreement-marketplace`.

### 3. Your receiver calls AWS

```bash
# At registration: exchange the x-amzn-marketplace-token from the buyer's POST
aws meteringmarketplace resolve-customer \
  --registration-token "$X_AMZN_MARKETPLACE_TOKEN"
# -> CustomerAWSAccountId, LicenseArn, ProductCode (CustomerIdentifier is not populated for new SaaS integrations)
```

### 4. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# Registration: CustomerAWSAccountId from ResolveCustomer becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=123456789012&name=Buyer%20123456789012" \
  $NLIC/licensee

# subscribe-success: one license for the subscription, from a template without an end date
curl --user $AUTH --header "Accept: application/json" \
  --data "number=awsmp-123456789012-prodcode&licenseeNumber=123456789012&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# unsubscribe-success
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/awsmp-123456789012-prodcode
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [AWS Marketplace: SaaS notifications (SNS)](https://docs.aws.amazon.com/marketplace/latest/userguide/saas-notification.html){:target="_blank"}{:rel="noopener nofollow"}
- [AWS Marketplace: SaaS EventBridge integration](https://docs.aws.amazon.com/marketplace/latest/userguide/saas-eventbridge-integration.html){:target="_blank"}{:rel="noopener nofollow"}
- [AWS Marketplace: integrate your SaaS product with subscriptions](https://docs.aws.amazon.com/marketplace/latest/userguide/saas-integrate-subscription.html){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host an AWS Marketplace connector. The AWS Marketplace details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Cloud Marketplaces](cloud-marketplaces).
