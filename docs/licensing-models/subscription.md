---
layout: default
title: Subscription
parent: Licensing Models
nav_order: 20
description: "Subscription licensing model reflects a typical subscription scenario, where the use is permitted for a certain period of time"
permalink: subscription
---

{{ page.title }}
============

-   [Overview](#overview)
-   [License templates](#license-templates)
-   [Licenses](#licenses)
-   [Grace Period](#grace-period)
-   [Validation](#validation)

Overview
--------

**Subscription** licensing model reflects a typical subscription scenario, where the use is permitted for a certain period of calendar time and can be extended on demand. Optional free license may be configured that will be automatically provided to all new licensees for evaluation purposes. Validation shows if the use is permitted for a [licensee](object-model#licensee) at the time of validation, and the date when the cumulative licensed period for all purchased licenses expires.

License templates
-----------------

This licensing model requires one or more license templates of type TIMEVOLUME, each specifying a licensed period of time (in days) and a purchase price for this period. By configuring multiple license templates, one can build volume discounts, e.g.:

-   30 days for 5 EUR
-   90 days for 13 EUR
-   365 days for 40 EUR

Optionally one license template may be marked "automatic" with the price set to 0, that specifies the evaluation period given to each licensee by default free of charge. Evaluation period starts at the first validation by a licensee, while start date for the purchased licenses is set to the date of purchase. In case new license is purchased before the expiration date of already available licenses, the time volume of the new license extends the total time volume after expiration date, regardless of exact purchase date.

Required additional properties specific to the TIMEVOLUME [license templates](object-model#license-template):

-   `Integer` **`timeVolume`** - specifies the licensed time period in days.

Licenses
--------

Required additional properties specific to the TIMEVOLUME [licenses](object-model#license):

-   `Integer` **`timeVolume`** - specifies the licensed time period in days. Normally it is copied from the corresponding license template, but can be changed later for each license individually.
-   [`Timestamp`](restful-api#data-types) **`startDate`** - specifies a date at which the validity period of the license begins.

Grace Period
------------

By offering the Grace Period option, you can provide flexibility to your customers and ensure a smoother transition in subscription renewals.

Grace Period option under the Subscription Licensing Model allows you to provide a specific time frame during which your end-users can continue to use your software, even if their subscription has expired. It can be useful in situations where users need additional time to renew their subscription or when a temporary interruption in subscription payment has occurred.

To enable the Grace Period option for Subscription licensing model in NetLicensing, follow these steps:

-   Sign in to your NetLicensing account
-   Go to the Products section and select the product you want to enable the Grace Period for
-   Select Product Module configured by the Subscription Licensing Model
-   Scroll down to the Packages section
-   Enable "Grace Period" option
-   Save your changes

Once the Grace Period option is enabled, the end-users can continue to use your software during the specified Grace Period, even if their subscription has expired.

It's important to note that during the Grace Period, end-users are expected to renew their subscription to maintain access to the software features beyond the Grace Period.

Validation
----------

### Validation parameters:

On validation, this licensing model requires no parameters.

### Validation returns values:

-   `Boolean` **`valid`** - **`true`** if use is allowed
-   [`Timestamp`](restful-api#data-types) **`expires`** - in case
    **`valid=true`**, provides the cumulative expiration date for all purchased
    licenses.

### Validation response examples:

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
<netlicensing 
    xmlns="http://netlicensing.labs64.com/schema/context">
    <infos/>
    <items>
        <item type="ProductModuleValidation">
            <property name="productModuleNumber">Mass-DEMO</property>
            <property name="valid">true</property>
            <property name="licensingModel">Subscription</property>
            <property name="expires">2020-05-04T16:03:30.032+03:00</property>
            <property name="productModuleName">Subscription module</property>
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
| timeUsed < 80% | timeUsed >= 80% | timeUsed = 100% |
