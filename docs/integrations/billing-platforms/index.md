---
layout: default
title: Billing and Commerce Platforms
nav_title: "Billing & Commerce"
parent: Integrations
nav_order: 1
has_children: true
has_toc: false
description: "Connect billing, subscription and eCommerce platforms to NetLicensing with webhooks: a tested API pattern and guides for many platforms, from Stripe to Shopify."
permalink: billing-platforms
last_modified_at: 2026-11-08
---

{{ page.title }}
================

Your billing platform takes the money; NetLicensing decides what the customer may use. This section connects the two: when a
customer buys, renews, cancels or gets a refund, the billing platform sends a **webhook** (some platforms call it IPN,
notification or callout), and a small receiver of yours turns it into a NetLicensing API call. The [guides](#platforms) cover
many platforms; the same pattern works for any other platform that can call a URL.

> **These are integration guides, not hosted connectors.** You run the receiver: your back end, a serverless function, or an
> [automation platform](automation-platforms) such as [Zapier](zapier), [n8n](n8n) or [Azure Logic Apps](azure-logic-apps).
> Each guide is based on the vendor's own documentation and lists its sources, and the NetLicensing calls below
> were tested against the live API. Vendors change their APIs, so verify the details against the vendor's documentation before you go live.

## Before you start

1. **Model your plans in NetLicensing.** Create the product, a product module with the [licensing model](licensing-models) that
   fits, and one [license template](object-model#license-template) per plan or period you sell.
2. **Create an API key** in the Management Console ([API Access](https://ui.netlicensing.io/#/settings){:target="_blank"}{:rel="noopener"})
   with the role `ROLE_APIKEY_OPERATION`. It may create, change and delete licensees and licenses, and nothing else. A key with the
   lower role `ROLE_APIKEY_LICENSEE` can only validate: creating a licensee with it returns `403 Forbidden`.
3. **Pick where the receiver runs**, and give it the API key, the billing platform's webhook secret, and a lookup table from the
   platform's plan or price ids to your `licenseTemplateNumber` values.

## How it works

```
Billing platform  --webhook-->  Your receiver  --REST API-->  NetLicensing
 (sale, renewal,                (verify, map,                  (licensee, license)
  cancellation)                  call the API)
```

1. **Receive.** The platform sends an HTTPS request to your receiver for each event.
2. **Verify.** Check the platform's signature or secret before you trust the request. Each guide explains the platform's method.
3. **Map.** Translate the event into a NetLicensing action, using the [event mapping](#event-mapping).
4. **Call NetLicensing.** Create or change the licensee and license with the API key.
5. **Answer fast.** Return a `2xx` response quickly. Platforms retry slow or failing deliveries, so the same event can arrive more
   than once and out of order. Using the platform's ids as NetLicensing numbers makes repeats harmless, as described [below](#platform-ids).

## How licenses follow payments {#grant-time}

**Time-based plans.** With the [Subscription](subscription) licensing model, create **one license per paid period**. NetLicensing
adds the time of each new license after the time already bought, so the `expires` date returned by validation moves forward. In our
test, a second one-year license moved `expires` from 2027-11-15 to 2028-11-15, and deactivating it moved the date back.

- Choose the event that reports the **payment** for each period. Do not create a license on a "subscription created" event *and*
  on the payment event for the same period: on several platforms, such as Stripe, Lemon Squeezy, SendOwl and PayKickstart, the
  first payment sends both. Each guide names the events to use.
- A cancellation **at the end of the period** needs no API call: no new license arrives, and access ends when the paid time runs
  out. For a refund, a chargeback or an immediate cancellation, deactivate the license (`active=false`).
- A license from an evaluation template marked *automatic* (a free trial) belongs to every new licensee. Deactivating the paid
  licenses does not remove it; it runs out by itself.

**Usage-based billing and cloud marketplaces.** On platforms such as [Orb](orb), [Lago](lago) and [Metronome](metronome), and on
the [cloud marketplaces](cloud-marketplaces), an invoice pays for usage, not for a fixed period of access. Let the license follow
the subscription instead: create it when the subscription starts and deactivate it when the subscription ends. Use a licensing
model without an end date, for example [Multi-Feature](multi-feature), whose licenses stay valid until you deactivate them, or
[Quota](quota) for capacity limits.

## Use the platform's IDs as NetLicensing numbers {#platform-ids}

NetLicensing lets you choose the `number` of a licensee or license when you create it. Use the billing platform's ids:

| NetLicensing entity | Number to use | Example |
|---------------------|---------------|---------|
| Licensee | The platform's customer id | `cus_NeZwdNtLEOXuvB` (Stripe), `ctm_...` (Paddle) |
| License | The id of the payment, invoice or order that paid for it | `in_...` (Stripe invoice), `txn_...` (Paddle transaction) |

This gives you three things, all confirmed in our test against the live API:

- **Later webhooks find the right entity.** A cancellation that names `cus_NeZwdNtLEOXuvB` maps straight to
  `/licensee/cus_NeZwdNtLEOXuvB`, without a database of your own. Ids with underscores, hyphens, and email addresses worked as numbers.
- **Retries are harmless.** Creating a licensee or license with a number that already exists fails with HTTP `400` and
  `DuplicateEntityException`. Treat that answer as "already done" and reply `2xx` to the platform.
- **No lookup by custom property is needed.** The list endpoints filter by paging and sorting only, so a licensee cannot be found
  by a [custom property](custom-properties). Custom properties are still useful for reference: any body field that is not a
  reserved name, for example `billingCustomerId=cus_123`, is stored on the entity.

Three rules apply:

| Rule | What to do |
|------|------------|
| A number may contain only letters, digits and `@ + % & $ : . - _` (the API answers anything else with `IllegalOperationException`) | If a platform id contains other characters, such as `=` or `/`, derive the number from it, for example with a hash (see [Gumroad](gumroad)) |
| A licensee number is unique across **all products** of your vendor account | If one customer buys two of your NetLicensing products, add a product suffix |
| A licensee number cannot be changed once the licensee has a license | To give a licensee a second identifier, such as an email address, use [aliases](aliases) |

### Event mapping

| Platform event | NetLicensing action |
|----------------|---------------------|
| New customer | [Create a licensee](licensee-services#create-licensee) with `productNumber`, the platform's customer id as `number`, and a `name` |
| Payment for a period (first payment or renewal) | [Create a license](license-services#create-license) with `licenseeNumber`, the plan's `licenseTemplateNumber`, and the payment id as `number` |
| Subscription starts (usage-based billing, marketplaces) | Create a license from a template without an end date |
| Plan change | Create a license from the new template and deactivate the old one |
| Cancellation at the end of the period | Time-based plans: nothing to do. Usage-based plans: deactivate the license |
| Refund, chargeback or immediate cancellation | [Update the license](license-services#update-license) with `active=false` |
| Payment failed or past due | Your choice: keep access during the platform's retry period, or deactivate |

### Example: the calls a receiver makes

These are the calls we ran against the live API (with the public demo account instead of an API key). Replace the product and
template numbers with your own.

```bash
BASE=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$API_KEY"

# New customer: the platform's customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=cus_NeZwdNtLEOXuvB&name=Jane%20Doe" \
  $BASE/licensee

# Paid invoice: one license per payment, numbered with the invoice id
curl --user $AUTH --header "Accept: application/json" \
  --data "number=in_1QaBcD&licenseeNumber=cus_NeZwdNtLEOXuvB&licenseTemplateNumber=EUJK1BXQ52" \
  $BASE/license
# The same webhook again returns HTTP 400 with DuplicateEntityException: answer 2xx and stop

# Refund: deactivate the license
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $BASE/license/in_1QaBcD

# What the customer may use now
curl --user $AUTH --header "Accept: application/json" --request POST \
  $BASE/licensee/cus_NeZwdNtLEOXuvB/validate
```

You can try every call without an account in the [API Test Center](https://netlicensing.io/NetLicensing-API/){:target="_blank"}{:rel="noopener"}.

## Platforms

Everything in these tables comes from the platforms' own documentation. "None documented" means we found no signing mechanism; the
guide then describes the protection that is available.

### Subscription billing

| Platform | Authenticity check | Creates licenses on |
|----------|--------------------|---------------------|
| [Stripe Billing](stripe-billing) (also MoonClerk) | HMAC-SHA256 signature header | `invoice.paid` |
| [Chargebee](chargebee) | Basic auth or secret in the URL; no signature | `subscription_created`, `subscription_renewed` |
| [Recurly](recurly) | HMAC-SHA256 signature (JSON only); Basic auth | New and renewed subscription notifications |
| [Maxio](maxio) (formerly Chargify) | HMAC-SHA256 signature header | `signup_success`, `renewal_success` |
| [Zuora](zuora) | Basic, OAuth 2.0, optional HMAC | New subscription, renewal |
| [Frisbii](frisbii) (Reepay, Billwerk) | HMAC-SHA256 over timestamp and event id, or Basic auth | `invoice_settled` |
| [ChargeOver](chargeover) | Shared secret token; no signature | Package `insert` and `generate` |
| [Braintree](braintree) | Signature parsed with the Braintree SDK | `subscription_went_active`, `subscription_charged_successfully` |
| [PayPal Subscriptions](paypal-subscriptions) | Signature verified with PayPal's certificate or API | `PAYMENT.SALE.COMPLETED` |
| [Authorize.Net](authorize-net) | HMAC-SHA512 signature header | `net.authorize.payment.authcapture.created` |
| [Mollie](mollie) | None; you fetch the payment from the API | A payment that is `paid` |
| [BlueSnap](bluesnap) | None documented | `CHARGE`, `RECURRING` |

### Software and digital product checkouts

| Platform | Authenticity check | Creates licenses on |
|----------|--------------------|---------------------|
| [Paddle](paddle) (Billing) | HMAC-SHA256 signature header | `transaction.completed` |
| [FastSpring](fastspring-licensing) | HMAC-SHA256 signature header (optional secret) | `order.completed`, `subscription.charge.completed`; [setup](fastspring-setup) and [receiver script](fastspring-receiver) included |
| [Lemon Squeezy](lemon-squeezy) | HMAC-SHA256 signature header | `order_created`, `subscription_payment_success` |
| [2Checkout (Verifone)](2checkout) | HMAC-SHA256 signature field | IPN `COMPLETE`, LCN `LICENCE_CHANGE` |
| [Cleverbridge](cleverbridge) | Basic auth; no signature | `PaidOrderNotification`, `SubscriptionPaidNotification`, or the key generator callout |
| [PayPro Global](payproglobal) | SHA-256 `SIGNATURE` parameter | `OrderCharged`, `SubscriptionChargeSucceed` |
| [Gumroad](gumroad) | Optional HMAC-SHA256 signature header (Ping only) | `sale` |
| [SendOwl](sendowl) | HMAC-SHA256 signature header | `complete`, `new_payment` |
| [PayKickstart](paykickstart) | HMAC-SHA1 hash field | `sales` |

### Usage-based billing

| Platform | Authenticity check | Creates licenses on |
|----------|--------------------|---------------------|
| [Orb](orb) | HMAC-SHA256 signature header and timestamp | `subscription.started` |
| [Lago](lago) | HMAC or JWT, chosen per endpoint | `subscription.started` |
| [Metronome](metronome) (part of Stripe) | HMAC-SHA256 signature header | `contract.start`, `subscription.start` |

### Online stores

| Platform | Authenticity check | Creates licenses on |
|----------|--------------------|---------------------|
| [Shopify](shopify) | HMAC-SHA256 signature header | `orders/paid` |
| [WooCommerce](woocommerce) | HMAC-SHA256 signature header | `order.updated` with status completed |
| [Shopware 6](shopware) | HMAC-SHA256 signature header (apps) | Order payment state `paid` |

Selling through [PayPal](paypal) or [Stripe](stripe) directly, without your own billing system? Both are built into
[NetLicensing Shop](netlicensing-shop), which needs no receiver at all.

## Your platform is not listed?

The pattern works for any system that can call a URL when something happens. Check three things in the platform's documentation:

1. Can it send a webhook for new customers, payments (first and recurring), and cancellations or refunds?
2. Does the request identify the customer, the payment, and the purchased plan or product?
3. Does it sign the request or support a secret, so your receiver can reject forged calls?

If the answers are yes, the [event mapping](#event-mapping) applies as it is. If the platform calls a URL during checkout and
expects a license key in the response, a [Gateway connector](gateway) is the better fit. [Contact us](mailto:info@netlicensing.io)
and we will help you choose.
