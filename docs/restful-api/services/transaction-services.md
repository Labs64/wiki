---
layout: default
title: Transaction Services
parent: Services
grand_parent: NetLicensing API (RESTful)
nav_order: 99
description: "Transaction Services"
permalink: transaction-services
---

Transaction Services
====================

-   [Transactions list](#TransactionServices-Transactionslist)
-   [Get transaction](#TransactionServices-Gettransaction)
-   [Create transaction](#TransactionServices-Createtransaction)
-   [Update transaction](#TransactionServices-Updatetransaction)

### Transactions list

Return a list of all transactions for the current vendor.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/transaction</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/TransactionService.html#list-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">TransactionService.list</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/transaction
Accept: application/xml
```

**Response**

``` theme:
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Transaction">
            <property name="number">T001</property>
            <property name="active">true</property>
            <property name="status">PENDING</property>
            <property name="source">SHOP</property>
        </item>
    </items>
</netlicensing>
```

### Get transaction

Return a transaction by transactionNumber.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/transaction/{transactionNumber}</p></td>
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
<td><p>transactionNumber (string) - Transaction number.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/TransactionService.html#get-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">TransactionService.get</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/transaction/T001
Accept: application/xml
```

**Response**

``` theme:
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Transaction">
            <property name="number">T001</property>
            <property name="active">true</property>
            <property name="status">PENDING</property>
            <property name="source">SHOP</property>
        </item>
    </items>
</netlicensing>
```

### Create transaction

Creates a new transaction.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/transaction</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="https://www.labs64.de/confluence/display/NLICPUB/Security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
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
<td><p><span style="color: rgb(0,0,0);">licenseeNumber</span> (string) - L<span style="color: rgb(0,0,0);">icensee number</span>.</p>
<p><span style="color: rgb(0,0,0);">number (string) - Unique number (across all products of a vendor) that identifies the transaction. <span>Optional.</span></span></p>
<p><span style="color: rgb(0,0,0);">active (boolean) - Always true for transactions.</span></p>
<p><span style="color: rgb(0,0,0);">status (string) - Status of transaction. "<span style="color: rgb(34,34,34);">CANCELLED</span>", "<span style="color: rgb(34,34,34);">CLOSED</span>", "<span style="color: rgb(34,34,34);">PENDING</span>".</span></p>
<p><span style="color: rgb(0,0,0);">source (<span>string</span>) - "SHOP". AUTO transaction for internal use only.</span></p>
<p><span style="color: rgb(0,0,0);"><span><span><span><span>dateCreated (<span>date-time</span>) - <span>Date created. <span>Optional.</span></span></span></span></span></span></span></p>
<p><span style="color: rgb(0,0,0);"><span><span><span><span><span>dateClosed (<span>date-time</span>) - <span>Date closed. <span>Optional.</span></span></span></span></span></span></span></span></p>
<p><span style="color: rgb(0,0,0);"><span><span><span><span><span><span>paymentMethod (<span>string</span>) - P<span>ayment method. <span>Optional.</span></span></span></span></span></span></span></span></span></p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/TransactionService.html#create-com.labs64.netlicensing.domain.vo.Context-com.labs64.netlicensing.domain.entity.Transaction-" class="external-link">TransactionService.create</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/transaction
licenseeNumber=IP53OX9PF&number=TFMEIR1B9&active=true&status=PENDING&source=SHOP
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Transaction">
            <property name="number">TFMEIR1B9</property>
            <property name="active">true</property>
            <property name="status">PENDING</property>
            <property name="source">SHOP</property>
        </item>
    </items>
</netlicensing>
```

### Update transaction

Sets the provided properties to a transaction. Return an updated
transaction.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/transaction/{transactionNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="https://www.labs64.de/confluence/display/NLICPUB/Security">API Key Identification</a>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
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
<td><p>transactionNumber (string) - Transaction number</p>
<p><span style="color: rgb(0,0,0);">number (string) - Unique number (across all products of a vendor) that identifies the transaction. <span>Optional.</span></span></p>
<p><span style="color: rgb(0,0,0);">active (boolean) - Always true for transactions. <span>Optional.</span></span></p>
<p><span style="color: rgb(0,0,0);">status (string) - Status of transaction. "<span style="color: rgb(34,34,34);">CANCELLED</span>", "<span style="color: rgb(34,34,34);">CLOSED</span>", "<span style="color: rgb(34,34,34);">PENDING</span>". <span>Optional.</span></span></p>
<p><span style="color: rgb(0,0,0);">source (string) - "SHOP". AUTO transaction for internal use only. <span>Optional.</span></span></p>
<p><span style="color: rgb(0,0,0);">dateCreated (date-time) - Date created. <span>Optional.</span></span></p>
<p><span style="color: rgb(0,0,0);">dateClosed (date-time) - Date closed. <span>Optional.</span></span></p>
<p><span style="color: rgb(0,0,0);">paymentMethod (string) - Payment method. <span>Optional.</span></span></p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/TransactionService.html#update-com.labs64.netlicensing.domain.vo.Context-java.lang.String-com.labs64.netlicensing.domain.entity.Transaction-" class="external-link">TransactionService.update</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/transaction/TGG8UTJS8
number=TGG8UTJS8&active=false&status=CANCELLED
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Transaction">
            <property name="number">TGG8UTJS8</property>
            <property name="active">false</property>
            <property name="status">CANCELLED</property>
            <property name="source">SHOP</property>
        </item>
    </items>
</netlicensing>
```
