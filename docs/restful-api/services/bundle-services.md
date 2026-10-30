---
layout: default
title: Bundle Services API
nav_title: Bundle Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 55
description: "REST API reference for bundles: list, get, create, update and delete bundles of license templates, and obtain a bundle for a licensee."
permalink: bundle-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Bundle Services
===============

Bundles group several license templates so they can be sold and issued together.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/bundle`](#bundles-list) | List bundles | Analytics+ |
| <span class="http-method get">GET</span> [`/bundle/{bundleNumber}`](#get-bundle) | Get bundle | Analytics+ |
| <span class="http-method post">POST</span> [`/bundle`](#create-bundle) | Create bundle | Maintenance+ |
| <span class="http-method post">POST</span> [`/bundle/{bundleNumber}`](#update-bundle) | Update bundle | Maintenance+ |
| <span class="http-method delete">DELETE</span> [`/bundle/{bundleNumber}`](#delete-bundle) | Delete bundle | Operation+ |
| <span class="http-method post">POST</span> [`/bundle/{bundleNumber}/obtain`](#obtain-bundle) | Create the bundle's licenses for a licensee | Operation+ |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Bundles list
------------

<span class="http-method get">GET</span> `/bundle`

**Required role:** Analytics+

Return a list of all configured bundles for the current vendor.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `filter` | query | string |  | `;`-separated `key=value` pairs, e.g. `page=0;items=50;sortorder=number;sortdirection=DESC`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/bundle
```

<div>Response</div>
{: .code-example .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items pagenumber="0" itemsnumber="2" totalpages="1" totalitems="2" hasnext="false">
        <item type="Bundle">
            <property name="number">B001</property>
            <property name="active">true</property>
            <property name="name">Bundle Numero Uno</property>
            <property name="price">0.00</property>
            <property name="currency">EUR</property>
            <property name="description">Bundle Descripcion Uno</property>
            <property name="licenseTemplatesNumbers">LT01,LT02</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
        <item type="Bundle">
            <property name="number">B002</property>
            <property name="active">true</property>
            <property name="name">Bundle Numero Dos</property>
            <property name="price">10.00</property>
            <property name="currency">EUR</property>
            <property name="description">Bundle Descripcion Dos</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Bundle/listBundles)

---

Get bundle
----------

<span class="http-method get">GET</span> `/bundle/{bundleNumber}`

**Required role:** Analytics+

Return a bundle by bundleNumber.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `bundleNumber` | path | string | yes | Number of the bundle. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/bundle/B004
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Bundle">
            <property name="number">B004</property>
            <property name="active">true</property>
            <property name="name">Bundle Numero Cuatro</property>
            <property name="price">40.00</property>
            <property name="currency">EUR</property>
            <property name="description">Bundle Descripcion Cuatro</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Bundle/getBundle)

---

Create bundle
-------------

<span class="http-method post">POST</span> `/bundle`

**Required role:** Maintenance+

Creates a new bundle. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `name` | body | string | yes | Bundle name shown to the end customer. Required. |
| `price` | body | string |  | Decimal price. A price above 0 needs `currency`. |
| `currency` | body | string |  | Values: `EUR`, `USD`. |
| `description` | body | string |  | Bundle description. |
| `licenseTemplateNumbers` | body | string |  | Comma-separated license template numbers. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "number=BQVJQ5F7H&active=false&name=Bundle+6QP3NKHO&price=10&currency=EUR" \
  https://go.netlicensing.io/core/v2/rest/bundle
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
         <item type="Bundle">
            <property name="number">BQVJQ5F7H</property>
            <property name="active">false</property>
            <property name="name">Bundle 6QP3NKHO</property>
            <property name="price">10.00</property>
            <property name="currency">EUR</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Bundle/createBundle)

---

Update bundle
-------------

<span class="http-method post">POST</span> `/bundle/{bundleNumber}`

**Required role:** Maintenance+

Sets the provided properties to a bundle. Return an updated bundle. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `bundleNumber` | path | string | yes | Number of the bundle. |
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `name` | body | string |  | Bundle name shown to the end customer. Required. |
| `price` | body | string |  | Decimal price. A price above 0 needs `currency`. |
| `currency` | body | string |  | Values: `EUR`, `USD`. |
| `description` | body | string |  | Bundle description. |
| `licenseTemplateNumbers` | body | string |  | Comma-separated license template numbers. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "number=BQVJQ5F7H&active=false&name=Bundle+6QP3NKHO&price=10&currency=EUR" \
  https://go.netlicensing.io/core/v2/rest/bundle/BJIF898SP
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Bundle">
            <property name="number">BQVJQ5F7H</property>
            <property name="active">false</property>
            <property name="name">Bundle 6QP3NKHO</property>
            <property name="price">10.00</property>
            <property name="currency">EUR</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Bundle/updateBundle)

---

Delete bundle
-------------

<span class="http-method delete">DELETE</span> `/bundle/{bundleNumber}`

**Required role:** Operation+

Delete a bundle by number.

No `forceCascade` parameter.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `bundleNumber` | path | string | yes | Number of the bundle. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --request DELETE \
  https://go.netlicensing.io/core/v2/rest/bundle/B001
```

<div>Response</div>
{: .code-example .code-header }
```http
HTTP/1.1 204 No Content
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Bundle/deleteBundle)

---

Obtain bundle
-------------

<span class="http-method post">POST</span> `/bundle/{bundleNumber}/obtain`

**Required role:** Operation+

Obtain bundle - create licenses based on license templates. The body is form encoded (`application/x-www-form-urlencoded`).

Returns one License item for each license created.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `bundleNumber` | path | string | yes | Number of the bundle. |
| `licenseeNumber` | body | string | yes | Licensee that receives the licenses. |
| `transactionNumber` | body | string |  | Optional. Links the created licenses to an existing transaction. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "licenseeNumber=LQVJQ5F7H" \
  https://go.netlicensing.io/core/v2/rest/bundle/BJIF898SP/obtain
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="License">
            <property name="number">L7NWRXKTN</property>
            <property name="active">true</property>
            <property name="name">Feature 2</property>
            <property name="price">20.00</property>
            <property name="currency">EUR</property>
            <property name="hidden">false</property>
            <property name="licenseeNumber">IJ5AFCRHP</property>
            <property name="licenseTemplateNumber">EIG97Y953</property>
            <property name="productModuleNumber">MYMW47CMQ</property>
        </item>
        <item type="License">
            <property name="number">L7KMDCA6G</property>
            <property name="active">true</property>
            <property name="name">Feature 3</property>
            <property name="price">30.00</property>
            <property name="currency">EUR</property>
            <property name="hidden">false</property>
            <property name="licenseeNumber">IJ5AFCRHP</property>
            <property name="licenseTemplateNumber">EWT4U3F9V</property>
            <property name="productModuleNumber">MYMW47CMQ</property>
        </item>
        <item type="License">
            <property name="number">L23YKRDWW</property>
            <property name="active">true</property>
            <property name="name">1 day</property>
            <property name="price">10.00</property>
            <property name="currency">EUR</property>
            <property name="hidden">false</property>
            <property name="licenseeNumber">IJ5AFCRHP</property>
            <property name="licenseTemplateNumber">EKR3P2NZU</property>
            <property name="productModuleNumber">MKGMPKCN9</property>
            <property name="gracePeriod">false</property>
            <property name="timeVolumePeriod">DAY</property>
            <property name="timeVolume">1</property>
            <property name="startDate">2023-05-17T10:13:40.015Z</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Bundle/obtainBundle)

