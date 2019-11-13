---
layout: default
title: Try & Buy
parent: Licensing Models
nav_order: 10
description: "Try & Buy"
permalink: try-n-buy
---

Try & Buy
=========

-   [Overview](#overview)
-   [License templates](#license-templates)
-   [Validation](#validation)

Overview
--------

**Try & Buy** licensing model reflects a very common scenario when a
product is first provided free of charge in demo or evaluation mode for
a limited period of time. After evaluation time has expired, the product
use in evaluation mode is no more allowed. As soon as product is
purchased, it switches to an unlimited full-featured mode.

License templates
-----------------

Accordingly, this licensing model requires exactly two license
templates:

1.  License template of type TIMEVOLUME specifies the evaluation period
2.  License template of type FEATURE specifies the purchase price

TIMEVOLUME lisense template properties:

-   `Integer` **`timeVolume`** - required custom property, amount of days for the
    evaluation period.
-   [`Monetary`](restful-api#data-types) **`price`** / **`currency`** - must be
    set to **`0`** / **`EUR`**, evaluation is free of charge
-   `Boolean` **`automatic`** - must be set to **`true`**: evaluation starts
    automatically after the first use)
-   `Boolean` **`hidden`** - must be set to **`true`**: evaluation license is not
    available for purchase in NetLicensing Shop
-   `Boolean` **`hideLicenses`** - if set to **`false`**, evaluation license will be
    visible in the shopping cart of NetLicensing Shop as already
    acquired lisense.

FEATURE license template properties:

-   [`Monetary`](restful-api#data-types) **`price`** / **`currency`** - specify
    the purchase price for the product here
-   `Boolean` **`automatic`** - must be set to **`false`**: license must be explicitly
    purchased
-   `Boolean` **`hidden`** - must be set to **`false`**: the license based on this
    template should be available for purchase in NetLicensing Shop

Validation
----------

### Validation parameters:

On validation, this licensing model requires no parameters.

### Validation returns values:

-   `Boolean` **`valid`** - **`true`** if product use is allowed
-   `Boolean` **`evaluation`** - **`true`** if product is not yet purchased,
    but evaluation period ongoing
-   [`Timestamp`](restful-api#data-types) **`evaluationExpires`** - in case
    **`evaluation=true`**, provides the time when the evaluation license expires.

Below is more formal description of the Try & Buy licensing model logic:

-   on first validation, TIMEVOLUME license is created out of the
    license template 1, and the current time is stored with the license,
    indicating beginning of evaluation period.
-   subsequent validations check if license of type FEATURE exists, if
    yes - full-featured mode returned
    -   **`valid=true`**
    -   **`evaluation=false`**
-   in case no FEATURE license exists (not purchased yet), the time
    passed since the TIMEVOLUME license was created is compared with the
    **`timeVolume`** property, and if it is less - evaluation mode
    returned
    -   **`valid=true`**
    -   **`evaluation=true`**
    -   **`evaluationExpires=<expiration date>`**
-   otherwise no valid license state returned
    -   **`valid=false`**
    -   **`evaluation=true`**
    -   **`evaluationExpires=<expiration date>`**


### Validation response example:

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
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context" ttl="2019-09-11T08:51:58.233Z">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="ProductModuleValidation">
      <ns2:property name="productModuleNumber">M12-DEMO</ns2:property>
      <ns2:property name="evaluation">true</ns2:property>
      <ns2:property name="valid">true</ns2:property>
      <ns2:property name="productModuleName">Module licensed under TryAndBuy licensing model</ns2:property>
      <ns2:property name="evaluationExpires">2019-10-11T07:51:58.233Z</ns2:property>
      <ns2:property name="licensingModel">TryAndBuy</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }
