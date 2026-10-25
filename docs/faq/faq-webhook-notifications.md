---
layout: post
title: "How do I get notified when a customer or license is created?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Configure webhook notifications for new customers, new licenses, processed shop payments and warning level changes."
permalink: faq-webhook-notifications
faq_category: Licenses and customers
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

I want my CRM to update automatically when someone buys a license. Is there a webhook?

## Answer

Yes. In the Management Console, go to *Settings / Notifications* and create a [notification](notifications) of type
`WEBHOOK` with an HTTPS endpoint. Then pick the events you care about:

| Event | When it fires |
|-------|---------------|
| `LICENSEE_CREATED` | A new customer was created |
| `LICENSE_CREATED` | A new license was created |
| `PAYMENT_TRANSACTION_PROCESSED` | A NetLicensing Shop transaction changed status |
| `WARNING_LEVEL_CHANGED` | A customer's [warning level](warning-level) changed, for example from GREEN to YELLOW |

NetLicensing sends an HTTP POST with a JSON payload that you can shape yourself. The endpoint has to use HTTPS with a
public certificate. For popular CRM and automation tools there are ready-made [integrations](integrations), including
[Zoho CRM](zoho-crm) and Zapier.
