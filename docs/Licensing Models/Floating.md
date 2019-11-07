---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Floating </span>
=======================================

modified on 30-01-2018

-   [Overview](#Floating-Overview)
-   [License templates](#Floating-Licensetemplates)
-   [Licenses](#Floating-Licenses)
-   [Validation](#Floating-Validation)

Overview
========

**Floating** licensing model <span style="color: rgb(0,0,0);">authorizes
the use of an application with the given number of sessions (users,
hosts, etc.). The number of concurrent sessions is tracked, and the
total number of running sessions of the licensed application at any time
is limited by the maximum allowed sessions in the floating licenses
purchased by the licensee.</span>

<span style="color: rgb(0,0,0);">Session is acquired by checkout
operation and returned back to the pool by subsequent checkin. Maximum
checkout validity time is limited by the product module
parameter:</span>

-   <span style="color: rgb(0,0,0);">Integer **maxCheckoutValidity** -
    floating license maximum checkout validity, in seconds ("<span
    style="color: rgb(0,0,0);">Maximum checkout validity" in
    <a href="https://go.netlicensing.io/console/v2/" class="external-link">NetLicensing Management Console</a> /
    product module edit form)</span></span>

<span style="color: rgb(0,0,0);">Validity can be extended as long as
needed by subsequent checkouts before the expiration time.</span>

License templates
=================

This licensing model requires one or more license templates of type
FLOATING, each specifying a number of sessions and a purchase price. By
configuring multiple license templates, one can build volume discounts,
e.g.:

-   10 sessions for 5 EUR
-   100 sessions for 45 EUR
-   1000 sessions for 400 EUR

Required additional properties specific to the FLOATING [license
templates](https://www.labs64.de/confluence/display/NLICPUB/NetLicensing+Object+Model):

-   Integer **maxSessions** - specifies the maximum number of sessions
    allowed concurrently per license.

Licenses
========

Required additional properties specific to the
FLOATING [licenses](https://www.labs64.de/confluence/display/NLICPUB/NetLicensing+Object+Model):

-   Integer **maxSessions** - specifies the maximum number of sessions
    allowed concurrently per license. Normally it is copied from the
    corresponding license template, but can be changed later for each
    license individually. When multiple FLOATING licenses purchased, the
    total number of concurrently allowed sessions is the sum
    of **maxSessions** of all active licenses.

Besides, every session that is checked out is listed as

-   Timestamp **sessionId\_**\<sessionId\>

custom property. Session can be forcibly checked in on demand by
removing the corresponding **sessionId\_\*** property.

Validation
==========

On validation, this licensing model requires [validate
parameters](Licensee-Services_11010217.html):

-   **productModuleNumberN**=\<<span
    class="error">productModuleNumber\></span>
-   **sessionIdN**=\<sessionId\>  
    \<sessionId\> is any string that identifies the session uniquely. It
    is similar to the [licenseeNumber](Glossary_11010236.html)
-   **actionN**=\<action\>  
    \<action\> is one of:
    -   **checkOut** - check out a session and assign it an identifier
        \<sessionId\>. If session with given identifier already checked
        out, its validity extended.
    -   **checkIn** - check in session with identifier \<sessionId\>,
        returning it to the pool of available sessions.

Validation returns values:

-   Boolean **valid** - **true** if action is **checkOut** and operation
    succeeds, hence the product use is allowed. **false** on not
    successful checkout or when action is **checkIn**.
-   [Timestamp](https://www.labs64.de/confluence/pages/viewpage.action?pageId=11010215#NetLicensingAPI(RESTful)-DataTypes) **expires **-
    on successful checkout, provides the point in time until checkout is
    valid.

Validation response examples:

-   <span style="line-height: 1.4285715;">checkOut:  
    </span>

    **Request**

    ``` theme:
    POST https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
    Accept: application/xml
    Content-Type: application/x-www-form-urlencoded

    productModuleNumber0=Floating-DEMO&sessionId0=SampleSessionId&action0=checkOut
    ```

    <span style="line-height: 1.4285715;">  
    </span>

    **Response**

    ``` theme:
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
        <infos/>
        <items>
            <item type="ProductModuleValidation">
                <property name="productModuleNumber">Floating-DEMO</property>
                <property name="valid">true</property>
                <property name="licensingModel">Floating</property>
                <property name="expires">2015-05-04T16:03:30.032Z</property>
                <property name="productModuleName">Floating LM demo module</property>
            </item>
        </items>
    </netlicensing>
    ```

<!-- -->

-   checkIn:

    **Request**

    ``` theme:
    POST https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
    Accept: application/xml
    Content-Type: application/x-www-form-urlencoded

    productModuleNumber0=Floating-DEMO&sessionId0=SampleSessionId&action0=checkIn
    ```

    **Response**

    ``` theme:
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
        <infos/>
        <items>
            <item type="ProductModuleValidation">
                <property name="productModuleNumber">Floating-DEMO</property>
                <property name="valid">false</property>
                <property name="licensingModel">Floating</property>
                <property name="productModuleName">Floating LM demo module</property>
            </item>
        </items>
    </netlicensing>
    ```

 
