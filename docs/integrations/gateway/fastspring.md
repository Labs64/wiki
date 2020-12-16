---
layout: default
title: FastSpring
parent: NetLicensing Gateway
grand_parent: Integrations
nav_order: 20
description: "FastSpring (Contextual Commerce) integration"
permalink: fastspring
---

{{ page.title }}
================

[Introduction](#introduction)  
[Limitations](#limitations)  
[URL format](#url-format)  
[Configuring FastSpring](#configuring-fastspring)  
[Quantity support](#quantity-support)  
[Error handling](#error-handling)  

# Introduction

Integration with [FastSpring](https://fastspring.com/) uses [Fulfillments](https://docs.fastspring.com/products-bundles-and-subscriptions/fulfillments#Fulfillments-remote). NetLicensing Gateway returns licensee number as license code.

**Option 1:** a new licensee is created for every FastSpring purchase. FastSpring allows to purchase several products at once (in the same shopping cart), in this case all these FastSpring products must be mapped to a single NetLicensing product, and all will be associated with the same licensee. Accordingly, FastSpring will return the same license code several times.

**Option 2:** FastSpring product may be configured to add licenses to an existing licensee, instead of creating a new one. To use this functionality, 'licenseeNumber' parameter must be configured for this product.

# Limitations
* Too big quantity may lead to incomplete purchase, see [Quantity support](#quantitysupport) below.

<a name="urlformat"/>

# URL format
    https://gateway.netlicensing.io/fastspring/codegen/

* **apiKey** - authorization apiKey. see Authorization manual [Authorization](#authorization).  
* **productNumber** - replace with the actual product number from NetLicensing
* **licenseTemplateList** - license will be created from each specified license template. Multiple allowed, comma separated (_licenseTemplateNumber,licenseTemplateNumber,licenseTemplateNumber..._).
* **saveUserData** - "true" will trigger saving of the user data passed by FastSpring with the created licensee as custom properties. Default is "false".
* **quantityToLicensee** - "false" instructs the gateway to create multiple licenses for the same licensee with quantity >1. Default is "true" - generate as many licensees as the given quantity. See "Quantity support" below.

#### Example 1
    URL: https://gateway.netlicensing.io/fastspring/codegen/
POST data: 
* productNumber=PFLOAT-DEMO - NetLicensing productNumber (required)
* saveUserData=true - save user information (such as email, last name, first name, etc.) collected by FastSpring with new licensee in json format as custom property (key: fastSpringUserData)
* licenseTemplateList=EFLOAT01-DEMO,EFLOAT02-DEMO - List of NetLicensing license template numbers (at least one required)

#### Example 2
    URL: https://gateway.netlicensing.io/fastspring/codegen/
POST data: 
* productNumber=PSUBS-DEMO - Product Number in netlicensing.io (required)
* saveUserData=true - save user information (such as email, last name, first name, etc.) collected by FastSpring with new licensee in json format as custom property (key: fastSpringUserData)
* licenseTemplateList=ESUBS01-DEMO - List of NetLicensing license template numbers (at least one required)

# Configuring FastSpring
We assume you have successfully signed up to FastSpring and activated your account. Also necessary products / product modules / license templates are configured in NetLicensing.


#### Step 1: Create your products
* Click **Create Product** and choose **Product**
[[images/FastSpring/01_create-product.png]]

* Configure **Details** of your product
[[images/FastSpring/02_create-product-details.png]]

#### Step 2: Add **Fulfillment**
* Click **Add Fulfillment**
[[images/FastSpring/03_add-fulfillment.png]]

* Choose **Generate a License** and click **Remote Server Request**
[[images/FastSpring/04_generate-license.png]]

* Fill **URL** and click **Multi-Line License**
[[images/FastSpring/05_license-configuration.png]]

* click **Security** tab and copy Private Key
[[images/FastSpring/06_private-key-security.png]]

* create Token with **tokenType=APIKEY**, **apiKeyRole=ROLE_APIKEY_ADMIN** and Custom property **fastspringPrivateKey=(copied from previous step)** on NetLicensing side. (see: [NetLicensing API Documentation](https://netlicensing.io/wiki/token-services#create-token))

* click **Parameter** tab and insert necessary fields. Insert apiKey number from the previous step.
[[images/FastSpring/07_remote-license-configuration.png]]

#### Step 3: Solution for Subscription renewal
**Option A:** by requesting existing licensee number

This mode of subscription renewal requires existing licensee number to be passed to the code generator. This is accomplished by passing licenseeNumber with tags parameter. To tags field see:
[FastSpring Tags](https://docs.fastspring.com/integrating-with-fastspring/passing-and-capturing-custom-order-tags-and-product-attributes)

Note: Since only a single licensee number can be used, **quantityToLicensee** must be set to **false**.

**Option B:** by licenses transfer

This renewal mode uses a licenses transfer feature of NetLicensing. It requires a call to the [Licensee/transfer](https://netlicensing.io/wiki/licensee-services#transfer-licenses) method from the client software, see [Transferring licenses between licensees](https://netlicensing.io/wiki/transferring-licenses-between-licensees) on NetLicensing Wiki for details how to setup and use this method. Note that NetLicensing Gateway will already mark licensees for transfer as required.

#### Step 4: Verify order confirmation page
User should receive an order confirmation page with licensee number as license code:
[[images/FastSpring/08_order-complete.png]]

# Quantity support
Quantity parameter from the shopping cart is supported in two different modes:

**Mode 1 (default):** Enabled by default (*quantityToLicensee* omitted) or by setting the *quantityToLicensee* parameter explicitly to "true". In this case quantity >1 will be equivalent to the same number of separate checkouts, i.e. the Gateway will create as many licensees as the requested quantity, each licensee getting the licenses according to the specified license templates. Generated licensee numbers are returned as a list, one number per line ('\n' separated).

**Mode 2:** Activated by setting *quantityToLicensee* parameter to "false". Gateway will add as many licenses as the requested quantity to the same licensee for each license template. *Note: you must only specify license templates that may be used to create multiple licenses for the same licensee, e.g. subscription time volume. Specifying license template that only allows a single license will lead to an error on quantity >1.*

## Big quantity issue
Execution time of a single request to the Gateway will linear increase with the quantity. If too big quantity is entered (in a range of hundreds), FastSpring will timeout on external code generator execution, reporting the purchase as failed. The Gateway will nevertheless finish its job, however all generated licensee numbers will not be returned to the user.

Since FastSpring does not allow to specify the quantity upper limit, the only possible way to avoid this situation currently is to prevent the quantity change by the user in the shopping cart:

Select "Default Quantity" -> "Locked"
[[images/FastSpring/09_prevent-quantity-change.png]]

# Error handling
In case an error happens in the Remote Code Generator, FastSpring will not complete the purchase, and the end user will not receive his order confirmation, but will be redirected to an error page. Besides, FastSpring will send you as a vendor a notification message to the email associated with your FastSpring account. The error page and the email will contain the "Order Reference: #" that is the 'reference' of the failed transaction. You can use this number to retrieve the NetLicensing Gateway log by sending the following request:

    https://gateway.netlicensing.io/FastSpring/log/{productNumber}[?reference={reference}]

* {productNumber} - same as for codegen endpoint (see above)
* {reference} - Optional reference number from FastSpring error notification. If 'reference' parameter omitted, entire log for the given productNumber is returned.

NetLicensing Gateway keeps the logs for 30 days, however logs are only kept in memory and will be lost on gateway maintenance, therefore we encourage you to retrieve the logs as soon as possible upon error detection.

## Non-existing product case
If you see `NotFoundException: Requested product does not exist` instead of the log, ensure your productNumber is correct. If the same productNumber was used for the failed `codegen` call, the failure was due to the wrong productNumber, no logs can be retrieved in this case.

# References
* https://community.fastspring.com/s/article/Integrating-NetLicensing
* https://netlicensing.io
