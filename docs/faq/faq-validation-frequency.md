---
layout: post
title: "How often should my application validate the license?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Validate at start-up and when licensed functionality is used, but reuse the result until the TTL returned in the validation response."
permalink: faq-validation-frequency
faq_category: Validation
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Should I call validate on every start, every request or every function call?

## Answer

Validate when it matters, say when the application starts, when someone opens a licensed feature or when a session
begins, and then reuse the result until its `ttl`. Calling the API on every function call slows your application down
and adds load without making anything more accurate.

The exception is when you expect the license to change, for example right after the customer comes back from buying
something in NetLicensing Shop. Validate again straight away in that case.

You set the TTL interval in the Management Console settings. A short TTL means revocations and renewals show up sooner;
a long one rides out longer network outages. See
[How to use offline validation using TTL and cached response](faq-offline-validation-ttl).
