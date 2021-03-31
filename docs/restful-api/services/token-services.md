---
layout: default
title: Token Services
parent: Services
grand_parent: NetLicensing API (RESTful)
nav_order: 70
description: "Token Services"
permalink: token-services
---

Token Services
==============

-   [Tokens list](#tokens-list)
-   [Get token](#get-token)
-   [Create token](#create-token)
-   [Delete token](#delete-token)

### Tokens list

Return a list of all tokens for the current vendor.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/token</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/TokenService.html#list-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">TokenService.list<br />
</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/token
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos />
    <items>
        <item type="Token">
            <property name="number">a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48</property>
            <property name="active">true</property>
            <property name="expirationTime">2014-01-30T13:21:03.071+01:00</property>
            <property name="tokenType">SHOP</property>
            <property name="shopURL">
                https://go.netlicensing.io/shop/v2/?shoptoken=a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
            </property>
            <property name="licenseeNumber">I001-DEMO</property>
            <property name="vendorNumber">VDEMO</property>
        </item>
    </items>
</netlicensing>
```
{: .ml-5 }

<div>Try it now</div>
{: .code-example .ml-5 .code-header }
```bash
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/token
```
{: .ml-5 }

 

### Get token

Return a token by tokenNumber.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/token/{tokenNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p>tokenNumber (string) - Token number.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/TokenService.html#get-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">TokenService.get<br />
</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/token/a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos />
    <items>
        <item type="Token">
            <property name="number">a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48</property>
            <property name="active">true</property>
            <property name="expirationTime">2014-01-30T13:21:03.071+01:00</property>
            <property name="tokenType">SHOP</property>
            <property name="shopURL">
                https://go.netlicensing.io/shop/v2/?shoptoken=a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
            </property>
            <property name="licenseeNumber">I001-DEMO</property>
            <property name="vendorNumber">VDEMO</property>
        </item>
    </items>
</netlicensing>
```
{: .ml-5 }

<div>Try it now</div>
{: .code-example .ml-5 .code-header }
```bash
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/token/a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
```
{: .ml-5 }

 

### Create token

Create token by tokenType and additional token parameters.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/token</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
<li><a href="security">API Key Identification</a> (<span>Only for tokenType=SHOP)</span>
<ul>
<li>ROLE_APIKEY_ADMIN</li>
<li>ROLE_APIKEY_MAINTENANCE</li>
<li>ROLE_APIKEY_OPERATION</li>
<li>ROLE_APIKEY_ANALYTICS</li>
<li><p>ROLE_APIKEY_LICENSEE</p></li>
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
<td>
<p>tokenType (enum) - Token type to be generated<br />
- <i>DEFAULT</i> - default one-time token (will be expired after first request)<br />
- <i>SHOP</i> - shop token is used to redirect customer to the NetLicensing Shop ('licenseeNumber' is mandatory)<br />
- <i>APIKEY</i> - APIKey token<br/>
</p>
<p>type (enum) - Token type to be generated<br />
- <i>ACTION</i> - Action token (e.g. Customer Portal)<br/>
</p>
<p>
licenseeNumber (string) -
<br>- <i>tokenType=SHOP</i> - identifies licensee that will be assigned to the shop token
<br>- <i>tokenType=APIKEY</i> - specifies the scope of validity of the APIKey; the only licensee with the given number can be validated using this APIKey</p>
<p>successURL (URI) - Take customers to this URL when they finish checkout.</p>
<p>successURLTitle (string) - Shop link title for successful checkout process.</p>
<p>cancelURL (URI) - Take customers to this URL when they cancel their checkout.</p>
<p>cancelURLTitle (string) - Shop link title for cancel checkout process.</p>
<p>apiKeyRole (string) - RoleID (see <a href="security">Security</a>). Only for tokenType=APIKEY.</p>
<p>action (enum) - 'licenseeLogin'. Only for token=ACTION.</p>
<p>licenseeNumber (string) - customer number. Only for token=ACTION.</p>
</td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/TokenService.html#create-com.labs64.netlicensing.domain.vo.Context-com.labs64.netlicensing.domain.entity.Token-" class="external-link">TokenService.create</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/token
tokenType=SHOP&licenseeNumber=I001-DEMO
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos />
    <items>
        <item type="Token">
            <property name="number">c6d36895-f2a7-497a-aad1-4290c1d17f40</property>
            <property name="active">true</property>
            <property name="expirationTime">2014-01-30T13:16:09.675+01:00</property>
            <property name="tokenType">SHOP</property>
            <property name="shopURL">
                https://go.netlicensing.io/shop/v2/?shoptoken=c6d36895-f2a7-497a-aad1-4290c1d17f40
            </property>
            <property name="licenseeNumber">I001-DEMO</property>
            <property name="vendorNumber">VDEMO</property>
        </item>
    </items>
</netlicensing>
```
{: .ml-5 }

<div>Try it now</div>
{: .code-example .ml-5 .code-header }
```bash
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request POST https://go.netlicensing.io/core/v2/rest/token --data "tokenType=SHOP&licenseeNumber=I001-DEMO"
```
{: .ml-5 }

### Delete token

Delete a token by number.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>DELETE /core/v2/rest/token/{tokenNumber}</p></td>
</tr>
<tr class="even">
<td>Security</td>
<td><ul>
<li>Basic Authentication</li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p>tokenNumber (string) - Token number.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/TokenService.html#delete-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">TokenService.delete<br />
</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
DELETE https://go.netlicensing.io/core/v2/rest/token/c6d36895-f2a7-497a-aad1-4290c1d17f40
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```html
HTTP/1.1 204 No Content
```
{: .ml-5 }

<div>Try it now</div>
{: .code-example .ml-5 .code-header }
```bash
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request DELETE https://go.netlicensing.io/core/v2/rest/token/c6d36895-f2a7-497a-aad1-4290c1d17f40
```
{: .ml-5 }
