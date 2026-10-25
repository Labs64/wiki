---
layout: post
title: "How do I enable features or editions per customer?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Use the Multi-Feature model to sell features or editions individually, or Pricing Table plans to bundle features per plan."
permalink: faq-feature-based-licensing
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

I have lite, pro and enterprise editions, plus some add-ons. How do I license them?

## Answer

If editions and add-ons are sold one by one, use [Multi-Feature](multi-feature). Each FEATURE license template is one
feature or edition with its own price, and validation returns every feature you've configured as `valid=true` or
`false`, keyed by the license template number.

If features come bundled in plans, use [Pricing Table](pricing-table). Each plan has its own features (SKUs), price and
billing interval, and validation tells you which plan the customer is on and what's included.

Either way, your application looks up the feature it cares about, `Emf-pro` for instance, and shows or hides the
functionality. You can also hand out a feature for free, by adding the license through the API or by marking its
template *automatic*.
