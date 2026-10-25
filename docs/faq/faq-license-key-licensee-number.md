---
layout: post
title: "Does NetLicensing use license keys?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "In NetLicensing the customer is identified by a licensee number, which can be your own license key, a generated number or an alias."
permalink: faq-license-key-licensee-number
faq_category: Getting started
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Where are the license keys? How does my customer enter a key?

## Answer

Not in the usual sense. There's no cryptographic key sitting on the customer's machine. Instead, every customer,
installation or account is a [licensee](object-model#licensee) with a unique licensee number. Your application sends
that number when it [validates](licensee-services#validate-licensee), and NetLicensing looks at the licenses stored for
it.

You choose where the number comes from. NetLicensing can generate it when you create the licensee, or you can set it
yourself, for example to your customer ID, an account ID or a key printed on the invoice. With *licensee auto-create*
switched on for the product, licensees are created on their first validation. And if one customer has several IDs, add
the others as [aliases](aliases).

Selling through an outside shop that issues its own keys? See
[Transferring licenses between licensees](transferring-licenses-between-licensees).
