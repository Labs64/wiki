---
layout: default
title: Bundle Services
parent: Services
grand_parent: NetLicensing API (RESTful)
nav_order: 10
description: "Bundle Services"
permalink: bundle-services
---

Bundle Services
================

-   [Bundles list](#bundles-list)
-   [Get bundle](#get-bundle)
-   [Create bundle](#create-bundle)
-   [Update bundle](#update-bundle)
-   [Delete bundle](#delete-bundle)
-   [Obtain bundle](#obtain-bundle)

### Bundles list

Return a list of all configured bundles for the current vendor.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/bundle</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td>
<ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
<li>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
<li>ROLE_APIKEY_OPERATION</li>
<li>ROLE_APIKEY_ANALYTICS</li>
</ul>
</li>
</ul>
</td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/BundleService.html#list-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">BundleService.list</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/bundle
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

<div>Try it now</div>
{: .code-example .ml-5 .code-header }
```bash
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/bundle
```
{: .ml-5 }

### Get bundle

Return a bundle by bundleNumber.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/bundle/{bundleNumber}</p></td>
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
</ul>
</li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p>bundleNumber (string) - Bundle number.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/BundleService.html#get-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">BundleService.get</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/bundle/B004
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Create bundle

Creates a new bundle.

 

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/bundle</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
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
<td><p>Request Parameters</p></td>
<td><p>number (string) - Unique number that identifies the bundle. Vendor can assign this number when creating a bundle or let NetLicensing generate one.</p>
<p>active (boolean) - If set to false, the bundle is disabled. Licensees can not obtain new licenses.</p>
<p>name (string) - Bundle name. Identifies the bundle for the end customer.</p>
<p>description (string) - Bundle description. Optional.</p>
<p><span style="color: rgb(0,0,0);">price (<span>double</span>) - Price for the bundle. If &gt;0, it must always be accompanied by the currency specification. Optional.</span><span style="color: rgb(0,0,0);"> </span></p>
<p>currency (enum) - specifies currency for the bundle price. Check data types to discover which currencies are supported. Optional.</p>
<p>- EUR       - Euro currency for the bundle price</p>
<p>licenseTemplatesNumbers (string) - Comma-separated license templates numbers.</p>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
402 - <span>Not allowed within your pricing plan</span><br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/bundle
number=BQVJQ5F7H&active=false&name=Bundle+6QP3NKHO&price=10&currency=EUR
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Update bundle

Sets the provided properties to a bundle. Return an updated bundle.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/bundle/{bundleNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
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
<td><p>Request Parameters</p></td>
<td><p>bundleNumber (string) - Unique number that identifies the bundle.</p>
<p>number (string) - New bundle number (update)</p>
<p>active (boolean) - If set to false, the bundle is disabled. Licensees can not obtain new licenses.</p>
<p>name (string) - Bundle name. Identifies the bundle for the end customer.</p>
<p>description (string) - Bundle description. Optional.</p>
<p>price (<span>double</span>) - Price for the bundle. If &gt;0, it must always be accompanied by the currency specification. Optional.</p>
<p>currency (enum) - specifies currency for the bundle price. Check data types to discover which currencies are supported. Optional.</p>
<p>- EUR       - Euro currency for the bundle price</p>
<p>licenseTemplatesNumbers (string) - Comma-separated license templates numbers.</p>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
<span>402 - <span>Not allowed within your pricing plan</span></span><br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/bundle/BJIF898SP
number=BQVJQ5F7H&active=false&name=Bundle+6QP3NKHO&price=10&currency=EUR
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Delete bundle

Delete a bundle by number.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>DELETE /core/v2/rest/bundle/{bundleNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a>
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
<td><p>Request Parameters</p></td>
<td><p>bundleNumber (string) - Bundle number.</p></td>
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

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
DELETE https://go.netlicensing.io/core/v2/rest/bundle/B001
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```html
HTTP/1.1 204 No Content
```
{: .ml-5 }

### Obtain bundle

Obtain bundle - create licenses based on license templates.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/bundle/{bundleNumber}/obtain</p></td>
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
<td><p>Request Parameters</p></td>
<td>
<p>bundleNumber (string) - Bundle number.</p>
<p>licenseeNumber (string) - Licensee number</p>
</td>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
<span>402 - <span>Not allowed within your pricing plan</span></span><br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/bundle/BJIF898SP
licenseeNumber=LQVJQ5F7H
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
{: .ml-5 }