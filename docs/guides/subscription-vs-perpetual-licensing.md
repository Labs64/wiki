---
layout: default
title: "Subscription vs Perpetual Software Licensing"
nav_title: Subscription vs Perpetual
parent: Guides
nav_order: 32
description: "Perpetual licenses are paid once and used indefinitely; subscriptions grant use for a period and must be renewed. Revenue, customer and technical differences, hybrid options, migration, and how to implement both with NetLicensing."
permalink: subscription-vs-perpetual-licensing
last_modified_at: 2026-10-25
---

Subscription vs Perpetual Software Licensing
============================================

With a perpetual license the customer pays once and can use the version they bought for as long as they like. Updates
are often sold separately as maintenance. With a subscription the customer pays per month or per year, and the software
stops working when they stop paying. Perpetual licensing brings in one big payment up front; subscriptions bring
smaller payments that keep coming, and your application has to keep an eye on the expiry date.

## How they differ

| | Perpetual | Subscription |
|---|---|---|
| Payment | Once | Every period |
| When use ends | Never, for the version bought | When the paid period (plus any grace period) runs out |
| What your app checks | Is there a license? | Is the period still running, and until when? |
| Renewals | Optional, for maintenance or upgrades | Needed to keep using the product |
| Offline tolerance | High, since nothing changes after the purchase | Needs a fresh result before the expiry date |
| Good fit for | Tools people use for years without updates; regulated or isolated environments | Software with regular updates, cloud services, SaaS |

## Perpetual licenses in NetLicensing

Use the [Try & Buy](try-n-buy) model. Its FEATURE license template holds the purchase price. Once a customer has that
license, validation returns `valid=true` and `evaluation=false`, with no end date. If you don't want a trial, set the
evaluation period to the minimum of one day, as described under *Standard / Perpetual* in
[Licensing Models](licensing-models).

## Subscriptions in NetLicensing

Use the [Subscription](subscription) model. You create one TIMEVOLUME license template per period and price, say 30,
90 and 365 days. If you mark a template with price 0 as *automatic*, every new customer gets a free period that starts
with their first validation.

When a customer buys a new period before the current one ends, it's added after the current expiry date, so nobody loses
days by renewing early. Validation returns `valid` and `expires`, the end date of all purchased periods together. Switch
on the grace period in the product module if you want customers to keep working for a little while after expiry while
they sort out the renewal.

Customers renew in [NetLicensing Shop](netlicensing-shop), and recurring payments work with the payment providers that
support them, see [PayPal](paypal). If your pricing is a set of plans with different features, [Pricing Table](pricing-table)
is the better fit.

## Mixing the two

A common setup is a perpetual license plus a maintenance subscription. One [Try & Buy](try-n-buy) module grants the
right to use the product, and a [Subscription](subscription) module covers updates or support. Your application then
compares the subscription's `expires` date with the release date of the installed version.

Other mixes work just as well: a subscription with paid add-ons is Subscription plus [Multi-Feature](multi-feature),
and term licenses for individual devices are a job for [Rental](rental).

## Moving customers from perpetual to subscription

Add a Subscription module to the product. Existing perpetual licenses keep working in their own module, so nobody loses
anything. Then decide in your application which features need an active subscription. [Warning levels](warning-level) and
[notifications](notifications) help you follow up with customers whose subscription is about to end.

## Related

- [Software Licensing Models Compared](software-licensing-models-compared)
- [License Lifecycle: Activation, Expiry, Renewal and Revocation](license-lifecycle)
- [FAQ: How do customers renew an expired subscription?](faq-renew-subscription)
