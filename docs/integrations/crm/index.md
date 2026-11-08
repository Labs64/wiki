---
layout: default
title: CRM and Sales
parent: Integrations
nav_order: 4
has_children: true
has_toc: false
description: "Connect NetLicensing to your CRM: see a customer's licenses inside Zoho CRM, or let Pipedrive create customers and licenses when a deal is won."
permalink: crm-and-sales
last_modified_at: 2026-11-08
---

{{ page.title }}
================

A CRM and NetLicensing can work together in both directions: the CRM can show what a customer has licensed, and a sale in the CRM can create the customer and licenses.

| CRM | Direction | What it does | Type |
|-----|-----------|--------------|------|
| [Zoho CRM](zoho-crm) | NetLicensing to CRM | Extension from Zoho Marketplace that shows a customer's licenses in the CRM account | Ready-made |
| [Pipedrive](pipedrive) | CRM to NetLicensing | Pipedrive webhooks create customers and licenses when a deal is won | Guide |

## Other CRMs

Any CRM that can send a webhook, or call a URL from a workflow, can create customers and licenses through the NetLicensing [REST API](restful-api): follow the [generic pattern](billing-platforms#how-it-works) and the [event mapping](billing-platforms#event-mapping). To update a CRM when something happens in NetLicensing, use [webhook notifications](notifications) on `LICENSEE_CREATED`, `LICENSE_CREATED`, `PAYMENT_TRANSACTION_PROCESSED` or `WARNING_LEVEL_CHANGED`, or an [automation platform](automation-platforms) in between. Contact us at [info@netlicensing.io](mailto:info@netlicensing.io) if you need help with a specific CRM.
