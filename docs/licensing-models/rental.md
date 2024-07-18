---
layout: default
title: Rental
parent: Licensing Models
nav_order: 80
description: "Rental - license multiple instances of some entity, each instance for a certain period of time"
permalink: rental
---

{{ page.title }}
======

-   [Overview](#overview)
-   [License templates](#license-templates)
-   [Licenses](#licenses)
-   [Validation](#validation)

Overview
--------

This is a complex licensing model, useful in the case you want to license multiple instances of some feature, each instance for a certain period of time.

This licensing model can be easier explained using an example:

Assume you have a payment processing server, and credit card terminal devices that communicate credit card data to the server. You want to license every terminal device individually for a specific time period. Your customers may order multiple terminal devices.

<img src="assets/images/rental-overview.png" />

For our example assume that each device is initially licensed for 3 months; before this period ends a renewal license must be purchased in order to keep the device in operation. Renewal is possible for different periods with quantity discounts:

-   EUR 10,00 for 3 months
-   EUR 17,00 for 6 months
-   EUR 30,00 for 1 year

To implement the above scenario, the **Rental** licensing model requires exactly one FEATURE license template, which corresponds to a terminal device being licensed in our example \[<img src="assets/images/icons/phone.png" width="18" height="25" />\]. For every specific device one license from the FEATURE license template will be created, holding the number that identifies that specific device.

**Rental** licensing model requires also at least one TIMEVOLUME license template \[<img src="assets/images/icons/clock.png" width="18" height="25" />\]. More TIMEVOLUME license templates can be created as necessary for different time periods. TIMEVOLUME [license templates](object-model) need additional property:

-   **`timeVolume`** - amount of days licensed.

Licenses from the TIMEVOLUME license template can only be created if at least one license from the FEATURE license template already exists, because every TIMEVOLUME license must be linked to a feature (represented by the FEATURE license).

Every [license](object-model#license) that is created from a TIMEVOLUME license template gets automatically a copy of the timeVolume property from the license template. In addition to the timeVolume property and the standard license properties it must have the following specific properties set:

-   **`parentFeature`** - the number of the FEATURE license this TIMEVOLUME license is associated with;
-   **`startDate`** - the date from which this license becomes valid.

For our example we need one TIMEVOLUME license template for the initial 3 months licensed period, and additionally three TIMEVOLUME license templates, one for each renewal period / price combination.

Below is the summary of all the license templates that need to be configured for our example:

<img src="assets/images/rental-overview-04.png" />

<table style="width:100%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 14%" />
<col style="width: 14%" />
<col style="width: 14%" />
<col style="width: 14%" />
<col style="width: 14%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th><p>number</p></th>
<th><p>name</p></th>
<th><p>type</p></th>
<th><p>price</p></th>
<th><p>hidden</p></th>
<th><p>hideLicenses</p></th>
<th><p>timeVolume</p></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>LT-DEV</p></td>
<td><p>Terminal Device</p></td>
<td><p>FEATURE</p></td>
<td><p>0</p></td>
<td><p>true</p></td>
<td><p>false</p></td>
<td><p>-</p></td>
</tr>
<tr class="even">
<td><p>LT-EVAL</p></td>
<td><p>3 months eval</p></td>
<td><p>TIMEVOLUME</p></td>
<td><p>0</p></td>
<td><p>true</p></td>
<td><p>false</p></td>
<td><p>91</p></td>
</tr>
<tr class="odd">
<td><p>LT-3M</p></td>
<td><p>3 months</p></td>
<td><p>TIMEVOLUME</p></td>
<td><p>10</p></td>
<td><p>false</p></td>
<td><p>false</p></td>
<td><p>91</p></td>
</tr>
<tr class="even">
<td><p>LT-6M</p></td>
<td><p>6 months</p></td>
<td><p>TIMEVOLUME</p></td>
<td><p>17</p></td>
<td><p>false</p></td>
<td><p>false</p></td>
<td><p>182</p></td>
</tr>
<tr class="odd">
<td><p>LT-1Y</p></td>
<td><p>1 year</p></td>
<td><p>TIMEVOLUME</p></td>
<td><p>30</p></td>
<td><p>false</p></td>
<td><p>false</p></td>
<td><p>365</p></td>
</tr>
</tbody>
</table>

Once license templates are configured, licensing model is ready for use.

Let's assume now a customer with the [id number](glossary) "CUST-4567" orders 3 terminal devices identified by the numbers "DEV-341", "DEV-342" and "DEV-343".

First of all, if this is a new customer, corresponding [Licensee](object-model#licensee) object must be created within NetLicensing, holding the above customer number - "CUST-4567".  
This can be done either manually via <a href="https://ui.netlicensing.io" class="external-link">NetLicensing Management Console</a> or the application on the payment processing server can do it via [NetLicensing API](restful-api), if it has an automated customer registration procedure.

<img src="assets/images/rental-overview-02.png" />

Once required licensee object is in place, for each of the ordered terminal devices create the following licenses, binding them to the licensee "CUST-4567" (again NetLicensing Management Console or NetLicensing API can be used at your choice):

-   from license template "LT-DEV", number=DEV-341
-   from license template "LT-EVAL": parentFeature=DEV-341, startDate=now
-   from license template "LT-DEV", number=DEV-342
-   from license template "LT-EVAL": parentFeature=DEV-342, startDate=now
-   from license template "LT-DEV", number=DEV-343
-   from license template "LT-EVAL": parentFeature=DEV-343, startDate=now

<img src="assets/images/rental-overview-01.png" />

Now when the application on the payment processing server calls validate() for the customer "CUST-4567", it will get the state for the three devices registered for this customer.

On validation, this licensing model returns as many groups as FEATURE licenses exist, each group containing two values:

-   `Boolean` **`valid`** - **`true`** if FEATURE use is allowed
-   `Timestamp` **`expires`** - in case `valid=true`, provides the time when the TIMEVOLUME licenses expire for the FEATURE.

If devices in our example were all added at the same time on Feb 01, 2012 at 14:00, the validation result for the validation made on e.g. Mar 15, 2012 (before the expiration date) will look like:

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
  <items>
    <item type="ProductModuleValidation">
      <property name="productModuleNumber">M1XMKFVY7</property>
      <list name="DEV-341">
        <property name="valid">true</property>
        <property name="expires">2012-05-02T14:00:00.000+01:00</property>
        <property name="expirationWarningLevel">green</property>
      </list>
      <list name="DEV-342">
        <property name="valid">true</property>
        <property name="expires">2012-05-02T14:00:00.000+01:00</property>
        <property name="expirationWarningLevel">green</property>
      </list>
      <list name="DEV-343">
        <property name="valid">true</property>
        <property name="expires">2012-05-02T14:00:00.000+01:00</property>
        <property name="expirationWarningLevel">green</property>
      </list>
    </item>
  </items>
</netlicensing>
```
{: .ml-5 }

Means all devices can be used, and each device expires on Mai 05, 2012, 91 days after it was added.

The application will react on the **`valid`** state by allowing or declining operations for the specific device. Checking the expiration date for the devices, the application can notify the customer in case one or more terminal devices are about to expire, and also redirect the customer to NetLicensing Shop for license renewal.

Once in the NetLicensing Shop, for each TIMEVOLUME license template that is not marked "hidden" the customer will see corresponding entry as available for purchase:

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th><p>License</p></th>
<th><p>Price per item</p></th>
<th><p> </p></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>3 months</p></td>
<td><p>EUR 10,00</p></td>
<td><p>+</p></td>
</tr>
<tr class="even">
<td><p>6 months</p></td>
<td><p>EUR 17,00</p></td>
<td><p>+</p></td>
</tr>
<tr class="odd">
<td><p>1 year</p></td>
<td><p>EUR 30,00</p></td>
<td><p>+</p></td>
</tr>
</tbody>
</table>

Customer selects a license he wants to purchase by pressing "+" in the corresponding row. He sees then a popup with the list of items according to the "FEATURE" licenses he has. In our example this will correspond to devices he possess. The customer can mark then one or more devices for which he wants to purchase the selected license. After paying the shopping cart, all the licenses the customer purchased become active and the new state will be reflected in the subsequent calls to [validate](licensee-services#validate-licensee) from the application.

Assuming for our example that the customer selected 6 months license for devices "DEV-341" and "DEV-342", the licenses after his purchase will look like:

<img src="assets/images/rental-overview-03.png" />

And the validation result for the validation performed on Aug 21, 2012 will look like:

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
  <items>
    <item type="ProductModuleValidation">
      <property name="productModuleNumber">M1XMKFVY7</property>
      <property name="productModuleName">Terminal Devices</property>
      <property name="licensingModel">FeatureWithTimeVolume</property>
      <list name="DEV-341">
        <property name="valid">true</property>
        <property name="expires">2012-10-31T14:00:00.000+01:00</property>
        <property name="expirationWarningLevel">green</property>
      </list>
      <list name="DEV-342">
        <property name="valid">true</property>
        <property name="expires">2012-10-31T14:00:00.000+01:00</property>
        <property name="expirationWarningLevel">green</property>
      </list>
      <list name="DEV-343">
        <property name="valid">false</property>
        <property name="expirationWarningLevel">red</property>
      </list>
    </item>
  </items>
</netlicensing>
```
{: .ml-5 }

Means devices DEV-341 and DEV-342 can be used, both expire on Oct 31, 2012 (91+182 days after initially added), and for DEV-343 no active licenses available.

For user convenience, **Rental** licensing model assigns the "expiration warning level" to each feature. The level has three steps: "`green`", "`yellow`" or "`red`", and is indicated in NetLicensing Shop by displaying the feature name in the corresponding color, while the "`validate`" NetLicensing API call returns it as "`expirationWarningLevel`" property of each feature. This level tells roughly how much time remains until the feature expires, and is configurable via two additional properties of the corresponding product module:

-   "Remaining time volume for yellow level" in NetLicensing Management Console, "`yellowThreshold`" property in NetLicensing API
-   "Remaining time volume for red level" in NetLicensing Management Console, "`redThreshold`" property in NetLicensing API

The parameters are optional, if not provided, assumed to be 0 days.

The logic is simple:

-   When the amount of days remaining until expiration is more than "`yellowThreshold`", "`expirationWarningLevel`" == "`green`"
-   When the amount of days remaining until expiration is more than "`redThreshold`", but less then or equal to the "`yellowThreshold`", "`expirationWarningLevel`" == "`yellow`"
-   When the amount of days remaining until expiration is less then or equal to the "`redThreshold`", "`expirationWarningLevel`" == "`red`"

Warning Levels
--------------

Below are the default [warning levels](warning-level) associated with this licensing model.

| GREEN | YELLOW | RED |
|:------|:-------|:----|
| Time-volume not reached yellow threshold<br>AND<br>Time-volume not reached red threshold | Time-volume reached yellow threshold | No time-volume license associated with the feature license<br>OR<br>Time-volume license expired<br>OR<br>Time-volume reached red threshold |
