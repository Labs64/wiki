---
layout: default
title: License Services API
nav_title: License Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 50
description: "REST API reference for licenses: list, get, create, update and delete licenses, and activate or deactivate a license to grant or revoke entitlements."
permalink: license-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

License Services
================

Licenses are issued to a licensee from a license template.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/license`](#licenses-list) | List licenses | Licensee+ |
| <span class="http-method get">GET</span> [`/license/{licenseNumber}`](#get-license) | Get license | Licensee+ |
| <span class="http-method post">POST</span> [`/license`](#create-license) | Create license | Operation+ |
| <span class="http-method post">POST</span> [`/license/{licenseNumber}`](#update-license) | Update license | Operation+ |
| <span class="http-method delete">DELETE</span> [`/license/{licenseNumber}`](#delete-license) | Delete license | Operation+ |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Licenses list
-------------

<span class="http-method get">GET</span> `/license`

**Required role:** Licensee+

Return a list of all licenses for the current vendor.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `filter` | query | string |  | `;`-separated `key=value` pairs, e.g. `page=0;items=50;sortorder=number;sortdirection=DESC`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/license
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="License">
            <property name="number">L001</property>
            <property name="active">true</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/License/listLicenses)

---

Get license
-----------

<span class="http-method get">GET</span> `/license/{licenseNumber}`

**Required role:** Licensee+

Return a license by licenseNumber.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `licenseNumber` | path | string | yes | Number of the license. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/license/L001
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="License">
            <property name="number">L001</property>
            <property name="active">true</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/License/getLicense)

---

Create license
--------------

<span class="http-method post">POST</span> `/license`

**Required role:** Operation+

Creates a new license. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `licenseeNumber` | body | string | yes | Licensee that receives the license. Required on create. |
| `licenseTemplateNumber` | body | string | yes | Template the license is created from. Required on create. |
| `transactionNumber` | body | string |  | Optional. Links the license to an existing transaction. |
| `name` | body | string |  | Name of the licensed item. Taken from the license template when omitted. |
| `hidden` | body | boolean |  | If `true`, the license is not shown to the end customer. Taken from the license template when omitted. |
| `startDate` | body | string |  | TIMEVOLUME licenses: start of the time volume. Required for `Rental` and for non-automatic `Subscription` licenses. |
| `parentFeature` | body | string |  | `Rental` TIMEVOLUME licenses (required): number of the FEATURE license that this time volume extends. |
| `timeVolume` | body | string |  | TIMEVOLUME licenses. Taken from the license template when omitted. |
| `timeVolumePeriod` | body | string |  | Unit of `timeVolume`. Defaults to `DAY` when omitted. Values: `DAY`, `WEEK`, `MONTH`, `YEAR`. |
| `maxSessions` | body | string |  | FLOATING licenses. Taken from the license template when omitted. |
| `quantity` | body | string |  | QUANTITY licenses (`PayPerUse`, `Quota`, `NodeLocked`). Taken from the license template when omitted. |
| `usedQuantity` | body | string |  | `PayPerUse`: quantity already used. Must not exceed `quantity`. |
| `gracePeriod` | body | boolean |  | `Rental`, `Subscription`: marks the license as a grace period license. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "licenseeNumber=IKPQGUUJ4&licenseTemplateNumber=EUJOJ74GS&active=true" \
  https://go.netlicensing.io/core/v2/rest/license
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="License">
            <property name="number">IKPQGUUJ4</property>
            <property name="active">true</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/License/createLicense)

---

Update license
--------------

<span class="http-method post">POST</span> `/license/{licenseNumber}`

**Required role:** Operation+

Sets the provided properties to a license. Return an updated license. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `licenseNumber` | path | string | yes | Number of the license. |
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `licenseeNumber` | body | string |  | Licensee that receives the license. Required on create. |
| `licenseTemplateNumber` | body | string |  | Template the license is created from. Required on create. |
| `transactionNumber` | body | string |  | Optional. Links the license to an existing transaction. |
| `name` | body | string |  | Name of the licensed item. Taken from the license template when omitted. |
| `hidden` | body | boolean |  | If `true`, the license is not shown to the end customer. Taken from the license template when omitted. |
| `startDate` | body | string |  | TIMEVOLUME licenses: start of the time volume. Required for `Rental` and for non-automatic `Subscription` licenses. |
| `parentFeature` | body | string |  | `Rental` TIMEVOLUME licenses (required): number of the FEATURE license that this time volume extends. |
| `timeVolume` | body | string |  | TIMEVOLUME licenses. Taken from the license template when omitted. |
| `timeVolumePeriod` | body | string |  | Unit of `timeVolume`. Defaults to `DAY` when omitted. Values: `DAY`, `WEEK`, `MONTH`, `YEAR`. |
| `maxSessions` | body | string |  | FLOATING licenses. Taken from the license template when omitted. |
| `quantity` | body | string |  | QUANTITY licenses (`PayPerUse`, `Quota`, `NodeLocked`). Taken from the license template when omitted. |
| `usedQuantity` | body | string |  | `PayPerUse`: quantity already used. Must not exceed `quantity`. |
| `gracePeriod` | body | boolean |  | `Rental`, `Subscription`: marks the license as a grace period license. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "active=true" \
  https://go.netlicensing.io/core/v2/rest/license/L2DH0QG1O
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="License">
            <property name="number">L2DH0QG1O</property>
            <property name="active">true</property>
            <property name="transactionNumber">TFMEIR1B9</property>
            <property name="custPropForLic">CustPropValUpdated</property>
            <property name="custPropForLicOnUpd">BlaBlaVal</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/License/updateLicense)

---

Delete license
--------------

<span class="http-method delete">DELETE</span> `/license/{licenseNumber}`

**Required role:** Operation+

Delete a license by number.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `licenseNumber` | path | string | yes | Number of the license. |
| `forceCascade` | query | string |  | `true` also deletes dependent entities. Any other value, or no value, means `false`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --request DELETE \
  https://go.netlicensing.io/core/v2/rest/license/L001
```

<div>Response</div>
{: .code-example .code-header }
```http
HTTP/1.1 204 No Content
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/License/deleteLicense)

