---
layout: default
title: Product Services API
nav_title: Product Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 10
description: "REST API reference for products: list, get, create, update and delete products, including licensee auto-create, VAT mode and discounts."
permalink: product-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Product Services
================

Products are the top-level entities that hold your product modules, licensees and discounts.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/product`](#products-list) | List products | Licensee+ |
| <span class="http-method get">GET</span> [`/product/{productNumber}`](#get-product) | Get product | Licensee+ |
| <span class="http-method post">POST</span> [`/product`](#create-product) | Create product | Maintenance+ |
| <span class="http-method post">POST</span> [`/product/{productNumber}`](#update-product) | Update product | Maintenance+ |
| <span class="http-method delete">DELETE</span> [`/product/{productNumber}`](#delete-product) | Delete product | Maintenance+ |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Products list
-------------

<span class="http-method get">GET</span> `/product`

**Required role:** Licensee+

Return a list of all configured products for the current vendor.

For `ROLE_APIKEY_LICENSEE` the filter is forced to the licensee bound to the API key, so the
result holds only that licensee's products.
Extra filter keys: `exportSettings=true` also returns the products' ProductModule and
LicenseTemplate items. `exportAssets=true` also returns License and Licensee items plus one
`VendorDataExport` item, and marks the response for signing. `licenseeNumber=<n1>,<n2>`
restricts the exported licenses and licensees.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `filter` | query | string |  | `;`-separated `key=value` pairs, e.g. `page=0;items=50;sortorder=number;sortdirection=DESC`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/product
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Product">
            <property name="number">P001</property>
            <property name="active">true</property>
            <property name="name">Product Numero Uno</property>
            <property name="version">v1.0</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Product/listProducts)

---

Get product
-----------

<span class="http-method get">GET</span> `/product/{productNumber}`

**Required role:** Licensee+

Return a product by productNumber.

For `ROLE_APIKEY_LICENSEE` the product must belong to the key's licensee, otherwise the call fails.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `productNumber` | path | string | yes | Number of the product. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/product/P014
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Product">
            <property name="number">P014</property>
            <property name="active">true</property>
            <property name="name">Product Numero Uno</property>
            <property name="version">v1.0</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Product/getProduct)

---

Create product
--------------

<span class="http-method post">POST</span> `/product`

**Required role:** Maintenance+

Creates a new product. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `name` | body | string | yes | Product name. Together with the version it identifies the product for the end customer. Required on create. |
| `version` | body | string |  | Product version. Optional, shown next to the product name. |
| `licenseeAutoCreate` | body | boolean |  | If `true`, a licensee that does not exist is created at its first validation. |
| `description` | body | string |  | Product description. |
| `licensingInfo` | body | string |  | Licensing information shown to the end customer. |
| `discount` | body | string |  | Repeatable. Volume discount in the format `totalPrice;currency;amount`. Append `%` to `amount` for a percentage, otherwise it is a fixed amount in `currency`. |
| `licenseeSecretMode` | body | string |  | How licensee secrets are handled. Values: `PREDEFINED`, `CLIENT`. |
| `vatMode` | body | string |  | Whether prices include VAT (`GROSS`) or exclude it (`NET`). `NET` is allowed only for company accounts. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "number=PQVJQ5F7H&active=false&name=Product+6QP3NKHO&version=v3.4&discount=100;EUR;10&discount=10;EUR;9%" \
  https://go.netlicensing.io/core/v2/rest/product
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Product">
            <property name="number">PQVJQ5F7H</property>
            <property name="active">false</property>
            <property name="name">Product 6QP3NKHO</property>
            <property name="version">v3.4</property>
            <list name="discount">
                <property name="totalPrice">100.00</property>
                <property name="currency">EUR</property>
                <property name="amountFix">10</property>
            </list>
            <list name="discount">
                <property name="totalPrice">10.00</property>
                <property name="currency">EUR</property>
                <property name="amountPercent">9</property>
            </list>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Product/createProduct)

---

Update product
--------------

<span class="http-method post">POST</span> `/product/{productNumber}`

**Required role:** Maintenance+

Sets the provided properties to a product. Return an updated product. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `productNumber` | path | string | yes | Number of the product. |
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `name` | body | string |  | Product name. Together with the version it identifies the product for the end customer. Required on create. |
| `version` | body | string |  | Product version. Optional, shown next to the product name. |
| `licenseeAutoCreate` | body | boolean |  | If `true`, a licensee that does not exist is created at its first validation. |
| `description` | body | string |  | Product description. |
| `licensingInfo` | body | string |  | Licensing information shown to the end customer. |
| `discount` | body | string |  | Repeatable. Volume discount in the format `totalPrice;currency;amount`. Append `%` to `amount` for a percentage, otherwise it is a fixed amount in `currency`. |
| `licenseeSecretMode` | body | string |  | How licensee secrets are handled. Values: `PREDEFINED`, `CLIENT`. |
| `vatMode` | body | string |  | Whether prices include VAT (`GROSS`) or exclude it (`NET`). `NET` is allowed only for company accounts. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "number=PQVJQ5F7H&active=false&name=Product+6QP3NKHO&version=v3.4&discount=100;EUR;20&discount=10;EUR;9%" \
  https://go.netlicensing.io/core/v2/rest/product/PJIF898SP
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Product">
            <property name="number">PJIF898SP</property>
            <property name="active">false</property>
            <property name="name">testproduct</property>
            <property name="version">1.1</property>
            <property name="myProperty">myValue</property>
            <list name="discount">
                <property name="totalPrice">100.00</property>
                <property name="currency">EUR</property>
                <property name="amountFix">20</property>
            </list>
            <list name="discount">
                <property name="totalPrice">10.00</property>
                <property name="currency">EUR</property>
                <property name="amountPercent">9</property>
            </list>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Product/updateProduct)

---

Delete product
--------------

<span class="http-method delete">DELETE</span> `/product/{productNumber}`

**Required role:** Maintenance+

Delete a product by number.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `productNumber` | path | string | yes | Number of the product. |
| `forceCascade` | query | string |  | `true` also deletes dependent entities. Any other value, or no value, means `false`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --request DELETE \
  https://go.netlicensing.io/core/v2/rest/product/P001
```

<div>Response</div>
{: .code-example .code-header }
```http
HTTP/1.1 204 No Content
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Product/deleteProduct)

