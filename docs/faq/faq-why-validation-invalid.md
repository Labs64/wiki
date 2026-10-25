---
layout: post
title: "Why does validation return valid=false?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Common reasons a NetLicensing validation returns valid=false: no license, inactive license, expired period, used-up credits or quota, unknown node secret, wrong product module."
permalink: faq-why-validation-invalid
faq_category: Validation
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

My customer bought a license, but validation returns `valid=false`. What should I check?

## Answer

Start with the obvious: are you reading the result for the right `productModuleNumber`? A product can have several
modules, and each one is validated on its own.

Next, open the licensee in the Management Console and check that the license is there and active. Inactive licenses
(`active=false`) are ignored.

If both look fine, it's usually the licensing model's rules doing their job:

| Model | Typical reason |
|-------|----------------|
| [Subscription](subscription), [Rental](rental) | The paid period has ended and no grace period applies |
| [Try & Buy](try-n-buy) | The trial is over and no full license was bought |
| [Pay-per-Use](pay-per-use) | No credits left |
| [Quota](quota) | The total quota is 0 |
| [Node-Locked](node-locked) | The `nodeSecret` is new and all device slots are taken |
| [Floating](floating) | All seats are checked out, or the call was a `checkIn`, which always returns `false` |

Some models also need parameters on validation, and leaving them out gives the wrong answer. And finally, your
application may still be holding an older cached result, so validate again after a purchase.

The [warning level](warning-level) in the result is handy for spotting customers who are about to tip into `false`.
