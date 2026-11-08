---
layout: default
title: "FastSpring Integration: Event Examples"
nav_exclude: true
description: "FastSpring webhook payloads for orders, rebills, refunds and chargebacks, each with the NetLicensing API calls the receiver makes for it."
permalink: fastspring-event-examples
last_modified_at: 2026-11-08
---

{{ page.title }}
================

Each example shows an excerpt of the event as FastSpring posts it, with webhook expansion enabled, followed by the NetLicensing
calls that the [receiver script](fastspring-receiver) makes. Field names and values come from FastSpring's sample payloads; the
excerpts leave out the fields the receiver does not read. The product map in the examples is:

```json
{
  "cloud-storage": "FS-APP-MONTHLY",
  "furious-falcon": "FS-APP-YEARLY"
}
```

Every FastSpring post wraps one or more events in the same envelope:

```json
{
  "events": [
    { "id": "jazYJQw5RSWVR474tU2Obw", "live": true, "processed": false,
      "type": "order.completed", "created": 1426560444800, "data": { } }
  ]
}
```

The NetLicensing calls below use these variables:

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # ROLE_APIKEY_OPERATION
```

## 1. First purchase: order.completed

`data` of the event (FastSpring's `order.completed` sample, with a subscription item as described under *Item Contents* of
Webhook Expansion):

```json
{
  "id": "aBCDE12fGH3iJkL4mNOpq",
  "reference": "ABC123456-7891-01112",
  "live": true,
  "account": {
    "id": "abCdE1FGH2Hij3KLMnOpqR",
    "contact": { "first": "Jane", "last": "Doe", "email": "jane.doe@company.com" }
  },
  "customer": { "first": "Jane", "last": "Doe", "email": "jane.doe@company.com" },
  "items": [
    {
      "product": "cloud-storage",
      "quantity": 1,
      "subscription": { "id": "ObqQ-K4kSE-cE1T0nwqCAA", "state": "active", "sequence": 1 }
    }
  ]
}
```

NetLicensing calls:

```bash
# The account becomes the licensee; the email becomes its alias
curl --user $AUTH --header "Accept: application/json" \
  --data-urlencode 'aliases=["jane.doe@company.com"]' \
  --data "productNumber=FS-APP&number=abCdE1FGH2Hij3KLMnOpqR&name=Jane%20Doe" \
  $NLIC/licensee

# One license for the item, numbered <order id>-<product path>
curl --user $AUTH --header "Accept: application/json" \
  --data "number=aBCDE12fGH3iJkL4mNOpq-cloud-storage&licenseeNumber=abCdE1FGH2Hij3KLMnOpqR&licenseTemplateNumber=FS-APP-MONTHLY" \
  $NLIC/license

# Remember that period 1 of this subscription is licensed
curl --user $AUTH --header "Accept: application/json" \
  --data "fsSeq_ObqQ-K4kSE-cE1T0nwqCAA=1" \
  $NLIC/licensee/abCdE1FGH2Hij3KLMnOpqR
```

If the item's subscription has `"state": "trial"`, the receiver creates the licensee and no license; the first paid charge
creates it. An item without `subscription` is a one-time purchase: it gets its license and no `fsSeq_...` property.

## 2. Renewal: subscription.charge.completed

`data` of the event (from FastSpring's sample; `sequence` set to 2 for a second billing period):

```json
{
  "order": {
    "id": "NRlOHP0TSM6MwxzPMoc-dg",
    "reference": "ABC123456-7891-01112",
    "items": [
      { "product": "cloud-storage", "quantity": 1, "isSubscription": true, "subscription": "ObqQ-K4kSE-cE1T0nwqCAA" }
    ]
  },
  "status": "successful",
  "sequence": 2,
  "account": { "id": "abCdE1FGH2Hij3KLMnOpqR" },
  "subscription": { "id": "ObqQ-K4kSE-cE1T0nwqCAA", "state": "active", "product": "cloud-storage" }
}
```

NetLicensing calls:

```bash
# Which period was licensed last? The licensee shows fsSeq_ObqQ-K4kSE-cE1T0nwqCAA = 1
curl --user $AUTH --header "Accept: application/json" $NLIC/licensee/abCdE1FGH2Hij3KLMnOpqR

