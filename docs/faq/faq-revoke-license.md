---
layout: post
title: "How do I revoke or deactivate a license?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Deactivate a license by setting active=false (it is then ignored by validation), deactivate the licensee, or delete it. Takes effect at the next validation."
permalink: faq-revoke-license
faq_category: Licenses and customers
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

A customer asked for a refund. How do I take the license away?

## Answer

Set the license's `active` property to `false`, either in the Management Console or with
[update license](license-services). Validation ignores inactive licenses, and you can switch it back on later if you
change your mind.

You can also deactivate the whole [licensee](licensee-services#update-licensee) (`active=false`) so it can't get new
licenses, along with its licenses. Or delete the license or licensee if you really don't need the data any more; the
[Privacy Center](privacy-center) covers deletion requests.

Whatever you do takes effect the next time the customer validates. If their application is working from a cached
result, it carries on until that result's `ttl`, so your TTL setting is the longest it can take.
[License Lifecycle](license-lifecycle) has the full picture.
