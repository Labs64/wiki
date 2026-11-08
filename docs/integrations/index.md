---
layout: default
title: Integrations
has_children: true
has_toc: false
nav_order: 97
description: "Connect NetLicensing to billing platforms, cloud marketplaces, CRMs, identity providers, automation tools and AI agents: ready-made and tested guides."
permalink: integrations
last_modified_at: 2026-11-08
---

{{ page.title }}
================

NetLicensing works with the systems you already use. It connects to a wide range of billing and commerce platforms, cloud
marketplaces, CRMs, identity providers and automation tools, either through a ready-made integration or through a guide that maps
the other system's webhooks to the NetLicensing [REST API](restful-api). Everything uses open standards (HTTPS, JSON and an
[OpenAPI](faq-openapi-specification) specification), so a system that is not listed here can usually be connected the same way.

Integrations work in three directions:

```text
  Shop, billing platform,              +--------------+               CRM, Slack, Zapier,
  cloud marketplace         --SELL-->  | NetLicensing |  --NOTIFY-->  n8n, Logic Apps
  (webhook -> your receiver)           +--------------+               (webhook notifications)
                                            ^
                                            | BUILD:
                                              REST API, client libraries, MCP, your product,
                                              back office, identity provider, AI agent
```

| Direction | What happens | Building blocks |
|-----------|--------------|-----------------|
| **Sell** | A purchase, renewal, refund or cancellation in your shop, billing system or marketplace creates, extends or deactivates licenses | [NetLicensing Shop](netlicensing-shop), [billing platforms](billing-platforms), [cloud marketplaces](cloud-marketplaces) |
| **Notify** | A new customer, a new license, a payment or a warning level change in NetLicensing reaches your other systems | [Webhook notifications](notifications), [CRM and sales](crm-and-sales), [automation and alerts](automation-platforms) |
| **Build** | Your product, back office, identity provider or AI agent asks NetLicensing directly | [REST API](restful-api), [client libraries](client-libraries), [identity providers](identity-providers), [MCP server](netlicensing-mcp) |

## Where do I start?

