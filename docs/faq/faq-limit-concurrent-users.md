---
layout: post
title: "How do I limit the number of concurrent users?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Use the Floating licensing model: check out a session per user on validation and check it in on exit; NetLicensing enforces maxSessions."
permalink: faq-limit-concurrent-users
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

My customer has 50 employees, but only 10 should use the software at the same time. How?

## Answer

That's exactly what the [Floating](floating) model is for. Create a FLOATING license template with `maxSessions=10`.

When someone starts working, validate with
`productModuleNumber0=<module>&sessionId0=<id>&action0=checkOut`. If a seat is free you get `valid=true` and an
`expirationTimestamp`. Check out again before that time to keep the seat, and send `action0=checkIn` when the user
stops.

If a client crashes and never checks in, the seat is freed after the module's `maxCheckoutValidity` (in seconds), so
don't set that too high. The session ID is yours to choose; one per user and host works well.
