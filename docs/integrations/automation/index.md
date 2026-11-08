---
layout: default
title: Automation and Alerts
parent: Integrations
nav_order: 5
has_children: true
has_toc: false
description: "Connect NetLicensing to other apps without code: Zapier, n8n and Azure Logic Apps react to licensing events and manage licenses; Slack posts alerts."
permalink: automation-platforms
last_modified_at: 2026-11-08
---

{{ page.title }}
================

Automation platforms connect apps without code, and NetLicensing works with them in both directions: a licensing event can start a
workflow, and a workflow can create or deactivate licenses. For simple alerts you need no platform at all: a NetLicensing
notification can post straight to [Slack](slack).

| Direction | How it works | NetLicensing building block |
|-----------|--------------|-----------------------------|
| **React to NetLicensing** | The platform gives you a webhook URL. NetLicensing posts an event to it when a customer or license is created, a shop payment is processed, or a warning level changes. | [Notifications](notifications) (type `WEBHOOK`, HTTPS endpoint, event JSON you can shape) |
| **Act in NetLicensing** | A step in the workflow creates a customer, issues a license or deactivates it. | The [REST API](restful-api), through a ready-made app where one exists, or through the platform's generic HTTP step |

## Tools

| Tool | NetLicensing app or node | Generic webhook and HTTP steps |
|----------|--------------------------|--------------------------------|
| [Zapier](zapier) | App with triggers and actions for licensees and products | *Webhooks by Zapier*: *Catch Hook* and *Custom Request* |
| [n8n](n8n) | None; no dedicated node | *Webhook* and *HTTP Request* nodes |
| [Azure Logic Apps](azure-logic-apps) | None | *Request* trigger and *HTTP* action |
| [Slack](slack) | None needed | A NetLicensing notification posts to a Slack incoming webhook; alerts only |

Other tools that can receive a webhook and send an HTTP request work the same way: use the pattern on the
[Billing and Commerce Platforms](billing-platforms#how-it-works) page with the tool as the receiver.

## What an automation can do with NetLicensing

| Goal | NetLicensing call |
|------|-------------------|
| Create a customer when someone signs up in another system | [Create a licensee](licensee-services#create-licensee) |
| Issue a license when a payment succeeds | [Create a license](license-services#create-license) |
| Revoke access when a subscription is cancelled | [Update the license](license-services#update-license) with `active=false` |
| Tell your team or the customer when a license is created or a warning level changes | A [notification](notifications) to the automation platform |
| Update a CRM when a new customer or license appears | A [notification](notifications) on `LICENSEE_CREATED` or `LICENSE_CREATED` |

Use an [API key](security#api-key-identification) rather than your account password, with the lowest role that allows the call:
`ROLE_APIKEY_OPERATION` for customers and licenses, `ROLE_APIKEY_MAINTENANCE` if the workflow must also change products.
