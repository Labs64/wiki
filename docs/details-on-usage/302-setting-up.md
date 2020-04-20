---
layout: default
title: Setting up
nav_order: 2
description: ""
permalink: setting-up
image: assets/images/NetLicensing-GettingStarted.png
---

[Step 1: Planning](planning) &nbsp;&nbsp; **Step 2: Setting up** &nbsp;&nbsp; [Step 3: Integration](integration)

Setting up
==========

### Configure the product in NetLicensing via NetLicensing Management Console

1.  Create a NetLicensing account by registering
    at <a href="https://ui.netlicensing.io" class="external-link">NetLicensing Management Console</a>
2.  Setup the layout using NetLicensing Management Console:
    -   create a product
    -   create product modules
    -   create license templates for each product module

### Configuration example

*Licensing model:
["](rental)[Rental](rental)["](rental)*

1\. Create an account with NetLicensing

2\. Login to NetLicensing Management Console at
<a href="https://ui.netlicensing.io" class="external-link">ui.netlicensing.io</a>

2.1. Create a product

-   Go to `"Manage"` -\> `"Products"`
-   In the table header click `"Create entity"` button
-   Fill-in and submit the form

2.2. Create a product module

-   In the list of products, click the entity number of the just created
    product, then `"Add Product Module"`
-   Fill-in and submit the form
    -   Select `"Feature with Time Volume"` as `"Licensing Model"`

2.3. Create "Feature" license template

-   In the list of product modules, click on the entity number of the
    just created product module, then `"Add License Template"`
-   Fill-in and submit the form
    -   Select `"Feature"` as `"License Type"`;
    -   In case features themselves are not intended for an explicit
        purchase through the shop, check `"Hidden Template"` (the
        feature licenses can be added by vendor through NetLicensing
        API);
    -   In case you want the first feature to be added automatically for
        each new licensee, check the `"Automatic"` checkbox;
    -   If you set a certain price on the license, usually you don't
        want `"Hidden" Template` or `"Automatic"` to be checked, as such
        licenses must be explicitly purchased via NetLicensing Shop;
    -   Do not check `"Hide Licenses"`, as licensee wants to see the
        features in the NetLicensing Shop to which he will purchase time
        volume.

2.4. Create "Time-Volume" license template (repeat for different time
volume/price combinations)

-   In the list of product modules, click the number of the just created
    product module, then `"Add License Template"`
-   Fill-in and submit the form
    -   Select `"Time-Volume"` as `"License Type"`;
    -   Add `"timeVolume"` custom property with the integer value
        representing the time volume in days;
    -   Enter `"price"` for the license based on this license template;
    -   Do not check `"Automatic"`, as you don't want paid licenses to
        be added automatically;
    -   Do not check `"Hidden Template"`, as you want it to be offered
        for purchase in NetLicensing Shop;
    -   Do not check `"Hide Licenses"`, as you want licensee to see what
        time volume he has already purchased.

[Step 1: Planning](planning) &nbsp;&nbsp; **Step 2: Setting up** &nbsp;&nbsp; [Step 3: Integration](integration)
