---
layout: default
title:
parent: Services
nav_order: 99
description: ""
permalink:
---

Product Services
===============================================



-   [Products list](#ProductServices-Productslist)
-   [Get product](#ProductServices-Getproduct)
-   [Create product](#ProductServices-Createproduct)
-   [Update product](#ProductServices-Updateproduct)
-   [Delete product](#ProductServices-Deleteproduct)

### Products list

Return a list of all configured products for the current vendor.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/product</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductService.html#list-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">ProductService.list</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/product
Accept: application/xml
```

**Response**

``` theme:
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

**Try it now**

``` theme:
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/product
```

### Get product

Return a product by productNumber.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/product/{productNumber}</p></td>
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
<td><p>Request Parameters</p></td>
<td><p>productNumber (string) - Product number.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductService.html#get-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">ProductService.get</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/product/P014
Accept: application/xml
```

**Response**

``` theme:
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

**Try it now**

``` theme:
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/product/P014
```

### Create product

Creates a new product.

 

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/product</p></td>
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
<td><p>Request Parameters</p></td>
<td><p>number (string) - Unique number that identifies the product. Vendor can assign this number when creating a product or let NetLicensing generate one. Read-only after creation of the first licensee for the product.</p>
<p>active (boolean) - If set to false, the product is disabled. No new licensees can be registered for the product, existing licensees can not obtain new licenses.</p>
<p>name (string) - Product name. Together with the version identifies the product for the end customer.</p>
<p>version (string) - Product version. Convenience parameter, additional to the product name.</p>
<p>licenseeAutoCreate (boolean) - If set to 'true', non-existing licensees will be created at first validation attempt.</p>
<p>description (string) - Product description. Optional.</p>
<p>licensingInfo (string) - Licensing information. Optional.</p>
<p>licenseeSecretMode (enum) - Licensee secret mode for product (<img src="assets/images/icons/emoticons/information.png" alt="(info)" class="emoticon emoticon-information" /> available in selected pricing plans). Optional. <img src="assets/images/icons/emoticons/warning.png" alt="(warning)" class="emoticon emoticon-warning" /> <em>Deprecated, use <a href="Node-Locked_18677762.html">Node-Locked Licensing Model</a> instead.</em></p>
<p><span style="color: rgb(0,0,0);"> - DISABLED - licensee secret ignored.</span></p>
<p><span style="color: rgb(80,80,80);"><span style="color: rgb(0,0,0);"> - <span>PREDEFINED - licensee secret must be set in NetLicensing (can't be used with Auto-create Licensee).</span></span></span></p>
<p><span style="color: rgb(80,80,80);"><span style="color: rgb(0,0,0);"><span> - <span>CLIENT - client sets the licensee secret on first validate.</span></span></span></span></p>
<p>vatMode (Enum) - Vat mode for product. Optional.</p>
<p>- <span style="color: rgb(0,0,0);">GROSS: VAT is included in the prices.</span></p>
<p><span style="color: rgb(0,0,0);">- NET: VAT is not included in the prices.</span></p>
<p>discount (list) - Product discounts list. Optional, multiple allowed (list). Parameters of each product discount are passed using the following format:</p>
<p><span style="color: rgb(80,80,80);"><em>discount=<em>t<span style="color: rgb(81,81,81);">otalPrice;currency;<em>discountAmount</em></span></em><br />
&lt;t<span style="color: rgb(81,81,81);">otalPrice</span>&gt; <em>(string)</em></em>  - <span style="color: rgb(81,81,81);">Total Price</span><em><br />
&lt;</em></span>currency<em>&gt;</em><span style="color: rgb(80,80,80);">  <em>(string)</em> - Currency<span style="color: rgb(81,81,81);"><em><br />
&lt;discountAmount&gt;</em> <em>(string)</em> - <span style="color: rgb(81,81,81);">Discount Amount: absolute (e.g. "1.50") or percent (e.g. "5%")</span></span></span></p></td>
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

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductService.html#create-com.labs64.netlicensing.domain.vo.Context-com.labs64.netlicensing.domain.entity.Product-" class="external-link">ProductService.create</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/product
number=PQVJQ5F7H&active=false&name=Product+6QP3NKHO&version=v3.4&discount=100;EUR;10&discount=10;EUR;9%
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
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

### Update product

Sets the provided properties to a product. Return an updated product.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/product/{productNumber}</p></td>
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
<td><p>Request Parameters</p></td>
<td><p>productNumber (string) - Unique number that identifies the product.</p>
<p>number (string) - New product number (update)</p>
<p>active (boolean) - If set to false, the product is disabled. No new licensees can be registered for the product, existing licensees can not obtain new licenses.</p>
<p>name (string) - Product name. Together with the version identifies the product for the end customer.</p>
<p>version (string) - Product version. Convenience parameter, additional to the product name.</p>
<p>licenseeAutoCreate (boolean) - If set to 'true', non-existing licensees will be created at first validation attempt.</p>
<p>description (string) - Product description. Optional.</p>
<p>licensingInfo (string) - Licensing information. Optional.</p>
<p>licenseeSecretMode (enum) - <span>Licensee secret mode for product (</span><img src="assets/images/icons/emoticons/information.png" alt="(info)" class="emoticon emoticon-information" /><span> </span><span>available in selected pricing plans</span><span>). Optional. </span><img src="assets/images/icons/emoticons/warning.png" alt="(warning)" class="emoticon emoticon-warning" /><span> </span><em>Deprecated, use <a href="Node-Locked_18677762.html">Node-Locked Licensing Model</a> instead.</em></p>
<p><span style="color: rgb(0,0,0);"> - DISABLED - licensee secret ignored.</span></p>
<p><span style="color: rgb(80,80,80);"><span style="color: rgb(0,0,0);"> - PREDEFINED - licensee secret must be set in NetLicensing (can't be used with Auto-create Licensee).</span></span></p>
<p><span style="color: rgb(80,80,80);"><span style="color: rgb(0,0,0);"> - CLIENT - client sets the licensee secret on first validate.</span></span></p>
<p>vatMode (Enum) - Vat mode for product. Optional.</p>
<p>- <span style="color: rgb(0,0,0);">GROSS: VAT is included in the prices.</span></p>
<p><span style="color: rgb(0,0,0);">- NET: VAT is not included in the prices.</span></p>
<p>discount (list) - Product discounts list. Optional<span>, multiple allowed (list)</span>. Parameters of each product discount are passed using the following format:</p>
<p><span style="color: rgb(80,80,80);"><em>discount=<em>t<span style="color: rgb(81,81,81);">otalPrice;currency;<em>discountAmount</em></span></em><br />
&lt;t<span style="color: rgb(81,81,81);">otalPrice</span>&gt; <em>(string)</em></em>  - <span style="color: rgb(81,81,81);">Total Price</span><em><br />
&lt;</em></span>currency<em>&gt;</em><span style="color: rgb(80,80,80);">  <em>(string)</em> - Currency<span style="color: rgb(81,81,81);"><em><br />
&lt;discountAmount&gt;</em> <em>(string)</em> - Discount Amount: absolute (e.g. "1.50") or percent (e.g. "5%") </span></span></p>
<p><span style="color: rgb(80,80,80);"><span style="color: rgb(81,81,81);">Discounts are always replaced all or none - specify all required discounts on update, even if some are unchanged. Discounts can also be deleted completely by specifying a single discount with an </span></span><span style="color: rgb(81,81,81);">empty value</span><span style="color: rgb(81,81,81);">:</span></p>
<p><span style="color: rgb(80,80,80);"><span style="color: rgb(81,81,81);"><span style="color: rgb(80,80,80);"><em>discount=</em></span></span></span></p></td>
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

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductService.html#update-com.labs64.netlicensing.domain.vo.Context-java.lang.String-com.labs64.netlicensing.domain.entity.Product-" class="external-link">ProductService.update</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/product/PJIF898SP
number=PQVJQ5F7H&active=false&name=Product+6QP3NKHO&version=v3.4&discount=100;EUR;20&discount=10;EUR;9%
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
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

### Delete product

Delete a product by number.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>DELETE /core/v2/rest/product/{productNumber}?forceCascade</p></td>
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
<td><p>Request Parameters</p></td>
<td><p>productNumber (string) - Product number.<br />
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/ProductService.html#delete-com.labs64.netlicensing.domain.vo.Context-java.lang.String-boolean-" class="external-link">ProductService.delete</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
DELETE https://go.netlicensing.io/core/v2/rest/product/P001
Accept: application/xml
```

**Response**

``` theme:
HTTP/1.1 204 No Content
```
