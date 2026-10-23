---
layout: default
title: Home
nav_order: 1
description: "Here you will find resources that will help you learn about NetLicensing"
permalink: /
sitemap:
  changefreq: daily
  priority: 0.7
---

Welcome to the NetLicensing Wiki
================================

Here you will find resources that will help you learn about NetLicensing, including the current specification, documentation, implementation status, as well as a repository of demos and resources that take advantage of NetLicensing.

Please help us improve this wiki and keep it up-to-date, by leaving your comments and suggestions on the comments section of any page of this wiki.

## What's new

{% for change in site.data.changelog limit:3 -%}
- **{{ change.title }}** <small>({{ change.date | date: '%b %-d, %Y' }})</small><br>{{ change.description | strip_html | truncate: 150 }}
{% endfor %}
[See the full changelog](changelog)

## Get started

Pick the path that matches what you want to do. The navigation tree on the left (desktop) covers everything else.

**I'm a developer integrating NetLicensing**
- [NetLicensing Overview](overview) and the [Object Model](object-model)
- [Client Libraries](client-libraries) for Java, .NET, PHP, C++ and more
- [RESTful API](restful-api) reference and [Licensing Models](licensing-models)
- [MCP Server](netlicensing-mcp) to manage licenses from your AI assistant

**I sell software and manage licenses**
- [Licensing Models](licensing-models): pick the right one for your product
- [NetLicensing Shop](netlicensing-shop) and the [Customer Portal](customer-portal)
- [Integrations](integrations) with payment and CRM providers
- [Notifications](notifications) and [Warning Level](warning-level) for staying on top of customers

**I'm stuck or need help**
- [FAQ & Troubleshooting](faq)
- [Glossary](glossary)
- [Changelog](changelog)
- [Community Support](https://github.com/Labs64/NetLicensing-Community){:rel="noopener nofollow"}&nbsp;[![GitHub issues open](https://img.shields.io/github/issues/Labs64/NetLicensing-Community.svg)](https://github.com/Labs64/NetLicensing-Community/issues){:rel="noopener nofollow"}
