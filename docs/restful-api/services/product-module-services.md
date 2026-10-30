---
layout: default
title: Product Module Services API
nav_title: Product Module Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 20
description: "REST API reference for product modules: list, get, create, update and delete the modules of a product, each licensed by one licensing model."
permalink: product-module-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Product Module Services
=======================

Product modules are the licensable parts of a product. Each module uses one licensing model.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/productmodule`](#product-modules-list) | List product modules | Analytics+ |
| <span class="http-method get">GET</span> [`/productmodule/{productModuleNumber}`](#get-product-module) | Get product module | Analytics+ |
| <span class="http-method post">POST</span> [`/productmodule`](#create-product-module) | Create product module | Maintenance+ |
| <span class="http-method post">POST</span> [`/productmodule/{productModuleNumber}`](#update-product-module) | Update product module | Maintenance+ |
| <span class="http-method delete">DELETE</span> [`/productmodule/{productModuleNumber}`](#delete-product-module) | Delete product module | Maintenance+ |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Product modules list
--------------------

<span class="http-method get">GET</span> `/productmodule`

**Required role:** Analytics+

Return a list of all product modules for the current vendor.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `filter` | query | string |  | `;`-separated `key=value` pairs, e.g. `page=0;items=50;sortorder=number;sortdirection=DESC`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/productmodule
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="ProductModule">
            <property name="number">M001</property>
            <property name="active">true</property>
            <property name="name">Product Module Numero Duo</property>
            <property name="licensingModel">LMOD1</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/ProductModule/listProductModules)

---

Get product module
------------------

<span class="http-method get">GET</span> `/productmodule/{productModuleNumber}`

**Required role:** Analytics+

Return a product module by productModuleNumber.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `productModuleNumber` | path | string | yes | Number of the product module. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/productmodule/M001
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="ProductModule">
            <property name="number">M001</property>
            <property name="active">true</property>
            <property name="name">Product Module Numero Duo</property>
            <property name="licensingModel">LMOD1</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/ProductModule/getProductModule)

---

Create product module
---------------------

<span class="http-method post">POST</span> `/productmodule`

**Required role:** Maintenance+

Creates a new product module. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `productNumber` | body | string | yes | Product the module belongs to. Required on create. |
| `name` | body | string | yes | Module name shown to end customers in the NetLicensing Shop. Required on create. |
| `licensingModel` | body | string | yes | Licensing model of the module. It defines which license templates the module can have and how its licenses are validated. Required on create. Values: `TryAndBuy`, `Rental`, `Subscription`, `Floating`, `MultiFeature`, `PayPerUse`, `PricingTable`, `Quota`, `NodeLocked`, `Discount`. |
| `maxCheckoutValidity` | body | string |  | `Floating` (required): maximum time a session stays checked out, in seconds. Non-negative integer. |
| `yellowThreshold` | body | string |  | Warning level threshold. `Rental`: remaining time volume, in days, below which the warning level turns yellow. `Floating`, `NodeLocked`, `PayPerUse`, `Subscription`, `PricingTable`: percentage (0-100). |
| `redThreshold` | body | string |  | `Rental`: remaining time volume, in days, below which the warning level turns red. Non-negative integer. |
| `nodeSecretMode` | body | string |  | `NodeLocked` (required): `CLIENT` takes the node secret from the validation call. `PREDEFINED` uses secrets set up in advance and is not allowed when the product has `licenseeAutoCreate=true`. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "productNumber=PQVJQ5F7H&number=M0UKRZU3X&active=false&name=Product+Module+JB8KUEW8&licensingModel=LM-E4UWXR75" \
  https://go.netlicensing.io/core/v2/rest/productmodule
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="ProductModule">
            <property name="number">M0UKRZU3X</property>
            <property name="active">false</property>
            <property name="name">Product Module JB8KUEW8</property>
            <property name="licensingModel">LM-E4UWXR75</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/ProductModule/createProductModule)

---

Update product module
---------------------

<span class="http-method post">POST</span> `/productmodule/{productModuleNumber}`

**Required role:** Maintenance+

Sets the provided properties to a product module. Return an updated product module. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `productModuleNumber` | path | string | yes | Number of the product module. |
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `productNumber` | body | string |  | Product the module belongs to. Required on create. |
| `name` | body | string |  | Module name shown to end customers in the NetLicensing Shop. Required on create. |
| `licensingModel` | body | string |  | Licensing model of the module. It defines which license templates the module can have and how its licenses are validated. Required on create. Values: `TryAndBuy`, `Rental`, `Subscription`, `Floating`, `MultiFeature`, `PayPerUse`, `PricingTable`, `Quota`, `NodeLocked`, `Discount`. |
| `maxCheckoutValidity` | body | string |  | `Floating` (required): maximum time a session stays checked out, in seconds. Non-negative integer. |
| `yellowThreshold` | body | string |  | Warning level threshold. `Rental`: remaining time volume, in days, below which the warning level turns yellow. `Floating`, `NodeLocked`, `PayPerUse`, `Subscription`, `PricingTable`: percentage (0-100). |
| `redThreshold` | body | string |  | `Rental`: remaining time volume, in days, below which the warning level turns red. Non-negative integer. |
| `nodeSecretMode` | body | string |  | `NodeLocked` (required): `CLIENT` takes the node secret from the validation call. `PREDEFINED` uses secrets set up in advance and is not allowed when the product has `licenseeAutoCreate=true`. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "number=MNAR74BK9&name=newName" \
  https://go.netlicensing.io/core/v2/rest/productmodule/M001
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="ProductModule">
            <property name="number">MNAR74BK9</property>
            <property name="active">false</property>
            <property name="name">newName</property>
            <property name="licensingModel">FeatureTimeVolume</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/ProductModule/updateProductModule)

---

Delete product module
---------------------

<span class="http-method delete">DELETE</span> `/productmodule/{productModuleNumber}`

**Required role:** Maintenance+

Delete a product module by number.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `productModuleNumber` | path | string | yes | Number of the product module. |
| `forceCascade` | query | string |  | `true` also deletes dependent entities. Any other value, or no value, means `false`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --request DELETE \
  https://go.netlicensing.io/core/v2/rest/productmodule/M001
```

<div>Response</div>
{: .code-example .code-header }
```http
HTTP/1.1 204 No Content
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/ProductModule/deleteProductModule)

