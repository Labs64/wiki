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
-   [Data Structure and Schema](#data-structure-and-schema)
    -   [SKU Definition](#sku-definition-skudef)
    -   [Plan SKU Values](#plan-sku-values-skus)
    -   [Complete Example](#complete-example)
-   [Building a Pricing Table via API](#building-a-pricing-table-via-api)
    -   [Create Module](#create-module-1)
    -   [Create Pricing Plans](#create-pricing-plans)
-   [Publish](#publish)
    -   [HTML Export](#html-export)
    -   [CSS Definitions](#css-definitions)
-   [Integration](#integration)
    -   [Validation](#validation)

## Overview

Pricing plans for your products and services can be effectively modelled using **Pricing Table** licensing model. By using this licensing model, you will be able to easily manage plans and features, manage your customers and also keep track of their membership plans with the possibility to enable/disable individual features per customer.

Each plan has its unique information associated with it, such as the plan’s name, number, pricing, billing interval, features set, and many more. 

Each plan can be additionally configured to support *"free trial"* and *"freemium"* business models, as well a hidden option to create context-specific packages.

### Usage Examples

You could be offering three different plans in your SaaS service: *"free"*, *"basic"*, *"premium"*. While some users would intend to use the service for personal use, others may be business users. Hence, you could create say, a *free plan* that provides basic features and a higher-priced basic or *premium plans* for advanced features.
Your customers would be signed-up for plans by way of subscriptions or a one-time payment.

## Configuration

### Create Module

Create a new product module and choose Model "Pricing Table".

<a href="assets/images/pricing-table-create.png" class="imagelink" data-lightbox="pricing-table" data-title="Create Pricing Table" data-alt="Create Pricing Table">
  <img src="assets/images/pricing-table-create.png" />
</a>
    
### Add Plan

Creating a new Plan is quite simple. All you need to do is:

- Log into NetLicensing Management Console
- Choose or create a product module
- In the Module configuration click on *"Add Plan"* button

<a href="assets/images/pricing-table-plan.png" class="imagelink" data-lightbox="pricing-table" data-title="Pricing Table: Add Plan" data-alt="Pricing Table: Add Plan">
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

<a href="assets/images/pricing-table-sku.png" class="imagelink" data-lightbox="pricing-table" data-title="Pricing Table: Add SKU" data-alt="Pricing Table: Add SKU">
  <img src="assets/images/pricing-table-sku.png" />
</a>

#### SKU Attributes

- **Name** - descriptive SKU name; this name will be shown to the customer
- **Number** - number is the unique identifier of the SKU and is used to refer to the plan features on the NetLicensing RESTful API and in your products
- **Type** - SKU type defines the basic behaviour. You can choose one of the following: *Quantity* or *Feature*

## Data Structure and Schema

### SKU Definition (`skudef`)

The `skudef` property on a Product Module defines the **catalog of available SKUs** (features and quotas) that can be used across all pricing plans. It is a JSON object containing a single key with an array of SKU definitions:

```json
{
  "skudef": [
    {
      "number": "<SKU_ID>",
      "name": "<Display Name>",
      "type": "<FEATURE|QUOTA>"
    }
  ]
}
```

#### SKU Definition Fields

| Field | Type | Description |
|---|---|---|
| `number` | string | Unique SKU identifier — this is the **key** referenced in each template's `skus` map |
| `name` | string | Human-readable label shown to customers |
| `type` | enum: `FEATURE` \| `QUOTA` | Determines what kind of value this SKU holds in a template |

#### SKU Type Behavior

Note: In the Management Console UI these types are shown as **Feature** (`FEATURE`) and **Quantity** (`QUOTA`).

- **`FEATURE`** — A boolean flag indicating whether the plan includes this feature (e.g., "API Access", "Advanced Analytics")
- **`QUOTA`** — A numeric limit for the feature (e.g., "API Requests", "Storage in GB")

### Plan SKU Values (`skus`)

Each License Template (pricing plan) has a `skus` property that maps SKU numbers to their respective values for that plan. The value type depends on the matching `type` from `skudef`:

```json
{
  "skus": {
    "<SKU_number_1>": <value>,
    "<SKU_number_2>": <value>
  }
}
```

#### SKU Value Types

| skudef `type` | skus value | Meaning | Examples |
|---|---|---|---|
| `FEATURE` | `true` / `false` (or string `"true"` / `"false"`) | Whether the plan includes the feature | `true` = included, `false` = not included |
| `QUOTA` | numeric string | The quantity limit for the plan | `"-1"` = unlimited, `"0"` = none, `"100"` = max 100 units |

#### Schema Relationship

```
skudef[i].number  ──(key)──>  skus["<number>"]
skudef[i].type     ──(governs)──>  type of value in skus["<number>"]
```

### Complete Example

Given this module-level SKU definition:

```json
{
  "skudef": [
    {"number": "APIREQUESTS", "name": "API Requests", "type": "QUOTA"},
    {"number": "USERS", "name": "Team Members", "type": "QUOTA"},
    {"number": "CONSOLE_ACCESS", "name": "Admin Console", "type": "FEATURE"},
    {"number": "API_ACCESS", "name": "API Access", "type": "FEATURE"}
  ]
}
```

A plan might define its SKU values as:

```json
{
  "skus": {
    "APIREQUESTS": "10",
    "USERS": "1",
    "CONSOLE_ACCESS": true,
    "API_ACCESS": false
  }
}
```

This means the plan includes:
- 10 API requests per month
- 1 team member
- Admin Console access enabled
- API access disabled

## Building a Pricing Table via API

### Create Module

Create a new product module with the Pricing Table licensing model using the REST API:

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/productmodule
Accept: application/xml
Content-Type: application/x-www-form-urlencoded

productNumber=PROD-001&number=M-PRICING-001&name=SaaS%20Pricing%20Plans&licensingModel=PricingTable&skudef=%7B%22skudef%22%3A%5B%7B%22number%22%3A%22APIREQUESTS%22%2C%22name%22%3A%22API%20Requests%22%2C%22type%22%3A%22QUOTA%22%7D%2C%7B%22number%22%3A%22USERS%22%2C%22name%22%3A%22Team%20Members%22%2C%22type%22%3A%22QUOTA%22%7D%2C%7B%22number%22%3A%22CONSOLE_ACCESS%22%2C%22name%22%3A%22Admin%20Console%22%2C%22type%22%3A%22FEATURE%22%7D%2C%7B%22number%22%3A%22API_ACCESS%22%2C%22name%22%3A%22API%20Access%22%2C%22type%22%3A%22FEATURE%22%7D%5D%7D
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="ProductModule">
      <ns2:property name="number">M-PRICING-001</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="name">SaaS Pricing Plans</ns2:property>
      <ns2:property name="productNumber">PROD-001</ns2:property>
      <ns2:property name="licensingModel">PricingTable</ns2:property>
      <ns2:property name="inUse">false</ns2:property>
      <ns2:property name="skudef">{"skudef":[{"number":"APIREQUESTS","name":"API Requests","type":"QUOTA"},{"number":"USERS","name":"Team Members","type":"QUOTA"},{"number":"CONSOLE_ACCESS","name":"Admin Console","type":"FEATURE"},{"number":"API_ACCESS","name":"API Access","type":"FEATURE"}]}</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }

### Create Pricing Plans

Create individual pricing plans within the module, each with their own SKU values:

#### Free Plan

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensetemplate
Accept: application/xml
Content-Type: application/x-www-form-urlencoded

productModuleNumber=M-PRICING-001&number=PLAN-FREE&name=Free&description=Perfect%20for%20getting%20started&price=0&currency=EUR&licenseType=FEATURE&automatic=true&hidden=true&skus=%7B%22APIREQUESTS%22%3A%2210%22%2C%22USERS%22%3A%221%22%2C%22CONSOLE_ACCESS%22%3Afalse%2C%22API_ACCESS%22%3Afalse%7D
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="LicenseTemplate">
      <ns2:property name="number">PLAN-FREE</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="name">Free</ns2:property>
      <ns2:property name="licenseType">FEATURE</ns2:property>
      <ns2:property name="price">0.00</ns2:property>
      <ns2:property name="currency">EUR</ns2:property>
      <ns2:property name="automatic">true</ns2:property>
      <ns2:property name="hidden">true</ns2:property>
      <ns2:property name="hideLicenses">false</ns2:property>
      <ns2:property name="productModuleNumber">M-PRICING-001</ns2:property>
      <ns2:property name="productModuleName">SaaS Pricing Plans</ns2:property>
      <ns2:property name="inUse">false</ns2:property>
      <ns2:property name="skus">{"APIREQUESTS":"10","USERS":"1","CONSOLE_ACCESS":false,"API_ACCESS":false}</ns2:property>
      <ns2:property name="description">Perfect for getting started</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }

#### Premium Plan

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensetemplate
Accept: application/xml
Content-Type: application/x-www-form-urlencoded

productModuleNumber=M-PRICING-001&number=PLAN-PREMIUM&name=Premium&description=For%20growing%20teams&price=99&currency=EUR&licenseType=TIMEVOLUME&timeVolume=1&timeVolumePeriod=MONTH&skus=%7B%22APIREQUESTS%22%3A%221000%22%2C%22USERS%22%3A%2210%22%2C%22CONSOLE_ACCESS%22%3Atrue%2C%22API_ACCESS%22%3Atrue%7D
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="LicenseTemplate">
      <ns2:property name="number">PLAN-PREMIUM</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="name">Premium</ns2:property>
      <ns2:property name="licenseType">TIMEVOLUME</ns2:property>
      <ns2:property name="price">99.00</ns2:property>
      <ns2:property name="currency">EUR</ns2:property>
      <ns2:property name="automatic">false</ns2:property>
      <ns2:property name="hidden">false</ns2:property>
      <ns2:property name="hideLicenses">false</ns2:property>
      <ns2:property name="productModuleNumber">M-PRICING-001</ns2:property>
      <ns2:property name="productModuleName">SaaS Pricing Plans</ns2:property>
      <ns2:property name="inUse">false</ns2:property>
      <ns2:property name="skus">{"APIREQUESTS":"1000","USERS":"10","CONSOLE_ACCESS":true,"API_ACCESS":true}</ns2:property>
      <ns2:property name="description">For growing teams</ns2:property>
      <ns2:property name="timeVolume">1</ns2:property>
      <ns2:property name="timeVolumePeriod">MONTH</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }

#### Enterprise Plan (Unlimited)

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensetemplate
Accept: application/xml
Content-Type: application/x-www-form-urlencoded

productModuleNumber=M-PRICING-001&number=PLAN-ENTERPRISE&name=Enterprise&description=Unlimited%20everything&price=0&currency=EUR&licenseType=FEATURE&skus=%7B%22APIREQUESTS%22%3A%22-1%22%2C%22USERS%22%3A%22-1%22%2C%22CONSOLE_ACCESS%22%3Atrue%2C%22API_ACCESS%22%3Atrue%7D
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="LicenseTemplate">
      <ns2:property name="number">PLAN-ENTERPRISE</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="name">Enterprise</ns2:property>
      <ns2:property name="licenseType">FEATURE</ns2:property>
      <ns2:property name="price">0.00</ns2:property>
      <ns2:property name="currency">EUR</ns2:property>
      <ns2:property name="automatic">false</ns2:property>
      <ns2:property name="hidden">false</ns2:property>
      <ns2:property name="hideLicenses">false</ns2:property>
      <ns2:property name="productModuleNumber">M-PRICING-001</ns2:property>
      <ns2:property name="productModuleName">SaaS Pricing Plans</ns2:property>
      <ns2:property name="inUse">false</ns2:property>
      <ns2:property name="skus">{"APIREQUESTS":"-1","USERS":"-1","CONSOLE_ACCESS":true,"API_ACCESS":true}</ns2:property>
      <ns2:property name="description">Unlimited everything</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }

## Publish

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

## Integration

### Validation

#### Validation parameters:

On validation, this licensing model requires no parameters.

#### Validation returns values:

-   `Boolean` **`valid`** - **`true`** if use is allowed

#### Validation response examples:

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

Warning Levels
--------------

Below are the default [warning levels](warning-level) associated with this licensing model.

| GREEN | YELLOW | RED |
|:------|:-------|:----|
| timeUsed < 80% | timeUsed >= 80% | timeUsed = 100% |
