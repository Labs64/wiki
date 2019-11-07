---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Utility Services </span>
===============================================

modified on 18-11-2018

-   [Licensing Models list](#UtilityServices-LicensingModelslist)
-   [License Types list](#UtilityServices-LicenseTypeslist)

### Licensing Models list

Return a list of all licensing models supported by the service.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/utility/licensingModels</p></td>
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

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/utility/licensingModels
Accept: application/xml
```

**Response**

``` theme:
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="LicensingModelProperties">
            <property name="name">TimeLimitedEvaluation</property>
        </item>
        <item type="LicensingModelProperties">
            <property name="name">FeatureWithTimeVolume</property>
        </item>
    </items>
</netlicensing>
```

**Try it now**

``` theme:
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/utility/licensingModels
$ curl --header "Accept: application/json" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/utility/licensingModels
```

### License Types list

Return a list of all license types supported by the service.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/utility/licenseTypes</p></td>
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

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

**Request**

``` theme:
GET https://go.netlicensing.io/core/v2/rest/utility/licenseTypes
Accept: application/xml
```

**Response**

``` theme:
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="LicenseType">
            <property name="name">FEATURE</property>
        </item>
        <item type="LicenseType">
            <property name="name">TIMEVOLUME</property>
        </item>
    </items>
</netlicensing>
```

**Try it now**

``` theme:
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/utility/licenseTypes
$ curl --header "Accept: application/json" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/utility/licenseTypes
```
