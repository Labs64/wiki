---
layout: post
title: "How do I sell a perpetual license?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Configure a perpetual (one-time purchase) license with the Try & Buy model and the minimum evaluation period."
permalink: faq-perpetual-license
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

I sell my software once, with no expiry. Which licensing model should I use?

## Answer

Use [Try & Buy](try-n-buy). Its FEATURE license template holds the one-time price, and once the customer owns that
license, validation returns `valid=true` and `evaluation=false` with no end date. Don't want a trial at all? Set the
evaluation period to the minimum of one day, as described for *Standard / Permanent / Perpetual* in
[Licensing Models](licensing-models).

If you also sell updates or support, add a [Subscription](subscription) module for maintenance.
[Subscription vs Perpetual Licensing](subscription-vs-perpetual-licensing) shows how the two fit together.
