---
layout: default
title: Pricing Table
parent: Licensing Models
nav_order: 5
description: "Pricing plans for your products and services can be effectively modelled using Pricing Table licensing model"
permalink: pricing-table
---

{{ page.title }}
================

-   [Overview](#overview)
    -   [Usage Examples](#usage-examples)
-   [Configuration](#configuration)
    -   [Create Module](#create-module)
    -   [Add Plan](#add-plan)
    -   [Add SKU](#add-sku)
-   [Integration](#integration)
    -   [HTML Export](#html-export)
    -   [CSS Definitions](#css-definitions)
-   [Validation](#validation)
 
## Overview

Pricing plans for your products and services can be effectively modelled using **Pricing Table** licensing model, so you will be able to easily manage plans and features, manage your customers and keep track of customers membership plans and even enable/disable individual features per customer.

Each plan have associated with it information such as the plan's name, number, pricing, billing interval, features set, etc.

Each plan can be additionally configured to support *"free trial"* and *"freemium"* business models, as well a hidden option to create context-specific packages.

### Usage Examples

You could be offering three different plans in your SaaS service: *"free"*, *"basic"*, *"premium"*. While some users would intend to use the service for personal use, others may be business users. Hence, you could create say, a *free plan* that provides basic features and a higher-priced basic or *premium plans* for advanced features.
Your customers would be signed-up for plans by way of subscriptions or a one-time payment.

## Configuration

### Create Module

<a href="assets/images/pricing-table-create.png" class="imagelink" data-lightbox="pricing-table" data-title="Pricing Table: create" data-alt="Pricing Table: create">
  <img src="assets/images/pricing-table-create.png" />
</a>
    
### Add Plan

Creating a new Plan is quite simple. All you need to do is:

- Log into NetLicensing Management Console
- Choose or create a product module
- In the Module configuration click on *"Add Plan"* button

<a href="assets/images/pricing-table-plan.png" class="imagelink" data-lightbox="pricing-table" data-title="Pricing Table: add Plan" data-alt="Pricing Table: add Plan">
  <img src="assets/images/pricing-table-plan.png" />
</a>

Fill out the new Plan details and you're all set.

#### Plan Attributes

- **Name** - descriptive plan name; this name will be shown to the customer
- **Number** - plan number is the unique identifier of the Plan and is used to refer to the plan on the NetLicensing RESTful API and in your products
- **Description** - a short plan description for the customer
- **Price** - the price of the plan
- **Billing Frequency** - billing period or billing interval determines the frequency your customer will be billed for the plan; you can choose one of the following: *One-Time* or *Recurring* (e.g. day, week, month, year)
- **Action Title** - Call to action button title to acquire a plan
- **Action URL** - Shop URL (NetLiensing Shop or an external eCommerce system) to be used for plan acquisition

#### Plan Flags and Actions

- **Auto-assignment** - if enabled, plan will be assigned automatically; use this for default or free plan options
- **Hidden** - if enabled, plan will not be offered to the customer
- **Delete** - delete current plan
- **Enable** - switch the plan on or off

### Add SKU

Store Keeping Unit or SKU represents the feature in your product.

<a href="assets/images/pricing-table-sku.png" class="imagelink" data-lightbox="pricing-table" data-title="Pricing Table: add SKU" data-alt="Pricing Table: add SKU">
  <img src="assets/images/pricing-table-sku.png" />
</a>

#### SKU Attributes

- **Name** - descriptive SKU name; this name will be shown to the customer
- **Number** - number is the unique identifier of the SKU and is used to refer to the plan features on the NetLicensing RESTful API and in your products
- **Type** - SKU type defines the basic behaviour. You can choose one of the following: *Quantity* or *Feature*

## Integration

### HTML Export

There are two ways to how you can export Pricing Table HTML structure to embed this on your website:

1) Click *Copy Code* button to export plain HTML for the current Pricing Table

2) Use RESTful API to automate export

#### Request parameters

-   **`productModuleNumber=<number>`** product module number for Pricing Table licensing model to be exported.

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/licensingmodel/PricingTable/render?productModuleNumber=M9SAHGYZJ
Accept: text/html
```
{: .ml-5 }
<div>Response</div>
{: .code-example .ml-5 .code-header }
```html
<div class="nlic-pricing-table">
... Pricing Table HTML structure ...
</div>
```
{: .ml-5 }

### CSS Definitions

Please refer to the CSS class definitions below, which will help you to style exported Pricing Table HTML structure accordingly to your brand and corporate identity.

| Class | Description |
|:-------|:-----------|
| nlic-pricing-table | Main Pricing Table container |
| nlic-column | Table column container |
| nlic-column-skus | Column containing SKUs / features |
| nlic-column-{plan_number} | Column containing plan definition |
| nlic-plan-column | Plan column block |
| nlic-column-head | Column header |
| nlic-plan-name | Plan name block |
| nlic-plan-description | Plan description block |
| nlic-plan-price | Column price |
| nlic-price-empty | Column empty price |
| nlic-sku-list | `<ul>` SKUs list |
| nlic-sku-item | `<li>` SKUs item |
| nlic-sku-feature | `<li>` SKUs feature type |
| nlic-sku-quota | `<li>` SKUs quota type |
| nlic-sku-{sku_name} | `<li>` SKUs with feature number |
| nlic-sku-description | SKU description |
| nlic-sku-quota-item | Plan value for SKU type quota |
| nlic-sku-feature-item | Plan value for SKU type feature |
| nlic-sku-feature-value-enabled | Plan value enabled |
| nlic-sku-feature-value-disabled | Plan value disabled |
| nlic-action | Action button |
| nlic-action-{plan_number} | Action button with plan number |
| nlic-action-url | Action button href |
| nlic-attribution | NetLicensing attribution block (if present) |

## Validation

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
