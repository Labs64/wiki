---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

License Template Services
========================================================



-   [License templates
    list](#LicenseTemplateServices-Licensetemplateslist)
-   [Get license template](#LicenseTemplateServices-Getlicensetemplate)
-   [Create license
    template](#LicenseTemplateServices-Createlicensetemplate)
-   [Update license
    template](#LicenseTemplateServices-Updatelicensetemplate)
-   [Delete license
    template](#LicenseTemplateServices-Deletelicensetemplate)

### License templates list

Return a list of all license templates for the current vendor.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/licensetemplate</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="https://www.labs64.de/confluence/display/NLICPUB/Security">API Key Identification</a>
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
<td><p> - None -</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseTemplateService.html#list-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">LicenseTemplateService.list</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/licensetemplate
Accept: application/xml
```

**Response**

``` theme:
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

### Get license template

Return a license template by licenseTemplateNumber.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/licensetemplate/{licenseTemplateNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="https://www.labs64.de/confluence/display/NLICPUB/Security">API Key Identification</a>
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
<td><p>licenseTemplateNumber (string) - License template number.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseTemplateService.html#get-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">LicenseTemplateService.get</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/licensetemplate/E001
Accept: application/xml
```

**Response**

``` theme:
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

### Create license template

Creates a new license template.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/licensetemplate</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="https://www.labs64.de/confluence/display/NLICPUB/Security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
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
<td><p><span style="color: rgb(0,0,0);">productModuleNumber (string) - </span>Number of product module to ?reate license template object.</p>
<p><span style="color: rgb(0,0,0);">number (string) - </span>Unique number (across all products of a vendor) that identifies the license template. Vendor can assign this number when creating a license template or let NetLicensing generate one. Read-only after creation of the first license from this license template.</p>
<p><span style="color: rgb(0,0,0);">name (string) - L</span>icense template name to create license template object.</p>
<p><span style="color: rgb(0,0,0);"><span>active (boolean) - If set to 'false', the license template is disabled. Licensee can not obtain any new licenses off this license template.</span> </span></p>
<p>licenseType (<span style="color: rgb(0,0,0);">Array[string]</span>) - Type of licenses created from this license template. Supported types: "FEATURE", "TIMEVOLUME", "FLOATING", "QUANTITY".</p>
<p><span style="color: rgb(0,0,0);">timeVolume <span>(string) </span>- Mandatory for 'TIMEVOLUME' license type. </span></p>
<p><span style="color: rgb(0,0,0);">maxSessions <span>(string) </span>- Mandatory for 'FLOATING' license type.</span></p>
<p><span style="color: rgb(0,0,0);">quantity (<span>string</span>) - </span><span style="color: rgb(0,0,0);">Mandatory for 'QUANTITY' license type.</span></p>
<p><span style="color: rgb(0,0,0);">price (<span>double</span>) - Price for the license. If &gt;0, it must always be accompanied by the currency specification. Optional.</span><span style="color: rgb(0,0,0);"> </span></p>
<p>currency (enum) - specifies currency for the license price. Check data types to discover which currencies are supported. Read-only, set from license template on creation. Optional.</p>
<p>- EUR       - Euro currency for the license price</p>
<p><span style="color: rgb(0,0,0);">automatic (boolean) - If set to 'true', every new licensee automatically gets one license out of this license template on creation. Automatic licenses must have their price set to 0. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">hidden (boolean) - If set to 'true', this license template is not shown in NetLicensing Shop as offered for purchase. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">hideLicenses (boolean) - If set to 'true', licenses from this license template are not visible to the end customer, but participate in validation. Optional.</span></p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseTemplateService.html#create-com.labs64.netlicensing.domain.vo.Context-java.lang.String-com.labs64.netlicensing.domain.entity.LicenseTemplate-" class="external-link">LicenseTemplateService.create</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/licensetemplate
productModuleNumber=M0UKRZU3X&number=EZZQJP71K&active=false&name=License+Template+2JSMODHU&licenseType=VOLUME
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
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

### Update license template

Sets the provided properties to a license template. Return an updated
license template.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/licensetemplate/{licenseTemplateNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="https://www.labs64.de/confluence/display/NLICPUB/Security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
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
<td><p>licenseTemplateNumber (string) - License template number.</p>
<p><span style="color: rgb(0,0,0);">number (string) - </span>Unique number (across all products of a vendor) that identifies the license template. Vendor can assign this number when creating a license template or let NetLicensing generate one. Read-only after creation of the first license from this license template.</p>
<p><span style="color: rgb(0,0,0);">name (string) - L</span>icense template name to create license template object.</p>
<p><span style="color: rgb(0,0,0);">active (boolean) - If set to 'false', the license template is disabled. Licensee can not obtain any new licenses off this license template. </span></p>
<p>licenseType (<span style="color: rgb(0,0,0);">Array[string]</span>) - Type of licenses created from this license template. Supported types: "FEATURE", "TIMEVOLUME", "FLOATING", "QUANTITY".</p>
<p><span style="color: rgb(0,0,0);">timeVolume (string) - Mandatory for 'TIMEVOLUME' license type. </span></p>
<p><span style="color: rgb(0,0,0);">maxSessions (string) - Mandatory for 'FLOATING' license type.</span></p>
<p><span style="color: rgb(0,0,0);">quantity (string) - </span><span style="color: rgb(0,0,0);">Mandatory for 'QUANTITY' license type.</span></p>
<p><span style="color: rgb(0,0,0);">price (double) - Price for the license. If &gt;0, it must always be accompanied by the currency specification. Optional.</span><span style="color: rgb(0,0,0);"> </span></p>
<p>currency (enum) - specifies currency for the license price. Check data types to discover which currencies are supported. Read-only, set from license template on creation. Optional.</p>
<p>- EUR       - Euro currency for the license price</p>
<p><span style="color: rgb(0,0,0);">automatic (boolean) - If set to 'true', every new licensee automatically gets one license out of this license template on creation. Automatic licenses must have their price set to 0. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">hidden (boolean) - If set to 'true', this license template is not shown in NetLicensing Shop as offered for purchase. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">hideLicenses (boolean) - If set to 'true', licenses from this license template are not visible to the end customer, but participate in validation. Optional.</span></p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseTemplateService.html#update-com.labs64.netlicensing.domain.vo.Context-java.lang.String-com.labs64.netlicensing.domain.entity.LicenseTemplate-" class="external-link">LicenseTemplateService.update</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/licensetemplate/E001
number=EH3JQCWUI&name=changedLicenseTeplateName
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
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

### Delete license template

Delete a license template by number.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>DELETE /core/v2/rest/licensetemplate/{licenseTemplateNumber}?forceCascade</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="https://www.labs64.de/confluence/display/NLICPUB/Security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p>licenseTemplateNumber (string) - License template number.<br />
forceCascade (boolean) - Force object deletion and all descendants.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseTemplateService.html#delete-com.labs64.netlicensing.domain.vo.Context-java.lang.String-boolean-" class="external-link">LicenseTemplateService.delete</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
DELETE https://go.netlicensing.io/core/v2/rest/licensetemplate/E001
Accept: application/xml
```

**Response**

``` theme:
HTTP/1.1 204 No Content
```
