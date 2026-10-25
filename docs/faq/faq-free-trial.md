---
layout: post
title: "How do I offer a free trial of my software?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Offer a free trial with the Try & Buy model, an automatic free license in Subscription, or a trial option in a Pricing Table plan."
permalink: faq-free-trial
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

I want every new user to get a 14-day trial and then pay. How do I set that up?

## Answer

It depends on what comes after the trial.

If the trial leads to a one-time purchase, use [Try & Buy](try-n-buy). A hidden TIMEVOLUME template with
`timeVolume=14`, price 0 and `automatic=true` starts the trial on the first validation, and a FEATURE template holds the
purchase price. Validation tells you `evaluation` and `evaluationExpires`.

If it leads to a subscription, use [Subscription](subscription) and mark one license template with price 0 as
*automatic*. Every new licensee then gets that free period, starting with their first validation.

For SaaS plans, [Pricing Table](pricing-table) plans can have a free trial or run as freemium.

Combine any of these with [licensee auto-create](faq-licensee-auto-create) and the trial starts without anyone lifting a
finger. Show the days left from `evaluationExpires` or `expires`, and link to NetLicensing Shop for the purchase.
