---
layout: post
title: "How do I handle system clock changes in offline validation?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Offline licensing decisions based on dates trust the local clock; record the last seen time, compare it with server timestamps and treat backward jumps as suspicious."
permalink: faq-clock-tampering
faq_category: Offline and on-premises
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Can a user extend a cached or offline license by setting the computer clock back?

## Answer

They can try. Any decision your application makes offline, such as comparing a cached `ttl` or a subscription's
`expires` date with the current time, depends on the local clock. You can make it a lot harder, though.

Keep track of the latest time your application has seen, including the timestamps from the last online validation. If
the clock suddenly shows an earlier time, treat it as suspicious. Store cached results in their signed form and check
the signature every time you load them, so nobody can edit the dates (see [Signing the Response](signing-the-response)).
Keep offline periods as short as practical, and ask for an online validation after anything odd happens with the
clock.

If you use the [NetLicensing Agent](netlicensing-agent), its smart card also protects the Agent's own counters and time
tracking against someone restoring an old snapshot.
