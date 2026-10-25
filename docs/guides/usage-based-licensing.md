---
layout: default
title: "Usage-Based Software Licensing with Metering and Quotas"
nav_title: Usage-Based Licensing
parent: Guides
nav_order: 33
description: "Implement usage-based software licensing: meter consumption as credits in pre-payment or post-payment mode with Pay-per-Use, enforce capacity limits with Quota, and combine usage with subscriptions. Data flow, reporting usage on validation, and trade-offs."
permalink: usage-based-licensing
last_modified_at: 2026-10-25
---

Usage-Based Software Licensing with Metering and Quotas
=======================================================

Usage-based licensing charges for what a customer actually uses: API calls, processed documents, compute minutes,
generated reports. To make that work, the licensing system has to know how much the customer bought, how much they've
used, and whether the next unit is allowed. In Labs64 NetLicensing you meter usage with the [Pay-per-Use](pay-per-use)
model, where licenses hold credits, and enforce fixed limits with the [Quota](quota) model.

## Metering or capacity?

| | Pay-per-Use (metering) | Quota (capacity) |
|---|---|---|
| What the license holds | Credits (`quantity`) that get used up (`usedQuantity`) | A fixed limit (`quantity`), or `-1` for unlimited |
| Does validation change it? | Yes, your application reports or reserves usage | No, it only changes when licenses change |
| Who counts usage | NetLicensing, from the numbers you send | Your application, which compares its own count with the quota |
| Examples | 1,000 API calls, 50 report exports | 10 users, 5 projects, 100 GB |
| Validation returns | `valid`, `remainingQuantity` | `valid`, `quota` |

## How Pay-per-Use works

You sell credit packs as QUANTITY license templates, for example 100 credits and 1,000 credits. A customer can buy as
many packs as they like, and their credits are the total over all active licenses.

Your application reports usage when it validates, in one of two ways. In post-payment mode it sends `usedQuantity`, the
credits used since the last validation. If that's more than what was left, the balance goes negative. In pre-payment
mode it sends `reserveQuantity`, the credits it plans to use before the next validation, and NetLicensing won't let it
reserve more than remains.

NetLicensing answers with `remainingQuantity`. When that hits zero, `valid` turns `false` and the customer buys more
credits in [NetLicensing Shop](netlicensing-shop).

```http
POST https://go.netlicensing.io/core/v2/rest/licensee/CUSTOMER-123/validate
Content-Type: application/x-www-form-urlencoded

productModuleNumber0=M-CREDITS&usedQuantity0=25
```

If you only want to read the balance, send `usedQuantity0=0` explicitly.

## Things to decide

Report usage in batches, once per TTL or once per job, rather than for every single unit. Keep a local count of what
you haven't reported yet and only clear it when the call succeeds, so a network hiccup doesn't lose any usage.

Use pre-payment if going over the limit is not acceptable. Reserving credits guarantees the customer can't use more
than they paid for. Post-payment allows a small overshoot but needs fewer calls.

Metering needs the server, so usage that happens offline has to be stored and reported later. The
[NetLicensing Agent](netlicensing-agent) doesn't keep pay-per-use counters when assets are imported again, so don't use
this model with the Agent.

What a credit stands for is entirely up to you. NetLicensing counts whole numbers, and you map them to whatever unit you
bill in.

## Usage combined with other models

You can charge a platform fee plus usage by pairing [Subscription](subscription) for access with Pay-per-Use for
consumption. Plans with included limits are [Pricing Table](pricing-table) plans with quota features. For seats plus
storage, use [Floating](floating) or [Quota](quota) for the seats and Quota for the storage.

## Keeping an eye on balances

Each licensing model has its own [warning level](warning-level) rules. A Pay-per-Use customer turns YELLOW when most of
their credits are gone, for example. Set up [webhook notifications](notifications) for warning level changes and you can
send top-up reminders automatically.

## Related

- [Pay-per-Use](pay-per-use) and [Quota](quota) reference
- [Software Licensing Models Compared](software-licensing-models-compared)
- [FAQ: How do I implement usage-based billing?](faq-usage-based-billing)
