---
layout: post
title: How to use offline validation using TTL and cached response
parent: FAQ & Troubleshooting
nav_order: 100
description: "Cache the last successful validation response and reuse it until its TTL (time-to-live) expires, so your application keeps working while temporarily offline."
last_modified_at: 2026-10-25
permalink: faq-offline-validation-ttl
faq_category: Offline and on-premises
---

{{ page.title }}
=============

## Question

Some of my customers do not have instant internet access. How to use offline validation in this scenario?

## Answer

Every NetLicensing validation response contains an attribute with the *TTL (Time-To-Live)* value.
Successful [validation response](licensee-services#validate-licensee) can be cached with the expiry time set to this interval and used to validate product without sending online validation request.

*TTL Interval* can be defined in the Settings form and be in the range from 1 minute to several days.

Caching functionality need to be realised by means of the specific product implementation and technology stack.

Please find below a typical flow for the *"Offline validation using TTL"*

<a href="assets/images/faq-offline-validation-ttl.png" class="imagelink" data-lightbox="multiple-licensing-models" data-title="Offline validation using TTL" data-alt="Offline validation using TTL">
  <img alt="Offline validation time-to-live (TTL) timeline" src="assets/images/faq-offline-validation-ttl.png" />
</a>

Related guides
--------------

- [Offline Software License Validation: Architecture and Trade-offs](offline-license-validation)
- [FAQ: Can I validate licenses offline with a signed file?](faq-offline-validation-file)
- [FAQ: How do I handle system clock changes in offline validation?](faq-clock-tampering)
