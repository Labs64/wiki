---
layout: default
title: Pricing Table
parent: Licensing Models
nav_order: 20
description: "Pricing plans for your products and services can be effectively modelled using Pricing Table licensing model"
permalink: pricing-table
---

{{ page.title }}
============

Overview
--------

Pricing plans for your products and services can be effectively modelled using **Pricing Table** licensing model, so you will be able to easily manage plans and features, bill your customers and keep track of customers membership plans and even enable/disable individual features per customer.

Each plan is have associated with it information such as the plan's name, number, pricing, billing interval, features set, etc.

Each plan can be additionally configured to support *"free trial"* and *"freemium"* business models, as well a hidden option to create context-specific packages.

### Examples

You could be offering three different plans in your SaaS service: *"free"*, *"basic"*, *"premium"*. While some users would intend to use the service for personal use, others may be business users. Hence, you could create say, a *free plan* that provides basic features and a higher-priced basic or *premium plans* for advanced features.
Your customers would be signed-up for plans by way of subscriptions or a one-time payment.

HTML Export
-----------

*TODO*

### CSS definitions

*TODO*

Validation
----------

### Validation parameters:

On validation, this licensing model requires no parameters.

### Validation returns values:

-   `Boolean` **`valid`** - **`true`** if use is allowed

### Validation response examples:

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee/CUST-01/validate
Accept: application/xml
```
{: .ml-5 }
<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml

```
{: .ml-5 }
