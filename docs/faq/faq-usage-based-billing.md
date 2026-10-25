---
layout: post
title: "How do I implement usage-based billing or metering?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Use the Pay-per-Use model: customers buy credits, your application reports used or reserved quantity on validation, and NetLicensing returns the remaining credits."
permalink: faq-usage-based-billing
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

I want to charge per API call or per processed document. Can NetLicensing meter usage?

## Answer

Yes, that's the [Pay-per-Use](pay-per-use) model. Customers buy credit packs (QUANTITY license templates, say 1,000
credits each). When your application validates, it reports what was used, either afterwards with `usedQuantity`
(post-payment) or upfront with `reserveQuantity` (pre-payment). NetLicensing sends back `remainingQuantity`, and when that
reaches zero, `valid` turns `false` and the customer buys more.

What one credit means is your call. Report usage in batches rather than unit by unit, and keep unreported usage on your
side until the call goes through, so nothing gets lost.

For limits that don't get used up, like seats or storage, [Quota](quota) is the better fit. There's more in
[Usage-Based Software Licensing](usage-based-licensing).
