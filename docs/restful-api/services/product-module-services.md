---
layout: default
title: Product Module Services
parent: Services
grand_parent: NetLicensing API (RESTful)
nav_order: 20
description: "Product Module Services"
permalink: product-module-services
---

Product Module Services
=======================

-   [Product modules list](#product-modules-list)
-   [Get product module](#get-product-module)
-   [Create product module](#create-product-module)
-   [Update product module](#update-product-module)
-   [Delete product module](#delete-product-module)

### Product modules list

Return a list of all product modules for the current vendor.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/productmodule</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductModuleService.html#list-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">ProductModuleService.list</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/productmodule
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Get product module

Return a product module by productModuleNumber.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/productmodule/{productModuleNumber}</p></td>
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
<td><p>productModuleNumber (string) - Product module number.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductModuleService.html#get-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">ProductModuleService.get</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/productmodule/M001
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Create product module

Creates a new product module.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/productmodule</p></td>
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
<td><p>Request Parameters</p></td>
<td><p><span style="color: rgb(0,0,0);">productNumber (string) - </span>Unique number (across all products of a vendor) that identifies the product module. Vendor can assign this number when creating a product module or let NetLicensing generate one. Read-only after creation of the first licensee for the product.</p>
<p><span style="color: rgb(0,0,0);">active (boolean) - If set to 'false', the product module is disabled. Licensees can not obtain any new licenses for this product module.</span></p>
<p><span style="color: rgb(0,0,0);">name (string) - </span>Product module name that is visible to the end customers in <a href="netlicensing-shop">NetLicensing Shop</a>.</p>
<p><span style="color: rgb(0,0,0);">licensingModel (Array[string]) - Licensing model applied to this product module. Defines what license templates can be configured for the product module and how licenses for this product module are processed during validation. </span><span style="color: rgb(0,0,0);">Supported types: "</span><span style="color: rgb(34,34,34);">Subscription</span><span style="color: rgb(0,0,0);">", "</span><span style="color: rgb(34,34,34);">TryAndBuy</span><span style="color: rgb(0,0,0);">", "</span><span style="color: rgb(34,34,34);">Rental</span><span style="color: rgb(0,0,0);">", "</span><span style="color: rgb(34,34,34);">Floating</span><span style="color: rgb(0,0,0);">", "<span style="color: rgb(34,34,34);">MultiFeature</span></span><span style="color: rgb(0,0,0);">", "<span style="color: rgb(34,34,34);">PayPerUse</span>".</span></p>
<p><span style="color: rgb(0,0,0);"> </span></p>
<p><span style="color: rgb(0,0,0);">number (string) - Unique number (across all products of a vendor) that identifies the product module. Vendor can assign this number when creating a product module or let NetLicensing generate one. Read-only after creation of the first licensee for the product. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">maxCheckoutValidity (integer) - Maximum checkout validity (days). Mandatory for 'Floating' licensing model.</span></p>
<p><span style="color: rgb(0,0,0);">yellowThreshold (integer) - Remaining time volume for yellow level. Mandatory for 'Rental' licensing model.</span></p>
<p><span style="color: rgb(0,0,0);">redThreshold (integer) - Remaining time volume for red level. Mandatory for 'Rental' licensing model.</span></p>
<p><span style="color: rgb(0,0,0);">licenseTemplate (Array[string]) - License template. Mandatory for 'Try &amp; Buy' licensing model. Supported types: <span style="color: rgb(34,34,34);">"TIMEVOLUME", "FEATURE".</span></span></p></td>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
402 - Quota exceeded<br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductModuleService.html#create-com.labs64.netlicensing.domain.vo.Context-java.lang.String-com.labs64.netlicensing.domain.entity.ProductModule-" class="external-link">ProductModuleService.create</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/productmodule
productNumber=PQVJQ5F7H&number=M0UKRZU3X&active=false&name=Product+Module+JB8KUEW8&licensingModel=LM-E4UWXR75
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Update product module

Sets the provided properties to a product module. Return an updated
product module.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/productmodule/{productModuleNumber}</p></td>
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
<td><p>Request Parameters</p></td>
<td><p>productModuleNumber (string) - Product module number.</p>
<p><span style="color: rgb(0,0,0);">number (string) - New product module number (update). Optional.</span></p>
<p><span style="color: rgb(0,0,0);">active (boolean) - If set to 'false', the product module is disabled. Licensees can not obtain any new licenses for this product module. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">name (string) - </span>Product module name that is visible to the end customers in <a href="netlicensing-shop">NetLicensing Shop</a>. <span style="color: rgb(0,0,0);">Optional.</span></p>
<p><span style="color: rgb(0,0,0);">licensingModel (Array[string]) - Licensing model applied to this product module. Defines what license templates can be configured for the product module and how licenses for this product module are processed during validation. </span><span style="color: rgb(0,0,0);">Supported types: "</span><span style="color: rgb(34,34,34);">Subscription</span><span style="color: rgb(0,0,0);">", "</span><span style="color: rgb(34,34,34);">TryAndBuy</span><span style="color: rgb(0,0,0);">", "</span><span style="color: rgb(34,34,34);">Rental</span><span style="color: rgb(0,0,0);">", "</span><span style="color: rgb(34,34,34);">Floating</span><span style="color: rgb(0,0,0);">", "<span style="color: rgb(34,34,34);">MultiFeature</span></span><span style="color: rgb(0,0,0);">", "<span style="color: rgb(34,34,34);">PayPerUse</span>".</span> <span style="color: rgb(0,0,0);">Optional.</span></p>
<p><span style="color: rgb(0,0,0);">maxCheckoutValidity (integer) - Maximum checkout validity (days). Mandatory for 'Floating' licensing model. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">yellowThreshold (integer) - Remaining time volume for yellow level. Mandatory for 'Rental' licensing model. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">redThreshold (integer) - Remaining time volume for red level. Mandatory for 'Rental' licensing model. Optional.</span></p>
<p><span style="color: rgb(0,0,0);">licenseTemplate (Array[string]) - License template. Mandatory for 'Try &amp; Buy' licensing model. Supported types: <span style="color: rgb(34,34,34);">"TIMEVOLUME", "FEATURE". <span style="color: rgb(0,0,0);">Optional.</span></span></span></p></td>
</tr>
<tr class="odd">
<td><p>HTTP Status Code</p></td>
<td><p>200 - Successful request<br />
400 - Malformed or illegal request<br />
402 - Quota exceeded<br />
403 - Access is denied<br />
404 - Resource not found<br />
500 - Internal service error</p></td>
</tr>
</tbody>
</table>

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductModuleService.html#update-com.labs64.netlicensing.domain.vo.Context-java.lang.String-com.labs64.netlicensing.domain.entity.ProductModule-" class="external-link">ProductModuleService.update</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/productmodule/M001
number=MNAR74BK9&name=newName
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
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
{: .ml-5 }

### Delete product module

Delete a product module by number.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>DELETE /core/v2/rest/productmodule/{productModuleNumber}?forceCascade</p></td>
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
<td><p>Request Parameters</p></td>
<td><p>productModuleNumber (string) - Product module number.<br />
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductModuleService.html#delete-com.labs64.netlicensing.domain.vo.Context-java.lang.String-boolean-" class="external-link">ProductModuleService.delete</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
DELETE https://go.netlicensing.io/core/v2/rest/productmodule/M001
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```html
HTTP/1.1 204 No Content
```
{: .ml-5 }
