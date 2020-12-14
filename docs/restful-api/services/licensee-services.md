---
layout: default
title: Licensee Services
parent: Services
grand_parent: NetLicensing API (RESTful)
nav_order: 40
description: "Licensee Services"
permalink: licensee-services
---

Licensee Services
=================

-   [Licensees list](#licensees-list)
-   [Get licensee](#get-licensee)
-   [Create licensee](#create-licensee)
-   [Update licensee](#update-licensee)
-   [Delete licensee](#delete-licensee)
-   **[Validate licensee](#validate-licensee)**
-   [Transfer licenses](#transfer-licenses)

### Licensees list

Return a list of all licensees for the current vendor.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/licensee</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseeService.html#list-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">LicenseeService.list</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/licensee
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Licensee">
            <property name="number">I001</property>
            <property name="active">true</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```
{: .ml-5 }

### Get licensee

Return a licensee by licenseeNumber.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/licensee/{licenseeNumber}</p></td>
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
<td><p>licenseeNumber (string) - Licensee number.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseeService.html#get-com.labs64.netlicensing.domain.vo.Context-java.lang.String-" class="external-link">LicenseeService.get</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/licensee/I001
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Licensee">
            <property name="number">I001</property>
            <property name="active">true</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```
{: .ml-5 }

### Create licensee

Creates a new licensee.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/licensee</p></td>
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
<td><p><span style="color: rgb(0,0,0);">productNumber (string) - </span>productNumber to assign new licensee object.</p>
<p>number (string) - Unique number (across all products of a vendor) that identifies the licensee. Vendor can assign this number when creating a licensee or let NetLicensing generate one. Read-only after creation of the first license for the licensee. Optional.</p>
<p>active (boolean) - If set to false, the licensee is disabled. Licensee can not obtain new licenses, and validation is disabled (tbd).</p>
<p>name (string) - Licensee name. Optional.</p>
<p><span style="color: rgb(80,80,80);">licenseeSecret (string) - L<span>icensee Secret for this licensee <span>(</span><img src="assets/images/icons/emoticons/information.png" alt="(info)" class="emoticon emoticon-information" /><span> available in selected pricing plans)</span>. </span>Optional. <img src="assets/images/icons/emoticons/warning.png" alt="(warning)" class="emoticon emoticon-warning" /><span> </span><em>Deprecated, use <a href="node-locked">Node-Locked Licensing Model</a> instead.</em></span></p>
<p><span style="color: rgb(80,80,80);"><span style="color: rgb(34,34,34);">markedForTransfer (boolean) - Mark licensee for transfer. <span style="color: rgb(80,80,80);">Optional.</span></span></span></p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseeService.html#create-com.labs64.netlicensing.domain.vo.Context-java.lang.String-com.labs64.netlicensing.domain.entity.Licensee-" class="external-link">LicenseeService.create</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee
productNumber=PQVJQ5F7H&number=I762LBSSX&active=false
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Licensee">
            <property name="number">I762LBSSX</property>
            <property name="active">false</property>
            <property name="productNumber">PQVJQ5F7H</property>
        </item>
    </items>
</netlicensing>
```
{: .ml-5 }

### Update licensee

Sets the provided properties to a licensee. Return an updated licensee.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/licensee/{licenseeNumber}</p></td>
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
<td><p>licenseeNumber (string) - Licensee number.</p>
<p>number (string) - Unique number (across all products of a vendor) that identifies the licensee. Vendor can assign this number when creating a licensee or let NetLicensing generate one. Read-only after creation of the first license for the licensee. Optional.</p>
<p>active (boolean) - If set to false, the licensee is disabled. Licensee can not obtain new licenses, and validation is disabled (tbd). Optional.</p>
<p>name (string) - Licensee name. Optional.</p>
<p><span style="color: rgb(80,80,80);">licenseeSecret (string) - L</span><span style="color: rgb(80,80,80);">icensee Secret for licensee <span style="color: rgb(80,80,80);">(</span><img src="assets/images/icons/emoticons/information.png" alt="(info)" class="emoticon emoticon-information" /><span style="color: rgb(80,80,80);"> available in selected pricing plans)</span>. </span><span style="color: rgb(80,80,80);">Optional.<span style="color: rgb(80,80,80);"> </span><img src="assets/images/icons/emoticons/warning.png" alt="(warning)" class="emoticon emoticon-warning" /><span style="color: rgb(80,80,80);"> </span><em>Deprecated, use <a href="node-locked">Node-Locked Licensing Model</a> instead.</em></span></p>
<p><span style="color: rgb(80,80,80);"><span style="color: rgb(34,34,34);">markedForTransfer (boolean) - Mark licensee for transfer. </span><span>Optional.</span></span></p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseeService.html#update-com.labs64.netlicensing.domain.vo.Context-java.lang.String-com.labs64.netlicensing.domain.entity.Licensee-" class="external-link">LicenseeService.update</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee/IUI6MYNIC
number=IP53OX9PF&active=false&custLcseeProp2=custLcseePropVal2&custLcseeProp=custLcseePropValChanged
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Licensee">
            <property name="number">IP53OX9PF</property>
            <property name="active">false</property>
            <property name="productNumber">PJIF898SP</property>
            <property name="custLcseeProp">custLcseePropValChanged</property>
            <property name="custLcseeProp2">custLcseePropVal2</property>
        </item>
    </items>
</netlicensing>
```
{: .ml-5 }

### Delete licensee

Delete a licensee by number.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>DELETE /core/v2/rest/licensee/{licenseeNumber}?forceCascade</p></td>
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
<td><p>licenseeNumber (string) - Licensee number.</p>
<p>forceCascade (boolean) - Force object deletion and all descendants.</p></td>
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
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseeService.html#delete-com.labs64.netlicensing.domain.vo.Context-java.lang.String-boolean-" class="external-link">LicenseeService.delete</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
DELETE https://go.netlicensing.io/core/v2/rest/licensee/I001
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```html
HTTP/1.1 204 No Content
```
{: .ml-5 }

### Validate licensee

Validates active licenses of the licensee.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/licensee/{licenseeNumber}/validate</p></td>
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
<li><p>ROLE_APIKEY_LICENSEE</p></li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p>
<p>Content-Type: application/x-www-form-urlencoded</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p><em>licenseeNumber (string)</em> - licensee number with a maximum length of 1000 characters<br />
<em>productNumber (string) (optional)</em> - product number, must be provided when "licensee auto-create" is enabled (see also <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/Product.html" class="external-link">Product</a> JavaDoc). Identifies the product to which new licensee should be added.<br />
<em>licenseeName (string) (optional)</em> - human-readable name for the auto-created licensee (will be set as custom Licensee property)<br />
<em><del>licenseeSecret</del> (deprecated) (string) (optional)</em> - when provided and licensee secret enabled, will enable the licensee secret logic as described in <a href="licensee-secret">Licensee Secret (deprecated)</a></p>
<p>Some product modules (depending on the licensing model) may require parameters passed on validate. Parameters to the product modules are passed using the following format:</p>
<p><em>productModuleNumber0 (string)</em> - product module 0 number<em><br />
&lt;pmParam1&gt;0</em> <em>(any)</em> - product module 0 parameter "&lt;pmParam1&gt;"<em><br />
&lt;pmParam2&gt;0 <em>(any)</em></em> - product module 0 parameter "&lt;pmParam2&gt;"<em><br />
<em>...<br />
productModuleNumber1 (string)</em></em> - product module 1 number<em><br />
<em>&lt;pmParam1&gt;1 <em>(any)</em></em></em> - product module 1 parameter "&lt;pmParam1&gt;"<br />
<em>...<br />
productModuleNumber&lt;N&gt; (string)</em> - product module N number<br />
<em>&lt;pmParam1&gt;&lt;N&gt; <em>(any)</em></em> - product module N parameter "&lt;pmParam1&gt;"<br />
<em>...</em></p>
<p>Notes:</p>
<ul>
<li>&lt;N&gt; is 0-based decimal number incremented for every product module that receives parameters.</li>
<li>Order of product modules is not important.</li>
<li>For the &lt;pmParamX&gt; documentation refer to the corresponding <a href="licensing-models">licensing model</a>.</li>
</ul></td>
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

<span class="s1">To use NetLicnesing effectively, validation must be
up-to-date. On the other hand, performing validation requests too
frequently will make response time of your service longer and create
unnecessary load on the NetLicensing servers. Therefore it is
recommended to keep last validation result on the client side and reuse
it for a certain period for repeated validation requests. To determine
the maximum validity duration of the validation response, NetLicensing
returns an additional value with the validation response that is called
„ttl“: it is the expiration timestamp of this validation response
in <a href="https://en.wikipedia.org/wiki/ISO_8601" class="external-link"><span class="s2">ISO 8601</span></a> format.</span>

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseeService.html#validate-com.labs64.netlicensing.domain.vo.Context-java.lang.String-java.lang.String-java.lang.String-com.labs64.netlicensing.domain.vo.ValidationParameters-com.labs64.netlicensing.domain.vo.MetaInfo...-" class="external-link">LicenseeService.validate</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context" ttl="2015-11-03T15:02:36.137Z">
  <items>
    <item type="ProductModuleValidation">
      <property name="productModuleNumber">M011</property>
      <property name="productModuleName">Terminal Devices</property>
      <property name="licensingModel">Rental</property>
      <list name="L011">
        <property name="valid">false</property>
      </list>
      <list name="L012">
        <property name="valid">false</property>
      </list>
    </item>
  </items>
</netlicensing>
```
{: .ml-5 }

<div>Try it now</div>
{: .code-example .ml-5 .code-header }
```bash
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request POST https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
```
{: .ml-5 }

<img src="assets/images/icons/emoticons/warning.png" alt="(tick)" class="emoticon emoticon-tick" /> <strong>Please Note:</strong> HTTP method **GET** is **deprecated** for licensee validate.

If you use RESTful API directly in your code, ensure to replace GET with POST for validate. GET method will be removed in one of the future releases, until then you'll get the following warning if using GET:

<span class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span class="expand-control-text">Warning message</span>

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context" ttl="2017-04-04T10:31:45.400Z">
  <ns2:infos>
        <ns2:info id="methodIsDeprecated" type="warning">'GET' method for licensee validate is deprecated, use 'POST' instead</ns2:info>
  </ns2:infos>
  <items>
    <item type="ProductModuleValidation">
      <property name="productModuleNumber">M011</property>
      <property name="productModuleName">Terminal Devices</property>
      <property name="licensingModel">Rental</property>
      <list name="L011">
        <property name="valid">false</property>
      </list>
      <list name="L012">
        <property name="valid">false</property>
      </list>
    </item>
  </items>
</netlicensing>
```
{: .ml-5 }

If using NetLicensing client library - update to the newest version.

Besides, new features associated with the validate method will not be available when called using GET.

<img src="assets/images/icons/emoticons/warning.png" alt="(tick)" class="emoticon emoticon-tick" /> <strong>Please Note:</strong> Below specification for the GET method is only present here to help migrating from old code, please <strong>don't use GET method for validate, use POST instead</strong> ([see above](#validate-licensee))!

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>GET /core/v2/rest/licensee/{licenseeNumber}/validate[?productNumber={productNumber}&amp;licenseeName={licenseeName}]</p></td>
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
<li><p>ROLE_APIKEY_LICENSEE</p></li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p><em>licenseeNumber (string)</em> - licensee number with a maximum length of 1000 characters<br />
<em>productNumber (string) (optional)</em> - product number, must be provided when "licensee auto-create" is enabled (see also <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/Product.html" class="external-link">Product</a> JavaDoc). Identifies the product to which new licensee should be added.<br />
<em>licenseeName (string) (optional)</em> - human-readable name for the auto-created licensee (will be set as custom Licensee property)<br />
<em>licenseeSecret (string) (optional)</em> - when provided and licensee secret enabled, will enable the licensee secret logic as described in <a href="licensee-secret">Licensee Secret (deprecated)</a></p>
<p>Some product modules (depending on the licensing model) may require parameters passed on validate. Parameters to the product modules are passed using the following format:</p>
<p><em>productModuleNumber0 (string)</em> - product module 0 number<em><br />
&lt;pmParam1&gt;0</em> <em>(any)</em> - product module 0 parameter "&lt;pmParam1&gt;"<em><br />
&lt;pmParam2&gt;0 <em>(any)</em></em> - product module 0 parameter "&lt;pmParam2&gt;"<em><br />
<em>...<br />
productModuleNumber1 (string)</em></em> - product module 1 number<em><br />
<em>&lt;pmParam1&gt;1 <em>(any)</em></em></em> - product module 1 parameter "&lt;pmParam1&gt;"<br />
<em>...<br />
productModuleNumber&lt;N&gt; (string)</em> - product module N number<br />
<em>&lt;pmParam1&gt;&lt;N&gt; <em>(any)</em></em> - product module N parameter "&lt;pmParam1&gt;"<br />
<em>...</em></p>
<p>Notes:</p>
<ul>
<li>&lt;N&gt; is 0-based decimal number incremented for every product module that receives parameters.</li>
<li>Order of product modules is not important.</li>
<li>For the &lt;pmParamX&gt; documentation refer to the corresponding <a href="licensing-models">licensing model</a>.</li>
</ul></td>
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
GET https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context" ttl="2015-11-03T15:02:36.137Z">
  <items>
    <item type="ProductModuleValidation">
      <property name="productModuleNumber">M011</property>
      <property name="productModuleName">Terminal Devices</property>
      <property name="licensingModel">Rental</property>
      <list name="L011">
        <property name="valid">false</property>
      </list>
      <list name="L012">
        <property name="valid">false</property>
      </list>
    </item>
  </items>
</netlicensing>
```
{: .ml-5 }

<div>Try it now</div>
{: .code-example .ml-5 .code-header }
```bash
$ curl --header "Accept: application/xml" --insecure --user demo:demo --request GET https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
```
{: .ml-5 }
 

### Transfer licenses

Transfer licenses between licensees.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>HTTP Method / URL</p></td>
<td><p>POST /core/v2/rest/licensee/{licenseeNumber}/transfer</p></td>
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
<li><p>ROLE_APIKEY_LICENSEE</p></li>
</ul></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>Request Header</p></td>
<td><p>Accept: application/json | application/xml</p></td>
</tr>
<tr class="even">
<td><p>Request Parameters</p></td>
<td><p><em>licenseeNumber (string)</em> - the number of licensee receiving licenses (max length: 1000 characters) - target</p>
<p><em><span style="color: rgb(0,0,0);">sourceLicensee</span>Number (string)</em> - the number of (temporary) licensee transferring its licenses (max length: 1000 characters) - source</p></td>
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

The following prerequisites must be fulfilled:

-   Licensees with *sourceLicenseeNumber* and *licenseeNumber* must be assigned to the same product
-   Source licensee must be marked for transfer (licensee [custom property](custom-properties) *markedForTransfer* must be set to `true`)

See also
JavaDoc: <a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/service/LicenseeService.html#transfer-com.labs64.netlicensing.domain.vo.Context-java.lang.String-java.lang.String-" class="external-link">LicenseeService.transfer</a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Example</span>

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee/I011/transfer
sourceLicenseeNumber=ISourceLicensee
Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
HTTP/1.1 204 No Content
```
{: .ml-5 }

<div>Try it now</div>
{: .code-example .ml-5 .code-header }
```bash
$ curl -X POST --header 'Content-Type: application/x-www-form-urlencoded' --header 'Accept: application/xml' --header 'Authorization: Basic ZGVtbzpkZW1v' -d 'sourceLicenseeNumber=ISourceLicensee' 'https://go.netlicensing.io/core/v2/rest/licensee/I011/transfer'
```
{: .ml-5 }
