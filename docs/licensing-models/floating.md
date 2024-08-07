---
layout: default
title: Floating
nav_order: 70
parent: Licensing Models
description: "Floating / Concurrent licensing model authorizes the use of an application with the given number of sessions"
permalink: floating
---

{{ page.title }}
========

-   [Overview](#overview)
-   [License templates](#license-templates)
-   [Licenses](#licenses)
-   [Validation](#validation)

Overview
--------

**Floating** licensing model authorizes the use of an application with the given number of sessions (users, hosts, etc.). The number of concurrent sessions is tracked, and the total number of running sessions of the licensed application at any time is limited by the maximum allowed sessions in the floating licenses purchased by the licensee.

Session is acquired by checkout operation and returned back to the pool by subsequent checkin. Maximum checkout validity time is limited by the product module parameter:

-   `Integer` **`maxCheckoutValidity`** - floating license maximum checkout validity, in seconds ("Maximum checkout validity" in <a href="https://l64.cc/nlUI" class="external-link">NetLicensing Management Console</a> / product module edit form)

Validity can be extended as long as needed by subsequent checkouts before the expiration time.

License templates
-----------------

This licensing model requires one or more license templates of type FLOATING, each specifying a number of sessions and a purchase price. By configuring multiple license templates, one can build volume discounts, e.g.:

-   10 sessions for 5 EUR
-   100 sessions for 45 EUR
-   1000 sessions for 400 EUR

Required additional properties specific to the FLOATING [license templates](object-model#license-template):

-   `Integer` **`maxSessions`** - specifies the maximum number of sessions allowed concurrently per license.

Licenses
--------

Required additional properties specific to the FLOATING [licenses](object-model#license):

-   `Integer` **`maxSessions`** - specifies the maximum number of sessions allowed concurrently per license. Normally it is copied from the corresponding license template, but can be changed later for each license individually. When multiple FLOATING licenses purchased, the total number of concurrently allowed sessions is the sum of **`maxSessions`** of all active licenses.

Besides, every session that is checked out is listed as

-   [`Timestamp`](restful-api#data-types) **`sessionId_<sessionId>`** custom property. Session can be forcibly checked in on demand by removing the corresponding **`sessionId_<sessionId>`** property.

**Please Note:** NetLicensing services and client libraries do not include session ID or fingerprint generation capabilities. It is the responsibility of the vendor to create a unique session identifier. For guidance, please refer to the best practices for [generating machine IDs and fingerprints](faq-how-to-generate-machine-fingerprint#machine-id--fingerprint-libraries).


Validation
----------

### Validation parameters:

On validation, this licensing model requires the following [validate parameters](licensee-services#validate-licensee):

-   **`productModuleNumberN=<productModuleNumber>`**
-   **`sessionIdN=<sessionId>`** `<sessionId>` is any string that identifies the session uniquely. It is similar to the [licenseeNumber](glossary), but for the session.
-   **`actionN=<action>`** `<action>` is one of:
    -   **`checkOut`** - check out a session and assign it an identifier `<sessionId>`. If session with given identifier already checked out, its validity extended.
    -   **`checkIn`** - check in session with identifier `<sessionId>`, returning it to the pool of available sessions.

To modify the "maxCheckoutValidity" module parameter, simply include the following:
-   **`maxCheckoutValidityN=<maxCheckoutValidity>`** `<maxCheckoutValidity>` - This value represents the desired floating license maximum checkout validity, specified in seconds.

### Validation returns values:

-   `Boolean` **`valid`** - **`true`** if action is **`checkOut`** and operation succeeds, hence the product use is allowed. **`false`** on not successful checkout or when action is **`checkIn`**.
-   [`Timestamp`](restful-api#data-types) **`expirationTimestamp`** - on successful checkout, provides the point in time until checkout is valid.

### Validation response examples:
-   **checkOut:**
<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
Accept: application/xml
Content-Type: application/x-www-form-urlencoded

productModuleNumber0=Floating-DEMO&sessionId0=SampleSessionId&action0=checkOut
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context" ttl="2020-05-04T16:03:30.032Z">
    <infos/>
    <items>
        <item type="ProductModuleValidation">
            <property name="productModuleNumber">Floating-DEMO</property>
            <property name="valid">true</property>
            <property name="licensingModel">Floating</property>
            <property name="expirationTimestamp">2020-05-04T16:03:30.032Z</property>
            <property name="productModuleName">Floating LM demo module</property>
        </item>
    </items>
</netlicensing>
```
{: .ml-5 }

-   **checkIn:**
<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
Accept: application/xml
Content-Type: application/x-www-form-urlencoded

productModuleNumber0=Floating-DEMO&sessionId0=SampleSessionId&action0=checkIn
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
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
{: .ml-5 }

Warning Levels
--------------

Below are the default [warning levels](warning-level) associated with this licensing model.

| GREEN | YELLOW | RED |
|:------|:-------|:----|
| sessionsUsed < 80% | sessionsTotal < 10 AND sessionsUsed >= sessionsTotal<br>OR<br>sessionsUsed >= 80% | sessionsTotal >= 10<br>AND<br>sessionsUsed >= sessionsTotal |
