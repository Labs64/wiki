---
layout: default
title: Home
nav_order: 1
description: "NetLicensing documentation: licensing models, REST API, client libraries, integration guides, offline validation, Shop, Customer Portal, Agent and MCP server for software vendors."
permalink: /
last_modified_at: 2026-10-25
sitemap:
  changefreq: daily
  priority: 0.7
---

Welcome to the NetLicensing Wiki
================================

This is the documentation for Labs64 NetLicensing, a cloud service for managing software licenses. Software vendors use
it to set up trials, subscriptions, floating, node-locked and usage-based licenses, check what their customers are
entitled to through a REST API, and sell and renew licenses in a white-label shop. No license server of their own
required.

## What's new

{% for change in site.data.changelog limit:3 -%}
- **{{ change.title }}** <small>({{ change.date | date: '%b %-d, %Y' }})</small><br>{{ change.description | strip_html | truncate: 150 }}
{% endfor %}
[See the full changelog](changelog)

## Get started

Pick the path that matches what you want to do. The navigation tree on the left (desktop) covers everything else.

**I'm a developer integrating NetLicensing**
- [Getting Started](getting-started), the [NetLicensing Overview](overview) and the [Object Model](object-model)
- Quick starts for [Java](java-software-licensing), [C# / .NET](dotnet-software-licensing), [PHP](php-software-licensing), [JavaScript / Node.js](javascript-software-licensing) and [Python](python-software-licensing); all [Client Libraries](client-libraries)
- [Software Licensing API](software-licensing-api) architecture, the [REST API reference](restful-api) and [Licensing Models](licensing-models)
- [Offline License Validation](offline-license-validation) and the [License Lifecycle](license-lifecycle)
- [MCP Server](netlicensing-mcp) to manage licenses from your AI assistant

**I'm evaluating licensing options**
- [Build vs Buy: Your Own Licensing Service](build-vs-buy-software-licensing)
- [Software Licensing Models Compared](software-licensing-models-compared)
- [Node-Locked vs Floating Licenses](node-locked-vs-floating-licenses) and [Subscription vs Perpetual Licensing](subscription-vs-perpetual-licensing)
- [Usage-Based Licensing](usage-based-licensing) and [Licensing a SaaS Application](saas-licensing)

**I sell software and manage licenses**
- [Licensing Models](licensing-models): pick the right one for your product
- [NetLicensing Shop](netlicensing-shop) and the [Customer Portal](customer-portal)
- [Integrations](integrations) with payment and CRM providers
- [Notifications](notifications) and [Warning Level](warning-level) for staying on top of customers

**Popular questions**
- [How does license validation work?](faq-how-license-validation-works)
- [How often should my application validate?](faq-validation-frequency)
- [Can I validate licenses offline?](faq-offline-validation-file)
- [How do I offer a free trial?](faq-free-trial)
- [How do I limit devices or concurrent users?](faq-limit-devices-per-license)
- [Is it safe to put an API key in my application?](faq-api-key-in-client-application)
- [Why does validation return valid=false?](faq-why-validation-invalid)

**I'm stuck or need help**
- [FAQ & Troubleshooting](faq)
- [Glossary](glossary)
- [Changelog](changelog)
- [Community Support](https://github.com/Labs64/NetLicensing-Community){:rel="noopener"} [![GitHub issues open](https://img.shields.io/github/issues/Labs64/NetLicensing-Community.svg)](https://github.com/Labs64/NetLicensing-Community/issues){:rel="noopener"}
