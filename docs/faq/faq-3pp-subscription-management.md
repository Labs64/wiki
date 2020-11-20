---
layout: post
title: How to use NetLicensing with subscription management services
parent: FAQ & Troubleshooting
nav_order: 10
description: "NetLicensing Gateway is an open-source component, being used to maintain eCommerce integrations with NetLicensing core services"
permalink: faq-3pp-subscription-management
---

{{ page.title }}
=============

## Question

I'm using PayPal Subscriptions to sell my product.
How NetLicensing can improve my current license acquisition flow?

## Answer

*PayPal Subscriptions*, as well as other **Subscription Management Services** (*Paddle, Billwerk, Chargebee, Authorize.Net, 2checkout, Recurly, ...*) and **eCommerce platforms** (*WooCommerce, PrestaShop, Shopify, ...*) are great tools to sell your digital products and services.
These services offer a perfect customer eCommerce experience and cover standard shopping processes:
- shopping cart
- checkout
- payment methods
- billing & invoicing
- recurring payments

So, you can easily set up your products and sell them online.

### Extended licensing flow with NetLicensing

The **license enforcement**, however, and instant verification of customers' entitlements usually needs to be implemented on your side. This is especially true for more complex scenarios than simple recurring subscriptions, e.g.:

- customer acquired two "1-month" subscription licenses
- the trial period needs to be extended for your "best" leads or prospects
- additionally to the service subscription, a vendor using metered models, such as [Floating](floating), [Pay-per-Use](pay-per-use)
- service [usage quota](quota) or additional [up-sell features](multi-feature) need to be assigned to the customer
- ... and the list of the different licensing strategies can go on

>All these above concerns can be perfectly covered using NetLicensing services in addition to the standard license acquisition and renewal flow.

### Digital fulfilment

In most of the eCommerce systems, a **"digital fulfilment"** step can be configured using custom webhook/IPN endpoint. NetLicensing can be hocked at that step and will be instantly notified on all or selected events in the eCommerce platforms.

Available events and their names differ from one system to another, however, notable events and corresponding NetLicensing action summarized below:

| Webhook event          | NetLicensing action                         |
|------------------------|---------------------------------------------|
| Customer created       | Create a new customer                       |
| Subscription created   | Create and assign a license to the customer |
| Subscription renewed   | Create and assign an additional license to the customer |
| Subscription cancelled | Deactivate customer's license               |
| Subscription updated   | Update customer's license                   |
| Invoice Overdue        | Deactivate customer's license               |

### Digital fulfilment process with NetLicensing Gateway

[NetLicensing Gateway](https://github.com/Labs64/NetLicensing-Gateway){:target="_blank"}{:rel="noopener nofollow"} is an open-source component, which is being used to maintain eCommerce integrations with NetLicensing core services.

<a href="https://netlicensing.io/img/usage-scenarios/netlicensing-integration-ecommerce.png" class="imagelink" data-lightbox="faq-3pp-subscription-management" data-title="Digital fulfilment process with NetLicensing Gateway" data-alt="Digital fulfilment process with NetLicensing Gateway">
  <img src="https://netlicensing.io/img/usage-scenarios/netlicensing-integration-ecommerce.png" />
</a>

One central instance of the NetLicensing Gateway is hosted and maintained on NetLicensing infrastructure. You can deploy your local instance on your own infrastructure, however.

### Contribution

Being an open-source project, NetLicensing Gateway is maintained by our awesome community.
New integrations can be implemented and approved after verification by NetLicensing team via GitHub Pull Request.