# 2 is higher than 1: one license for the new period
curl --user $AUTH --header "Accept: application/json" \
  --data "number=NRlOHP0TSM6MwxzPMoc-dg-cloud-storage&licenseeNumber=abCdE1FGH2Hij3KLMnOpqR&licenseTemplateNumber=FS-APP-MONTHLY" \
  $NLIC/license

curl --user $AUTH --header "Accept: application/json" \
  --data "fsSeq_ObqQ-K4kSE-cE1T0nwqCAA=2" \
  $NLIC/licensee/abCdE1FGH2Hij3KLMnOpqR
```

The new license adds one month after the time already bought, so the `expires` date of the validation moves forward by a month.

## 3. Prorated charge: subscription.charge.completed in the same period

FastSpring also sends `subscription.charge.completed` for prorated charges. Such a charge has its own order, but the same
`sequence` as the period that is already licensed:

```json
{
  "order": { "id": "<order id of the prorated charge>", "items": [ { "product": "cloud-storage", "subscription": "ObqQ-K4kSE-cE1T0nwqCAA" } ] },
  "sequence": 2,
  "account": { "id": "abCdE1FGH2Hij3KLMnOpqR" },
  "subscription": { "id": "ObqQ-K4kSE-cE1T0nwqCAA", "product": "cloud-storage" }
}
```

The receiver reads `fsSeq_ObqQ-K4kSE-cE1T0nwqCAA` (2), sees that period 2 is licensed, and makes no further call.

## 4. Refund: return.created

`data` of the event (FastSpring's `return.created` sample, shortened):

```json
{
  "return": "aBCDE12fGH3iJkL4mNOpqr",
  "reason": "Duplicate Order",
  "original": {
    "id": "wvje2BeoQbyCRAbucnPrRw",
    "reference": "ABC1234567-8910-11121D",
    "account": "abCdE1FGH2Hij3KLMnOpqR"
  },
  "items": [ { "product": "furious-falcon", "quantity": 1, "refundType": "Full Refund" } ]
}
```

NetLicensing call, per returned item:

```bash
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/wvje2BeoQbyCRAbucnPrRw-furious-falcon
```

## 5. Chargeback: chargeback.created

`data` of the event (FastSpring's sample, shortened). It names the order, not the items:

```json
{ "id": "aB3dE5fG7hI9jK1lM3nO5p", "order": "aB3dE5fG7hI9jK1lM3nO5p" }
```

NetLicensing calls, one per product in the map; a license that does not exist answers `400 NotFoundException`, which the
receiver ignores:

```bash
curl --user $AUTH --header "Accept: application/json" --data "active=false" \
  $NLIC/license/aB3dE5fG7hI9jK1lM3nO5p-cloud-storage
curl --user $AUTH --header "Accept: application/json" --data "active=false" \
  $NLIC/license/aB3dE5fG7hI9jK1lM3nO5p-furious-falcon
```

## 6. What your application calls

```bash
curl --user "apiKey:$NETLICENSING_VALIDATION_KEY" --header "Accept: application/json" --request POST \
  $NLIC/licensee/jane.doe%40company.com/validate
```

The email works because it is the licensee's alias; the account id works as well. The response lists the Subscription module
with `valid` and `expires`.

## Sources

- [FastSpring: order.completed](https://developer.fastspring.com/reference/ordercompleted){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: subscription.charge.completed](https://developer.fastspring.com/reference/subscription-charge-completed){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: return.created](https://developer.fastspring.com/reference/returncreated){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: chargeback.created](https://developer.fastspring.com/reference/order-chargeback){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: webhook expansion](https://developer.fastspring.com/reference/webhook-expansion){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: webhooks overview (envelope)](https://developer.fastspring.com/reference/webhooks-overview){:target="_blank"}{:rel="noopener nofollow"}

---

Back to [FastSpring Licensing Integration](fastspring-licensing).
