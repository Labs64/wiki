---
layout: post
title: "How do customers buy or upgrade licenses?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Customers buy, renew and upgrade in NetLicensing Shop opened with a shop token, or in your own e-commerce system integrated through NetLicensing Gateway or the API."
permalink: faq-how-customers-buy-licenses
faq_category: Licenses and customers
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

How does a customer buy a license for my product?

## Answer

Most vendors use [NetLicensing Shop](netlicensing-shop). Create a [shop token](token-services#create-token) for the
licensee and send the customer to the `shopURL` in the response. The shop is white-label; it shows the license templates
of your product, takes payment through [PayPal](paypal) or [Stripe](stripe), and assigns the licenses. Bundle and
permanent shop tokens let you preselect what's in the cart, which is handy for a "Buy" button on your pricing page.

Already have an online shop or billing platform? Connect it through [NetLicensing Gateway](gateway) (for example
[FastSpring](fastspring) or [MyCommerce](mycommerce)), or create licenses from your back end
[with the API](faq-create-license-programmatically).

And for the odd offline invoice, you can always add licenses by hand in the Management Console. Customers can see what
they own in the [Customer Portal](customer-portal).
