---
layout: default
title: Cloud Marketplaces
parent: Integrations
nav_order: 2
has_children: true
has_toc: false
description: "Sell software on AWS Marketplace, the Microsoft commercial marketplace or Google Cloud Marketplace and let subscription events create and revoke licenses."
permalink: cloud-marketplaces
last_modified_at: 2026-11-08
---

{{ page.title }}
================

When a buyer purchases your product through a cloud marketplace, the marketplace tells your system about the subscription. A receiver in your own cloud account turns these notifications into NetLicensing licenses, using the [REST API](restful-api) and the same [event mapping](billing-platforms#event-mapping) as for billing platforms. A marketplace subscription is usually not a fixed paid period, so the license [follows the subscription](billing-platforms#grant-time): create it when the subscription starts and deactivate it when the subscription ends. The marketplace's customer or subscription id becomes the [licensee number](billing-platforms#platform-ids).

```text
Buyer --> Marketplace --> notification --> Your service --> NetLicensing
          (AWS, Microsoft,  (SNS/EventBridge,   (resolve buyer,   (licensee,
           Google)          webhook, Pub/Sub)    approve, map)     license)
```

| Marketplace | How it notifies you | Guide |
|-------------|---------------------|-------|
| AWS Marketplace | SNS topics (sellers registered on or before July 15, 2026) or EventBridge events; `ResolveCustomer` for the buyer | [AWS Marketplace](aws-marketplace) |
| Microsoft commercial marketplace | Connection webhook with a Microsoft Entra JWT: `Subscribe`, `ChangePlan`, `ChangeQuantity`, `Renew`, `Suspend`, `Unsubscribe`, `Reinstate` | [Microsoft Marketplace](azure-marketplace) |
| Google Cloud Marketplace | Pub/Sub events for accounts and entitlements, answered through the Partner Procurement API | [Google Cloud Marketplace](google-cloud-marketplace) |

Each marketplace requires you to be a registered seller with a listing; the guides state what we found in each marketplace's documentation. The marketplaces differ in how much they verify: AWS and Google deliver through services in your own cloud account, while Microsoft calls a public webhook that you must authenticate with the Entra token.
