---
layout: post
title: "How do I license a SaaS application?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Map each tenant to a licensee, model plans with Pricing Table, validate on your server and cache entitlements until the TTL."
permalink: faq-saas-licensing
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

We run a multi-tenant SaaS. How does NetLicensing fit in?

## Answer

Treat each tenant (account or organization) as one [licensee](object-model#licensee), with your tenant ID as the
licensee number. Plans go into [Pricing Table](pricing-table), add-ons into [Multi-Feature](multi-feature), seats into
[Quota](quota) or [Floating](floating), and metered usage into [Pay-per-Use](pay-per-use).

Your back end validates the tenant, caches the result until the `ttl`, and passes the plan and limits on to the rest of
the application. The API key never leaves your server. Upgrades go through [NetLicensing Shop](netlicensing-shop) or
your own billing system, and [webhook notifications](notifications) tell your back end when to refresh its cache.

[Licensing a SaaS Application](saas-licensing) walks through the whole setup.
