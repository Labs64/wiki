---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Quota </span>
====================================

modified on 11-03-2018

-   [Overview](#Quota-Overview)
-   [License templates](#Quota-Licensetemplates)
-   [Licenses](#Quota-Licenses)
-   [Validation](#Quota-Validation)

Overview
========

**Quota** licensing model <span style="color: rgb(0,0,0);">authorizes
the use of a product (or an aspect of the product) within the licensed
limit (quota), which is expressed as integer value. The value may
represent any resource, here are some examples:</span>

-   <span style="color: rgb(0,0,0);">Number of active users</span>
-   <span style="color: rgb(0,0,0);">Number of documents</span>
-   <span style="color: rgb(0,0,0);">Storage capacity</span>
-   <span style="color: rgb(0,0,0);">Amount of allocated memory</span>
-   <span style="color: rgb(0,0,0);">Network throughput</span>
-   <span style="color: rgb(0,0,0);">Number of request per day</span>
-   <span style="color: rgb(0,0,0);">... you name it</span>

<span style="color: rgb(0,0,0);">  
</span>

<span style="color: rgb(0,0,0);">Quota is just a fixed number, it
doesn't change from validation to validation, but will change when user
acquires new licenses or licenses get activated/deactivated via
NetLicensing API / Console. As a vendor, you keep control of the
quota.</span>

<span style="color: rgb(0,0,0);">Reported quota is a sum of quotas of
all active licenses at the time of validation. Value '-1' indicates
unlimited quota. In case an active license exists with quota '-1',
overall quota is also '-1', regardless of other licenses.</span>

License templates
=================

This licensing model requires one or more license templates of type
QUANTITY, each specifying a quota (via 'quantity' property) and a
purchase price. By configuring multiple license templates, one can build
volume discounts, e.g. if quota is applied to the number of allowed
users, you can offer:

-   10 users for 5 EUR
-   100 users for 45 EUR
-   1000 users for 400 EUR

Required additional properties specific to the QUANTITY [license
templates](https://www.labs64.de/confluence/display/NLICPUB/NetLicensing+Object+Model):

-   Integer **quantity** - specifies the quota allowed by the licenses
    created off this template. Positive integer, or '-1' for unlimited
    quota.

Licenses
========

According to the license templates, QUANTITY licenses define a quota via
its 'quantity' property.

Required additional properties specific to
the QUANTITY [licenses](https://www.labs64.de/confluence/display/NLICPUB/NetLicensing+Object+Model):

-   Integer **quantity** - specifies the quota allowed by the license.
    Positive integer, or '-1' for unlimited quota. Normally it is copied
    from the corresponding license template, but can be changed later
    for each license individually. When multiple QUANTITY licenses
    purchased, the total quota is the sum of **quantity** of all active
    licenses, or '-1' if any active license has **quantity** '-1'.

Validation
==========

On validation, this licensing model does not require any [validate
parameters](https://www.labs64.de/confluence/display/NLICPUB/Licensee+Services).

Validation returns following values, specific to **Quota** licensing
model:

-   Boolean **valid** - **true** if quota is positive or '-1'
    (unlimited). **false** if total quota = 0
-   Integer **quota** - total quota, '-1' for unlimited

Validation response example:

``` theme:
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context" ttl="2018-03-12T19:56:47.297Z">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="ProductModuleValidation">
      <ns2:property name="productModuleNumber">Mq-DEMO</ns2:property>
      <ns2:property name="valid">true</ns2:property>
      <ns2:property name="productModuleName">Module licensed under Quota licensing model</ns2:property>
      <ns2:property name="quota">35</ns2:property>
      <ns2:property name="licensingModel">Quota</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
 
```

 

 
