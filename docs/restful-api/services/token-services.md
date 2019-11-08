---
layout: default
title: Token Services
parent: Services
grand_parent: NetLicensing API (RESTful)
nav_order: 99
description: "Token Services"
permalink: token-services
---

Token Services
==============

-   [Tokens list](#TokenServices-Tokenslist)
-   [Get token](#TokenServices-Gettoken)
-   [Create token](#TokenServices-Createtoken)
-   [Delete token](#TokenServices-Deletetoken)

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

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/token
Accept: application/xml
```

**Response**

``` theme:
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

**Try it now**

``` theme:
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/token
```

 

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

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/token/a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
Accept: application/xml
```

**Response**

``` theme:
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

**Try it now**

``` theme:
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/token/a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
```

 

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
<li><a href="https://www.labs64.de/confluence/display/NLICPUB/Security">API Key Identification</a> (<span>Only for tokenType=SHOP)</span>
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
<td><p>tokenType (enum) - Token type to be generated<br />
- DEFAULT - default one-time token (will be expired after first request)<br />
- SHOP       - shop token is used to redirect customer to the netlicensingShop<br />
                   (licenseeNumber is mandatory)</p>
<p>- APIKEY - APIKey-token</p>
<p><br />
licenseeNumber (string) - Only for tokenType=SHOP; identifies licensee that will be assigned to the shop token.</p>
<p>successURL (URI) - Take customers to this URL when they finish checkout.</p>
<p>successURLTitle (string) - Shop link title for successful checkout process.</p>
<p>cancelURL (URI) - Take customers to this URL when they cancel their checkout.</p>
<p>cancelURLTitle (string) - Shop link title for cancel checkout process.</p>
<p>apiKeyRole (string) - RoleID (see <a href="Security_14942718.html">Security</a>). Only for tokenType=APIKEY.</p></td>
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

**Request**

``` theme:
POST https://go.netlicensing.io/core/v2/rest/token
tokenType=SHOP&licenseeNumber=I001-DEMO
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```

**Response**

``` theme:
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

**Try it now**

``` theme:
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request POST https://go.netlicensing.io/core/v2/rest/token --data "tokenType=SHOP&licenseeNumber=I001-DEMO"
```

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

**Request**

``` theme:
DELETE https://go.netlicensing.io/core/v2/rest/token/c6d36895-f2a7-497a-aad1-4290c1d17f40
Accept: application/xml
```

**Response**

``` theme:
HTTP/1.1 204 No Content
```

**Try it now**

``` theme:
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request DELETE https://go.netlicensing.io/core/v2/rest/token/c6d36895-f2a7-497a-aad1-4290c1d17f40
```