| You have | Start here |
|----------|------------|
| No shop yet | [NetLicensing Shop](netlicensing-shop) with [PayPal](paypal) or [Stripe](stripe); no code needed |
| A subscription billing system, such as Stripe Billing, Chargebee, Recurly, Maxio or Zuora | Your platform's guide under [Billing and Commerce Platforms](billing-platforms#platforms) |
| A checkout for software or digital products, such as Paddle, FastSpring, Lemon Squeezy, 2Checkout, Cleverbridge or Gumroad | Your platform's guide under [Billing and Commerce Platforms](billing-platforms#platforms) |
| Usage-based billing with Orb, Lago or Metronome | The [usage-based billing](billing-platforms#grant-time) pattern and your platform's guide |
| An online store on Shopify, WooCommerce or Shopware | Your store's guide under [Billing and Commerce Platforms](billing-platforms#platforms) |
| A listing on AWS Marketplace, Microsoft Marketplace or Google Cloud Marketplace | [Cloud Marketplaces](cloud-marketplaces) |
| Billing in your own system | [Create licenses from your back end](faq-create-license-programmatically) |
| Zapier, n8n or Azure Logic Apps | [Automation and Alerts](automation-platforms) |
| A team that wants Slack alerts for new customers, licenses and payments | [Slack](slack); no code needed |
| Zoho CRM or Pipedrive | [CRM and Sales](crm-and-sales) |
| Okta or Microsoft Entra ID, and you want entitlements in the sign-in token | [Identity Providers](identity-providers) |
| An AI assistant such as Claude or Copilot | The [MCP server](netlicensing-mcp) |

## All integrations

| Type | What it means |
|------|---------------|
| Ready-made | Works without code on your side |
| Guide | You run a small receiver or workflow that follows the guide; every guide has example calls for both sides |

### Selling and billing

| Integration | Type | Notes |
|-------------|------|-------|
| [PayPal](paypal) | Ready-made | Payment method in NetLicensing Shop, including recurring payments |
| [Stripe](stripe) | Ready-made | Payment method in NetLicensing Shop |
| [Subscription billing](billing-platforms#subscription-billing) | Guide | [Stripe Billing](stripe-billing), [Chargebee](chargebee), [Recurly](recurly), [Maxio](maxio), [Zuora](zuora), [Frisbii](frisbii), [ChargeOver](chargeover), [Braintree](braintree), [PayPal Subscriptions](paypal-subscriptions), [Authorize.Net](authorize-net), [Mollie](mollie), [BlueSnap](bluesnap) |
| [Software and digital product checkouts](billing-platforms#software-and-digital-product-checkouts) | Guide | [Paddle](paddle), [FastSpring](fastspring-licensing), [Lemon Squeezy](lemon-squeezy), [2Checkout](2checkout), [Cleverbridge](cleverbridge), [PayPro Global](payproglobal), [Gumroad](gumroad), [SendOwl](sendowl), [PayKickstart](paykickstart) |
| [Usage-based billing](billing-platforms#usage-based-billing) | Guide | [Orb](orb), [Lago](lago), [Metronome](metronome) |
| [Online stores](billing-platforms#online-stores) | Guide | [Shopify](shopify), [WooCommerce](woocommerce), [Shopware 6](shopware) |

### Cloud marketplaces

| Integration | Type | Notes |
|-------------|------|-------|
| [AWS Marketplace](aws-marketplace) | Guide | SNS or EventBridge notifications create and revoke licenses |
| [Microsoft commercial marketplace](azure-marketplace) | Guide | Connection webhook for subscribe, plan change, renew, suspend and unsubscribe |
| [Google Cloud Marketplace](google-cloud-marketplace) | Guide | Pub/Sub entitlement events and the Partner Procurement API |

### CRM and sales

| Integration | Type | Notes |
|-------------|------|-------|
| [Zoho CRM](zoho-crm) | Ready-made | Extension in Zoho Marketplace; shows a customer's licenses in the CRM account |
| [Pipedrive](pipedrive) | Guide | A won deal creates the customer and the license |

### Automation and alerts

| Integration | Type | Notes |
|-------------|------|-------|
| [Webhook notifications](notifications) | Ready-made | Events: customer created, license created, payment transaction processed, warning level changed |
| [Zapier](zapier) | Ready-made | NetLicensing app for customers and products; licenses and events through Webhooks by Zapier |
| [n8n](n8n) | Guide | Webhook and HTTP Request nodes |
| [Azure Logic Apps](azure-logic-apps) | Guide | Request trigger and HTTP action |
| [Slack](slack) | Ready-made | A notification posts to a Slack channel; no code needed |

### Identity providers

| Integration | Type | Notes |
|-------------|------|-------|
| [Okta](okta) | Guide | A token inline hook adds a NetLicensing validation claim to the token |
| [Microsoft Entra ID](entra-id) | Guide | A custom claims provider adds a NetLicensing validation claim to the token |

### Developers and AI agents

| Integration | Type | Notes |
|-------------|------|-------|
| [REST API](restful-api) | Ready-made | OpenAPI 3.1 specification and a live [API Test Center](https://netlicensing.io/NetLicensing-API/){:target="_blank"}{:rel="noopener"} |
| [Client libraries](client-libraries) | Ready-made | Java, C#/.NET, PHP, JavaScript/Node.js, Kotlin, C++; other languages through the REST API |
| [MCP server](netlicensing-mcp) | Ready-made | Lets AI agents manage products, customers and licenses |

## Your system is not listed?

If it can call a URL when something happens, or if you can call NetLicensing from it - **it can be integrated**.
Follow the [generic pattern](billing-platforms#how-it-works), try the calls in the
[API Test Center](https://netlicensing.io/NetLicensing-API/){:target="_blank"}{:rel="noopener"}, or write to
[info@netlicensing.io](mailto:info@netlicensing.io) and we will help you find the best way to connect it.
