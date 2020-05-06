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

Class description for Pricing Table *render()* call (with "Accept: text/html").

| Class | Description |
|:-------|:-----------|
| nlic-attribution | Attribution block (if present) |
| nlic-pricing-table | Main container |
| nlic-column | Each column |
| nlic-column-{plan_number} | Plan number column |
| nlic-column-head | Column head |
| nlic-plan-column | Plan column |
| nlic-plan-name | Column name |
| nlic-plan-description | Column description |
| nlic-price | Column price |
| nlic-price-empty | Price is empty |
| nlic-sku-item-list | <ul> SKUs list |
| nlic-sku-item | <li> SKUs |
| nlic-sku-{sku_name} | <li> SKUs with SKU number |
| nlic-sku-feature | <li> SKUs feature plan |
| nlic-sku-quota | <li> SKUs quota plan |
| nlic-feature | Plan SKU feature container |
| nlic-feature-not-exist | Plan SKU feature not exist container |
| nlic-quota | Plan SKU quota container |
| nlic-action | Action button |
| nlic-action-{plan_number} | Action button with plan number |
| nlic-action-url | Action button href |

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
 <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context" ttl="2020-05-06T07:01:06.970Z">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="ProductModuleValidation">
      <ns2:property name="productModuleNumber">SAAS-SUBSCRIPTION-PLANS</ns2:property>
      <ns2:property name="valid">true</ns2:property>
      <ns2:property name="pricingPlanId">PREMIUM-PLAN</ns2:property>
      <ns2:property name="pricingPlanName">Premium</ns2:property>
      <ns2:property name="productModuleName">Module using "Pricing Table" licensing model</ns2:property>
      <ns2:property name="activePricingPlans">PREMIUM-PLAN</ns2:property>
      <ns2:property name="pricingPlanType">FEATURE</ns2:property>
      <ns2:property name="licensingModel">PricingTable</ns2:property>
      <ns2:list name="FEATURE01">
        <ns2:property name="valid">true</ns2:property>
        <ns2:property name="quota">10</ns2:property>
        <ns2:property name="name">Feature 1 (quota)</ns2:property>
        <ns2:property name="type">QUOTA</ns2:property>
      </ns2:list>
      <ns2:list name="FEATURE03">
        <ns2:property name="valid">false</ns2:property>
        <ns2:property name="name">Feature 3 (on/off)</ns2:property>
        <ns2:property name="type">FEATURE</ns2:property>
      </ns2:list>
      <ns2:list name="FEATURE02">
        <ns2:property name="valid">false</ns2:property>
        <ns2:property name="name">Feature 2 (on/off)</ns2:property>
        <ns2:property name="type">FEATURE</ns2:property>
      </ns2:list>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }
