---
layout: post
title: "How does license validation work in NetLicensing?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Your application sends the licensee number to the validate endpoint; NetLicensing evaluates all active licenses per product module and returns the result with a TTL."
permalink: faq-how-license-validation-works
faq_category: Validation
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

What happens when my application validates a license?

## Answer

Your application sends `POST /core/v2/rest/licensee/{licenseeNumber}/validate`, signed in with an API key, along with
any parameters the licensing model needs, such as a `nodeSecret` or a floating `sessionId`.

NetLicensing then takes all of that licensee's active licenses and runs them through the rules of each product module's
[licensing model](licensing-models). The response has one `ProductModuleValidation` entry per module, with `valid` and
whatever else the model returns (`expires`, `remainingQuantity`, per-feature results), plus a `ttl` timestamp.

Your application turns features on or off from that result and reuses it until the `ttl`. For most applications,
that's the only API call they ever need. More detail is in
[Software Licensing API: Architecture and Examples](software-licensing-api) and the
[validate reference](licensee-services#validate-licensee).
