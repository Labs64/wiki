---
layout: default
title: Aliases
parent: NetLicensing API (RESTful)
nav_order: 40
description: "Aliases allow you to add alternative unique identifiers (one or more) to the Licensee entity."
permalink: aliases
---

Aliases
=======

-   [Add aliases](#add-aliases)
-   [Retrieve aliases](#retrieve-aliases)
-   [Validate using aliases](#validate-using-aliases)

Aliases allow you to add alternative unique identifiers (one or more) to the Licensee entity.

This may be useful in the following use cases:
- Additionally to the customer number (auto-generated or obtained from the internal systems, such as CRM), specify customer-friendly and memorable customer identifier
- Specify the list of named users, which may use the system on behalf of the given customer (e.g. class students list, department employees, etc.)

<a href="assets/images/customer-aliases.png" class="imagelink" data-lightbox="aliases" data-title="Customer's Aliases" data-alt="Customer's Aliases">
    <img src="assets/images/customer-aliases.png" alt="Customer's Aliases" />
</a>

Aliases can be set or retrieved using custom property `aliases`.

### Add aliases

To add or modify aliases on customer [create](licensee-services#create-licensee) or [update](licensee-services#update-licensee), include `aliases` property together with other properties as POST method parameter:

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee/DEMO-CUST-01

...&aliases=%5B%22alias1%22%2C%22alias2%22%5D <== URI encoded JSON array; e.g. ["alias1","alias2"]

Accept: application/xml
Content-Type: application/x-www-form-urlencoded
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="Licensee">
      <ns2:property name="number">DEMO-CUST-01</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="productNumber">DEMO-PRD</ns2:property>
      <ns2:property name="aliases">["alias1","alias2"]</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }

### Retrieve aliases

Customer's aliases can be retrieved using [get](licensee-services#get-licensee) or [list](licensee-services#licensees-list) methods.

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
GET https://go.netlicensing.io/core/v2/rest/licensee{/DEMO-CUST-01}
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="Licensee">
      <ns2:property name="number">DEMO-CUST-01</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="productNumber">DEMO-PRD</ns2:property>
      <ns2:property name="aliases">["alias1","alias2"]</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }

### Validate using aliases

Customer can be now [validated](licensee-services#validate-licensee) either via its unique `licenseeNumber` or one of the defined aliases.

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee/alias1/validate
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context" ttl="2022-02-08T16:56:03.376Z">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="ProductModuleValidation">
      <ns2:property name="valid">true</ns2:property>
      <ns2:property name="expires">2023-01-01T01:02:03.004Z</ns2:property>
      <ns2:property name="productModuleNumber">DEMO-MODULE</ns2:property>
      <ns2:property name="productModuleName">ABO</ns2:property>
      <ns2:property name="warningLevel">GREEN</ns2:property>
      <ns2:property name="licensingModel">Subscription</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }
