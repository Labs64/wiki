---
layout: post
title: "How do customers renew an expired subscription?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Send the customer to NetLicensing Shop with a shop token to buy a renewal; the next validation reflects the new period. Use the grace period to avoid interruptions."
permalink: faq-renew-subscription
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

A customer's subscription has expired. How do they renew, and do I need to send a new key?

## Answer

You don't need to send anything new. The customer stays the same licensee and simply buys another license.

Your application or website creates a [shop token](token-services#create-token) for the licensee
(`tokenType=SHOP&licenseeNumber=...`) and opens the `shopURL` it gets back. The customer picks a renewal period and
pays. On the next validation they get `valid=true` and the new `expires` date. If they renew before the old period runs
out, the new one is added on after it, so nobody loses days by renewing early.

To avoid a hard stop, switch on the [grace period](subscription#grace-period) for the Subscription module. Combine
[warning levels](warning-level) with [webhook notifications](notifications) to remind customers before they expire.
Recurring payments work with payment providers that support them, such as [PayPal](paypal).
