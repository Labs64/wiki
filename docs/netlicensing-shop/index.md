---
layout: default
title: NetLicensing Shop
nav_order: 70
has_children: true
has_toc: false
description: "NetLicensing Shop provides a seamless online purchase experience, aligned with deployed licensing models."
permalink: netlicensing-shop
---

NetLicensing Shop
=================

While using NetLicensing Shop you need to create Shop Token and provide `shopURL` in the UI of your product or forward the user to NetLicensing Shop URL by other means.

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/token
tokenType=SHOP&licenseeNumber=%LICENSEE_NUMBER%
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
        <ns2:item type="Token">
            <ns2:property name="number">976bde51-0014-4e2a-b97e-08ede6604054</ns2:property>
            <ns2:property name="active">true</ns2:property>
            <ns2:property name="expirationTime">2022-04-20T21:51:05.293Z</ns2:property>
            <ns2:property name="tokenType">SHOP</ns2:property>
            <ns2:property name="shopURL">https://go.netlicensing.io/shop/v2/?shoptoken=976bde51-0014-4e2a-b97e-08ede6604054</ns2:property>
            <ns2:property name="cancelURL">https://netlicensing.io/#cancel</ns2:property>
            <ns2:property name="successURL">https://netlicensing.io/#success</ns2:property>
            <ns2:property name="successURLTitle">Return to netlicensing.io</ns2:property>
            <ns2:property name="cancelURLTitle">Cancel and return to netlicensing.io</ns2:property>
            <ns2:property name="licenseeNumber">CUST-API-KEY-SIGN-01</ns2:property>
            <ns2:property name="vendorNumber">VDEMO</ns2:property>
        </ns2:item>
    </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }
