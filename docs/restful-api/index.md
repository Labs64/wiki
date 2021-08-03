---
layout: default
title: NetLicensing API (RESTful)
nav_order: 50
has_children: true
description: "NetLicensing RESTful API is for developers integrating NetLicensing with applications and administrators who want to script interactions with the NetLicensing server"
permalink: restful-api
---

NetLicensing API (RESTful)
==========================

This is the reference documentation for the RESTful API provided by NetLicensing. The NetLicensing API (RESTful) is for developers integrating NetLicensing with applications and administrators who want to script interactions with the NetLicensing server.

-   [Essentials](#essentials)
-   [Getting started](#getting-started)
-   [Services](#services)
-   [Structure of the RESTful URIs](#structure-of-the-restful-uris)
-   [Parameters](#parameters)
-   [Response](#response)
-   [Data Types](#data-types)
-   [Custom properties](#custom-properties)
-   [Links](#links)

Essentials
----------

[API services](services) cover all licensing aspects, allowing to fully automate your licensing flow, and/or integrate NetLicensing into your business processes: ERP, CRM or Webshop.

However, if you only need basic integration into your product, here is the shortcut to the two most essential NetLicensing RESTful API functions:

- [Validate](licensee-services#validate-licensee) - at a minimum, your product must call the validate method to retrieve the result of customer licenses validation.
- [Create Shop Token](token-services#create-token) - if you decided to use (optional) NetLicensing Shop, you need to create `SHOP` type token every time you want to start a shopping session for your customer, and redirect him to the returned `shopURL`.

Getting started
---------------

Since NetLicensing API (RESTful) is based on open standards, you can use any programming language to access the API; there are also lots of pre-built [client libraries](client-libraries) for interacting with NetLicensing.

Services
--------

NetLicensing exposes all available [services](services) functionality via an Application Programming Interface (API).

To access the API methods you will need a NetLicensing vendor account.
If you do not have one already, signup <a href="https://ui.netlicensing.io/#/register" class="external-link">here</a>.

Structure of the RESTful URIs
-----------------------------

NetLicensing API (RESTful) provide access to resources (data entities) via URI paths. To use a RESTful API, your application will make an HTTPS request and parse the response. The NetLicensing API (RESTful) uses <a href="https://en.wikipedia.org/wiki/JSON" class="external-link">JSON</a> or <a href="https://en.wikipedia.org/wiki/XML" class="external-link">XML</a> as its response format

    Use following request headers:
    Accept: application/json       # for JSON formatted responses
    Accept: application/xml        # for XML formatted responses

and the standard HTTP methods like GET, PUT, POST and DELETE (see endpoints documentation to find out which methods are supported by particular resource).

URIs for NetLicensing API (RESTful) resources have the following structure:

    https://<host>[:<port>]/core/v2/rest/<resource>[?<query>]

<span style="line-height: 1.4285715;">where:</span>

`<host>` - NetLicensing API host name - `go.netlicensing.io` Backup host name - `netlicensing.labs64.com`

`<port>` - NetLicensing API port, can be omitted, NetLicensing uses standard https port 443.

`<resource>` - represents named resource (e.g. product, license etc.), you'll find the resource name on the [services page](services) describing corresponding resource

`<query>` - parameters passed with the request (see below)

In case the requested resource does not exist, HTTP response with status code <a href="https://en.wikipedia.org/wiki/HTTP_403" class="external-link" target="_blank">404</a> will be returned.

Very rare, but it happens that top-level domain (TLD) DNS servers also have problems. In this case domain name can not be resolved to the IP address, rendering the service unavailable. TLD DNS is not under our control, and in case of problems there we can't influence recovery times. To ensure uninterruptible service even in this unlikely case, we provide a backup domain name for the NetLicensing API in another TLD: In case of DNS resolution error for `go.netlicensing.io`, retry your API request using `netlicensing.labs64.com` host name.

Parameters
----------

Resources may require additional input parameters, in which case
parameters must be passed as query string for GET and DELETE methods and
as a message body (payload) for POST and PUT.

Parameters are passed in '`key=value`' form, separated by '`&`' symbol.
When passed in a message body (for POST and PUT), it corresponds to
the <a href="https://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1" target="_blank" class="external-link">Form Encoded Data</a> format.
Use the following request header in this case:

    Content-Type: application/x-www-form-urlencoded 

Response
--------

Depending on the value passed in the [`Accept:`](#structure-of-the-restful-uris) field of the request header, NetLicensing will reply in *XML* or *JSON* format.
The structure of the response is documented in XML Schema Definition that can be downloaded at <a href="https://go.netlicensing.io/schema/context/netlicensing-context-2.1.xsd" class="external-link">https://go.netlicensing.io/schema/context/netlicensing-context-2.1.xsd</a>.

Data Types
----------

All values are transmitted over HTTPS in text form. The following table summarizes the text representation of non-trivial data types:

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><p>Type</p></th>
<th><p>Representation</p></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>Timestamp</p></td>
<td><p>Timestamps follow <a href="https://www.w3.org/TR/xmlschema-2/#isoformats" class="external-link">XML Schema Part 2: Datatypes Second Edition / D ISO 8601 Date and Time Formats</a>. On input it may be specified as date only (corresponds to <a href="https://www.w3.org/TR/xmlschema-2/#date" class="external-link">xsd:date</a>) or date + time (corresponds to <a href="https://www.w3.org/TR/xmlschema-2/#dateTime" class="external-link">xsd:dateTime</a>). On a java backend, <a href="https://docs.oracle.com/javase/7/docs/api/javax/xml/bind/DatatypeConverter.html" class="external-link">javax.xml.bind.DatatypeConverter</a> is used for conversion.</p></td>
</tr>
<tr class="even">
<td><p>Monetary</p></td>
<td><p>Always represented by two fields: decimal "price" and "currency" - 3-character code according to <a href="https://en.wikipedia.org/wiki/ISO_4217" class="external-link">ISO 4217</a>. Currently only "EUR" is supported.</p></td>
</tr>
</tbody>
</table>

Custom properties
-----------------

Besides standard properties defined for each entity type (see <a href="https://go.netlicensing.io/javadoc/v2/index.html" class="external-link">JavaDoc</a>), arbitrary custom properties can be added to entities. See [Custom Properties](custom-properties) for details.

Links
-----

-   List of HTTP status codes - <a href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes" class="external-link">https://en.wikipedia.org/wiki/List_of_HTTP_status_codes</a>
