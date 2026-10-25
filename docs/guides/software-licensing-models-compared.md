---
layout: default
title: "Software Licensing Models Compared: Perpetual, Subscription, Floating, Node-Locked and Usage-Based"
nav_title: Licensing Models Compared
parent: Guides
nav_order: 30
description: "Compare software licensing models side by side: perpetual, trial, subscription, SaaS plans, feature-based, node-locked, floating, usage-based, quota and rental. What each one limits, typical use cases, what your application must send on validation, and how to combine them."
permalink: software-licensing-models-compared
last_modified_at: 2026-10-25
---

Software Licensing Models Compared
==================================

A licensing model is the rule that decides what a customer may use, for how long and how much. Most products end up
with two or three of them, for example a free trial, then a subscription, with a few premium features sold on top. In
Labs64 NetLicensing every [product module](object-model#product-module) uses one licensing model, and a product can
have as many modules as you like, so mixing models is easy.

## Comparison

| Model | What it limits | Where it's used | What your app sends on validation | NetLicensing page |
|-------|----------------|-----------------|-----------------------------------|-------------------|
| Perpetual | Nothing once bought | Desktop tools sold once | Nothing extra | [Try & Buy](try-n-buy) with the shortest evaluation period |
| Trial (Try & Buy) | Evaluation time, then a purchase | Downloadable software with a free trial | Nothing extra | [Try & Buy](try-n-buy) |
| Subscription | Calendar time, renewable | Monthly or yearly licenses, maintenance plans | Nothing extra | [Subscription](subscription) |
| SaaS plans | The plan and its features | Free, basic and premium tiers; freemium | Nothing extra | [Pricing Table](pricing-table) |
| Feature-based | Single features or editions | Lite, pro and enterprise editions; add-ons | Nothing extra | [Multi-Feature](multi-feature) |
| Node-locked | Number of devices or named users | Workstation software, hardware-bound licenses | A node secret (fingerprint) | [Node-Locked](node-locked) |
| Floating (concurrent) | Sessions at the same time | Engineering and enterprise tools shared by a team | A session ID plus check-out or check-in | [Floating](floating) |
| Usage-based | Credits used | API calls, processed documents, compute time | The quantity used or reserved | [Pay-per-Use](pay-per-use) |
| Quota | Capacity | Seats, storage, projects, requests per day | Nothing extra; your app compares its own usage with the quota | [Quota](quota) |
| Rental | Time per instance | Devices or assets, each licensed for its own period | Nothing extra | [Rental](rental) |
| Discount | Price | Promo codes and campaigns in the shop | Doesn't apply | [Discount](discount) |

## Picking a model

Start with how customers pay: once (perpetual), per period (subscription or SaaS plan), per use (pay-per-use) or per
unit of capacity (quota).

Then decide whether there's a trial or a free plan. Try & Buy has a trial built in, Subscription can hand out a free
period automatically, and Pricing Table can have a free plan.

Next, what does one license cover? It could be a device (node-locked), a concurrent user (floating) or an account or
tenant, which is simply the licensee itself. For named users, either use the user ID as the licensee number or use
node-locked with the user ID as the node secret.

Last, if some features are sold separately, add a Multi-Feature module, or list the features per plan in Pricing Table.

## Combinations we see often

| Scenario | Combination |
|----------|-------------|
| Desktop app with a trial and a yearly license, two devices per customer | [Subscription](subscription) with a free automatic license, plus [Node-Locked](node-locked) with quota 2 |
| SaaS with free, pro and business plans and paid add-ons | [Pricing Table](pricing-table) plus [Multi-Feature](multi-feature) |
| Team tool sold as concurrent seats per year | [Subscription](subscription) plus [Floating](floating) |
| API product with prepaid credit packs | [Pay-per-Use](pay-per-use), with [Subscription](subscription) for platform access if you charge for it |
| Fleet of devices, each licensed for its own period | [Rental](rental) |

[How to license a product using multiple licensing models](faq-multiple-licensing-models) shows how to set this up.

## Related comparisons

- [Node-Locked vs Floating Licenses](node-locked-vs-floating-licenses)
- [Subscription vs Perpetual Licensing](subscription-vs-perpetual-licensing)
- [Usage-Based Software Licensing with Metering and Quotas](usage-based-licensing)
- [Licensing a SaaS Application](saas-licensing)
- The full list, including planned models: [Licensing Models](licensing-models)
