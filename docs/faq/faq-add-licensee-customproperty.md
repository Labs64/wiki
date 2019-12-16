---
layout: post
title: How to add tags to the customer using RESTful API
parent: FAQ & Troubleshooting
nav_order: 100
description: "How to add tags/custom properties to the customer using NetLicensing RESTful API"
permalink: faq-add-licensee-customproperty
---

{{ page.title }}
=============

## Question

How the additional tags/custom properties can be added to the Customer (Licensee) using RESTful API?

## Answer

Any NetLicensing entity attribute, such as reserved attributes (name, number, etc.) and optional tags can be added same way.
Use `application/x-www-form-urlencoded` key/value parameters in the POST request body.

Following sample CURL request (*demo:demo*) showcase this.

<div>Request</div>
{: .code-example .ml-5 .code-header }
```shell
$ curl -X POST --header 'Content-Type: application/x-www-form-urlencoded' --header 'Accept: application/xml' --header 'Authorization: Basic ZGVtbzpkZW1v' -d 'name=Customer%2001&contact=customer01%40labs64.com' 'https://go.netlicensing.io/core/v2/rest/licensee/CUST-01' | xmllint --format -
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
      <ns2:property name="number">CUST-01</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="productNumber">P9SKGVUVV</ns2:property>
      <ns2:property name="contact">customer01@labs64.com</ns2:property>
      <ns2:property name="name">Customer 01</ns2:property>
      <ns2:property name="markedForTransfer">false</ns2:property>
      <ns2:property name="inUse">true</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }
