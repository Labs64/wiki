---
layout: post
title: How to use offline validation using TTL and cached response
parent: FAQ & Troubleshooting
nav_order: 100
description: "How to use offline validation using TTL and cached response"
permalink: faq-offline-validation-ttl
---

{{ page.title }}
=============

## Question

Some of my customers do not have instant internet access. How to use offline validation in this scenario?

## Answer

Every NetLicensing validation response contains an attribute with the *TTL (Time-To-Live)* value.
Successful validation response can be cached with the expiry time set to this interval.
Caching functionality need to be realised by means of the specific product implementation and technology stack.

Please find below a typical flow for the *"Offline validation using TTL"*

<a href="assets/images/faq-offline-validation-ttl.png" class="imagelink" data-lightbox="multiple-licensing-models" data-title="Offline validation using TTL" data-alt="Offline validation using TTL">
  <img src="assets/images/faq-offline-validation-ttl.png" />
</a>
