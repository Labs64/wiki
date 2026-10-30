---
layout: default
title: License Template Services API
nav_title: License Template Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 30
description: "REST API reference for license templates: list, get, create, update and delete the templates that define what customers can obtain and at what price."
permalink: license-template-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

License Template Services
=========================

License templates define what a license grants (type, price, currency) within a product module.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/licensetemplate`](#license-templates-list) | List license templates | Analytics+ |
| <span class="http-method get">GET</span> [`/licensetemplate/{licenseTemplateNumber}`](#get-license-template) | Get license template | Analytics+ |
| <span class="http-method post">POST</span> [`/licensetemplate`](#create-license-template) | Create license template | Maintenance+ |
| <span class="http-method post">POST</span> [`/licensetemplate/{licenseTemplateNumber}`](#update-license-template) | Update license template | Maintenance+ |
| <span class="http-method delete">DELETE</span> [`/licensetemplate/{licenseTemplateNumber}`](#delete-license-template) | Delete license template | Maintenance+ |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

License templates list
----------------------

<span class="http-method get">GET</span> `/licensetemplate`

**Required role:** Analytics+

Return a list of all license templates for the current vendor.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `filter` | query | string |  | `;`-separated `key=value` pairs, e.g. `page=0;items=50;sortorder=number;sortdirection=DESC`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/licensetemplate
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="LicenseTemplate">
            <property name="number">E001</property>
            <property name="active">true</property>
            <property name="name">Demo License</property>
            <property name="licenseType">VOLUME</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/LicenseTemplate/listLicenseTemplates)

---

Get license template
--------------------

<span class="http-method get">GET</span> `/licensetemplate/{licenseTemplateNumber}`

**Required role:** Analytics+

Return a license template by licenseTemplateNumber.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `licenseTemplateNumber` | path | string | yes | Number of the license template. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/licensetemplate/E001
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="LicenseTemplate">
        <property name="number">E001</property>
        <property name="active">true</property>
        <property name="name">Demo License</property>
        <property name="licenseType">VOLUME</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/LicenseTemplate/getLicenseTemplate)

---

Create license template
-----------------------

<span class="http-method post">POST</span> `/licensetemplate`

**Required role:** Maintenance+

Creates a new license template. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `productModuleNumber` | body | string | yes | Product module the template belongs to. Required on create. |
| `name` | body | string | yes | Template name. Required on create. |
| `licenseType` | body | string | yes | Type of licenses created from this template. Required: each licensing model accepts only certain types (`TryAndBuy`, `Rental`: FEATURE or TIMEVOLUME; `Subscription`: TIMEVOLUME; `Floating`: FLOATING; `MultiFeature`, `Discount`: FEATURE; `PayPerUse`, `Quota`, `NodeLocked`: QUANTITY). Any other type returns 400. `PricingTable` licenses must be FEATURE or TIMEVOLUME. Values: `FEATURE`, `TIMEVOLUME`, `FLOATING`, `QUANTITY`. |
| `price` | body | string |  | Decimal price, 0 or more. A price above 0 needs `currency`. |
| `currency` | body | string |  | Values: `EUR`, `USD`. |
| `automatic` | body | boolean |  | If `true`, every new licensee gets one license from this template automatically. |
| `hidden` | body | boolean |  | If `true`, the template is not offered in the NetLicensing Shop. |
| `hideLicenses` | body | boolean |  | If `true`, licenses from this template are not shown to the end customer but still count in validation. |
| `timeVolume` | body | string |  | TIMEVOLUME templates (required): positive integer, in units of `timeVolumePeriod`. |
| `timeVolumePeriod` | body | string |  | Unit of `timeVolume`. Defaults to `DAY` when omitted. Values: `DAY`, `WEEK`, `MONTH`, `YEAR`. |
| `maxSessions` | body | string |  | FLOATING templates (required): positive integer, number of concurrent sessions. |
| `quantity` | body | string |  | QUANTITY templates (required): positive integer. `PayPerUse`: number of uses; `Quota`: quota; `NodeLocked`: number of nodes. |
| `gracePeriod` | body | boolean |  | `Rental`, `Subscription` TIMEVOLUME templates: marks the template as the grace period template. It must be hidden and, for `Subscription`, not automatic. Only one active grace period template is allowed per product module. |
| `promoCode` | body | string |  | `Discount` (required): promo code. Letters, digits and `- _ . @ + & $ :`. Must be unique among active discount templates. |
| `discountType` | body | string |  | `Discount` (required). Values: `PERCENT`, `FIX`. |
| `discountAmount` | body | string |  | `Discount` (required): percentage (0-100) for `PERCENT`, decimal amount for `FIX`. |
| `discountCurrency` | body | string |  | `Discount`: required when `discountType=FIX`. |
| `minCartTotal` | body | string |  | `Discount`: minimum cart total (decimal) for the promo code to apply. |
| `startDate` | body | string |  | `Discount`: start of the promo code validity. |
| `endDate` | body | string |  | `Discount`: end of the promo code validity. Must not be before `startDate`. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "productModuleNumber=M0UKRZU3X&number=EZZQJP71K&active=false&name=License+Template+2JSMODHU&licenseType=VOLUME" \
  https://go.netlicensing.io/core/v2/rest/licensetemplate
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="LicenseTemplate">
            <property name="number">EZZQJP71K</property>
            <property name="active">false</property>
            <property name="name">License Template 2JSMODHU</property>
            <property name="licenseType">VOLUME</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/LicenseTemplate/createLicenseTemplate)

---

Update license template
-----------------------

<span class="http-method post">POST</span> `/licensetemplate/{licenseTemplateNumber}`

**Required role:** Maintenance+

Sets the provided properties to a license template. Return an updated license template. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `licenseTemplateNumber` | path | string | yes | Number of the license template. |
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `productModuleNumber` | body | string |  | Product module the template belongs to. Required on create. |
| `name` | body | string |  | Template name. Required on create. |
| `licenseType` | body | string |  | Type of licenses created from this template. Required: each licensing model accepts only certain types (`TryAndBuy`, `Rental`: FEATURE or TIMEVOLUME; `Subscription`: TIMEVOLUME; `Floating`: FLOATING; `MultiFeature`, `Discount`: FEATURE; `PayPerUse`, `Quota`, `NodeLocked`: QUANTITY). Any other type returns 400. `PricingTable` licenses must be FEATURE or TIMEVOLUME. Values: `FEATURE`, `TIMEVOLUME`, `FLOATING`, `QUANTITY`. |
| `price` | body | string |  | Decimal price, 0 or more. A price above 0 needs `currency`. |
| `currency` | body | string |  | Values: `EUR`, `USD`. |
| `automatic` | body | boolean |  | If `true`, every new licensee gets one license from this template automatically. |
| `hidden` | body | boolean |  | If `true`, the template is not offered in the NetLicensing Shop. |
| `hideLicenses` | body | boolean |  | If `true`, licenses from this template are not shown to the end customer but still count in validation. |
| `timeVolume` | body | string |  | TIMEVOLUME templates (required): positive integer, in units of `timeVolumePeriod`. |
| `timeVolumePeriod` | body | string |  | Unit of `timeVolume`. Defaults to `DAY` when omitted. Values: `DAY`, `WEEK`, `MONTH`, `YEAR`. |
| `maxSessions` | body | string |  | FLOATING templates (required): positive integer, number of concurrent sessions. |
| `quantity` | body | string |  | QUANTITY templates (required): positive integer. `PayPerUse`: number of uses; `Quota`: quota; `NodeLocked`: number of nodes. |
| `gracePeriod` | body | boolean |  | `Rental`, `Subscription` TIMEVOLUME templates: marks the template as the grace period template. It must be hidden and, for `Subscription`, not automatic. Only one active grace period template is allowed per product module. |
| `promoCode` | body | string |  | `Discount` (required): promo code. Letters, digits and `- _ . @ + & $ :`. Must be unique among active discount templates. |
| `discountType` | body | string |  | `Discount` (required). Values: `PERCENT`, `FIX`. |
| `discountAmount` | body | string |  | `Discount` (required): percentage (0-100) for `PERCENT`, decimal amount for `FIX`. |
| `discountCurrency` | body | string |  | `Discount`: required when `discountType=FIX`. |
| `minCartTotal` | body | string |  | `Discount`: minimum cart total (decimal) for the promo code to apply. |
| `startDate` | body | string |  | `Discount`: start of the promo code validity. |
| `endDate` | body | string |  | `Discount`: end of the promo code validity. Must not be before `startDate`. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "number=EH3JQCWUI&name=changedLicenseTeplateName" \
  https://go.netlicensing.io/core/v2/rest/licensetemplate/E001
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="LicenseTemplate">
            <property name="number">EH3JQCWUI</property>
            <property name="active">false</property>
            <property name="name">changedLicenseTeplateName</property>
            <property name="licenseType">VOLUME</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/LicenseTemplate/updateLicenseTemplate)

---

Delete license template
-----------------------

<span class="http-method delete">DELETE</span> `/licensetemplate/{licenseTemplateNumber}`

**Required role:** Maintenance+

Delete a license template by number.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `licenseTemplateNumber` | path | string | yes | Number of the license template. |
| `forceCascade` | query | string |  | `true` also deletes dependent entities. Any other value, or no value, means `false`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --request DELETE \
  https://go.netlicensing.io/core/v2/rest/licensetemplate/E001
```

<div>Response</div>
{: .code-example .code-header }
```http
HTTP/1.1 204 No Content
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/LicenseTemplate/deleteLicenseTemplate)

