---
layout: post
title: "Which payment methods and e-commerce platforms are supported?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "NetLicensing Shop accepts PayPal and Stripe; external platforms such as FastSpring connect through NetLicensing Gateway, and billing platforms connect through webhooks and the REST API."
permalink: faq-payment-providers
faq_category: Integrations
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Which payment providers can I use, and can I keep my existing online shop?

## Answer

NetLicensing Shop takes payments through [PayPal](paypal), including recurring payments for subscriptions, and through
[Stripe](stripe). The money goes straight into your own payment provider account. See
[Payment Service Providers](payment-service-providers).

You can keep your existing shop, too. [NetLicensing Gateway](gateway) connects [FastSpring](fastspring) and hands license
keys back to its order fulfilment. For other billing and commerce platforms, such as Paddle, Chargebee, Recurly or
Shopify, see [Billing and Commerce Platforms](billing-platforms): their webhooks call the
[REST API](faq-create-license-programmatically) to create licensees and licenses. If billing runs in your own system,
use the same API from your back end, or see how to work with
[subscription management services](faq-3pp-subscription-management).

For sales to consumers in the EU, NetLicensing Shop applies the [EU VAT rules](eu-vat-2015) for digital services.
