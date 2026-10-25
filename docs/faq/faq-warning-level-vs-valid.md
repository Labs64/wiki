---
layout: post
title: "What is the difference between the warning level and valid?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "valid tells whether a product module may be used now; the warning level (GREEN, YELLOW, RED) indicates whether the customer is close to becoming under-licensed."
permalink: faq-warning-level-vs-valid
faq_category: Licenses and customers
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

The validation result has both `valid` and `warningLevel`. Which one should my application use?

## Answer

Use `valid` to decide whether something is allowed right now. It's calculated for each product module every time you
validate.

The [warning level](warning-level) is more of an early-warning light for you as the vendor. GREEN means fully licensed,
YELLOW means the customer is getting close to the limit (most credits used, subscription ending soon), and RED means
they're under-licensed. It's useful for nudging the customer in your UI, starting renewal campaigns or keeping an eye
on accounts. Each licensing model has its own rules for it, and changes can be sent to you as
[webhook notifications](notifications).
