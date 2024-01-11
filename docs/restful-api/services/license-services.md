---
layout: default
title: License Services
parent: Services
grand_parent: NetLicensing API (RESTful)
nav_order: 50
description: "License Services"
permalink: license-services
---

License Services
================

-   [Licenses list](#licenses-list)
-   [Get license](#get-license)
-   [Create license](#create-license)
-   [Update license](#update-license)
-   [Delete license](#delete-license)

### Licenses list

Return a list of all licenses for the current vendor.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/license</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
<li>ROLE_APIKEY_OPERATION</li>
<li>ROLE_APIKEY_ANALYTICS</li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p>- None -</p></td>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseService.html#list-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">LicenseService.list</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/license
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Get license

Return a license by licenseNumber.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/license/{licenseNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
<li>ROLE_APIKEY_OPERATION</li>
<li>ROLE_APIKEY_ANALYTICS</li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p>licenseNumber (string) - License number.</p></td>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseService.html#get-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">LicenseService.get</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/license/L001
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Create license

Creates a new license.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/license</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
<li>ROLE_APIKEY_OPERATION</li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml<br />
Content-Type: application/x-www-form-urlencoded</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p><span style="color: rgb(0,0,0);">licenseeNumber (string) - <span>licenseeNumber</span></span> to assign new license object.</p>
<p><span style="color: rgb(0,0,0);">licenseTemplateNumber (string) - <span>licenseTemplateNumber</span></span> to assign new license object.<span style="color: rgb(0,0,0);"> </span></p>
<p>number (string) - Unique number (across all products/licensees of a vendor) that identifies the license. Vendor can assign this number when creating a license or let NetLicensing generate one. Read-only after corresponding creation transaction status is set to closed.</p>
<p>active (boolean) - If set to false, the license is disabled. License can be re-enabled, but as long as it is disabled, the license is excluded from the validation process.</p>
<p>name (string) - Name for the licensed item. Set from license template on creation, if not specified explicitly. Optional.</p>
<p>price (<span style="color: rgb(0,0,0);">double</span>) - price for the license. If &gt;0, it must always be accompanied by the currency specification. Read-only, set from license template on creation. Optional.</p>
<p>currency (enum) - specifies currency for the license price. Check data types to discover which currencies are supported. Read-only, set from license template on creation. Optional.</p>
<p>- EUR       - Euro currency for the license price</p>
<p>hidden (boolean) - If set to 'true', this license is not shown in <a href="netlicensing-shop">NetLicensing Shop</a> as purchased license. Set from license template on creation, if not specified explicitly. Optional.</p>
<p><span style="color: rgb(0,0,0);">parentfeature (string) - Mandatory for 'TIMEVOLUME' license type and 'RENTAL' licensing model. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">timeVolume (string) - Mandatory for 'TIMEVOLUME' license type. Optional.</span></p></td>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseService.html#create-com.labs64.netlicensing.domain.vo.Context-java.lang.String-java.lang.String-java.lang.String-com.labs64.netlicensing.domain.entity.License-" class="external-link">LicenseService.create</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/license
licenseeNumber=IKPQGUUJ4&licenseTemplateNumber=EUJOJ74GS&active=true
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Update license

Sets the provided properties to a license. Return an updated license.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/license/{licenseNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
<li>ROLE_APIKEY_OPERATION</li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml<br />
Content-Type: application/x-www-form-urlencoded</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p>licenseNumber (string) - Unique number (across all products/licensees of a vendor) that identifies the license. Vendor can assign this number when creating a license or let NetLicensing generate one. Read-only after corresponding creation transaction status is set to closed.</p>
<p>number (string) - Unique number (across all products/licensees of a vendor) that identifies the license. Vendor can assign this number when creating a license or let NetLicensing generate one. Read-only after corresponding creation transaction status is set to closed. Optional.</p>
<p>active (boolean) - If set to false, the license is disabled. License can be re-enabled, but as long as it is disabled, the license is excluded from the validation process. Optional.</p>
<p>name (string) - Name for the licensed item. Set from license template on creation, if not specified explicitly. Optional.</p>
<p><span style="color: rgb(0,0,0);">startDate (<span>date-time</span>) - for TIMEVOLUME licenseType</span></p>
<p><span style="color: rgb(0,0,0);">parentfeature (string) - Mandatory for 'TIMEVOLUME' license type and 'RENTAL' licensing model. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">timeVolume (string) - Mandatory for 'TIMEVOLUME' license type. Optional.</span></p>
<p>price (<span style="color: rgb(0,0,0);">double</span>) - price for the license. If &gt;0, it must always be accompanied by the currency specification. Read-only, set from license template on creation. Optional.</p>
<p>currency (enum) - specifies currency for the license price. Check data types to discover which currencies are supported. Read-only, set from license template on creation. Optional.</p>
<p>- EUR       - Euro currency for the license price</p>
<p>hidden (boolean) - If set to 'true', this license is not shown in <a href="netlicensing-shop">NetLicensing Shop</a> as purchased license. Set from license template on creation, if not specified explicitly. Optional.</p></td>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseService.html#update-com.labs64.netlicensing.domain.vo.Context-java.lang.String-java.lang.String-com.labs64.netlicensing.domain.entity.License-" class="external-link">LicenseService.update</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/license/L2DH0QG1O
active=true
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Delete license

Delete a license by number.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>DELETE /core/v2/rest/license/{licenseNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
<li>ROLE_APIKEY_OPERATION</li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p>licenseNumber (string) - License number.</p></td>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>204 - Successful request<br />
400 - Malformed or illegal request<br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseService.html#delete-com.labs64.netlicensing.domain.vo.Context-java.lang.String-boolean-" class="external-link">LicenseService.delete</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
DELETE https://go.netlicensing.io/core/v2/rest/license/L001
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```html
HTTP/1.1 204 No Content
```
{: .ml-5 }
