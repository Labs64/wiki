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

## Introduction

Integration with [FastSpring](https://fastspring.com){:target="_blank"}{:rel="noopener nofollow"} uses [Fulfillments](https://docs.fastspring.com/products-bundles-and-subscriptions/fulfillments#Fulfillments-remote){:target="_blank"}{:rel="noopener nofollow"}. NetLicensing Gateway returns licensee number as license code.

**Option 1:** New licensee is created for every FastSpring purchase. FastSpring allows to purchase several products at once (in the same shopping cart), in this case, all these FastSpring products must be mapped to a single NetLicensing product, and all will be associated with the same licensee. Accordingly, FastSpring will return the same license code several times.

**Option 2:** FastSpring product may be configured to add licenses to an existing licensee, instead of creating a new one. To use this functionality, 'licenseeNumber' parameter must be configured for this product.

## Limitations

* Too big quantity may lead to an incomplete purchase, see [Quantity support](#quantity-support) below.

## URL format

```
https://gateway.netlicensing.io/fastspring/codegen/
```

* **apiKey** - authorization [apiKey](security#api-key-identification).
* **productNumber** - replace with the actual product number from NetLicensing
* **licenseTemplateList** - license will be created from each specified license template. Multiple allowed, comma separated (_licenseTemplateNumber,licenseTemplateNumber,licenseTemplateNumber..._).
* **saveUserData** - "true" will trigger saving of the user data passed by FastSpring with the created licensee as custom properties. Default is "false".
* **quantityToLicensee** - "false" instructs the gateway to create multiple licenses for the same licensee with quantity >1. Default is "true" - generate as many licensees as the given quantity. See "Quantity support" below.

#### Example 1

```
URL: https://gateway.netlicensing.io/fastspring/codegen/

POST data: 
* productNumber=PFLOAT-DEMO - NetLicensing productNumber (required)
* saveUserData=true - save user information (such as email, last name, first name, etc.) collected by FastSpring with new licensee in json format as custom property (key: fastSpringUserData)
* licenseTemplateList=EFLOAT01-DEMO,EFLOAT02-DEMO - List of NetLicensing license template numbers (at least one required)
```

#### Example 2

```
URL: https://gateway.netlicensing.io/fastspring/codegen/

POST data: 
* productNumber=PSUBS-DEMO - Product Number in netlicensing.io (required)
* saveUserData=true - save user information (such as email, last name, first name, etc.) collected by FastSpring with new licensee in json format as custom property (key: fastSpringUserData)
* licenseTemplateList=ESUBS01-DEMO - List of NetLicensing license template numbers (at least one required)
```

## Configuring FastSpring

We assume you have successfully signed up to FastSpring and activated your account. Also, necessary products / product modules / license templates are configured in NetLicensing.

#### Step 1: Create your products

* Click **Create Product** and choose **Product**
<a href="assets/images/fastspring-01-create-product.png" class="imagelink" data-lightbox="fastspring" data-title="Create product" data-alt="Create product">
    <img src="assets/images/fastspring-01-create-product.png" alt="Create product" />
</a>

* Configure **Details** of your product
<a href="assets/images/fastspring-02-create-product-details.png" class="imagelink" data-lightbox="fastspring" data-title="Product details" data-alt="Product details">
    <img src="assets/images/fastspring-02-create-product-details.png" alt="Product details" />
</a>

#### Step 2: Add **Fulfillment**

* Click **Add Fulfillment**
<a href="assets/images/fastspring-03-add-fulfillment.png" class="imagelink" data-lightbox="fastspring" data-title="Add fulfillment" data-alt="Add fulfillment">
    <img src="assets/images/fastspring-03-add-fulfillment.png" alt="Add fulfillment" />
</a>

* Choose **Generate a License** and click **Remote Server Request**
<a href="assets/images/fastspring-04-generate-license.png" class="imagelink" data-lightbox="fastspring" data-title="Generate License" data-alt="Generate License">
    <img src="assets/images/fastspring-04-generate-license.png" alt="Generate License" />
</a>

* Fill **URL** and click **Multi-Line License**
<a href="assets/images/fastspring-05-license-configuration.png" class="imagelink" data-lightbox="fastspring" data-title="License configuration" data-alt="License configuration">
    <img src="assets/images/fastspring-05-license-configuration.png" alt="License configuration" />
</a>

* Click **Security** tab and copy Private Key
<a href="assets/images/fastspring-06-private-key-security.png" class="imagelink" data-lightbox="fastspring" data-title="Security" data-alt="Security">
    <img src="assets/images/fastspring-06-private-key-security.png" alt="Security" />
</a>

* Create Token with **tokenType=APIKEY**, **apiKeyRole=ROLE_APIKEY_ADMIN** and Custom property **fastspringPrivateKey=(copied from previous step)** on NetLicensing side. (see: [NetLicensing API Documentation](token-services#create-token))

* Click **Parameter** tab and insert necessary fields. Insert apiKey number from the previous step.
<a href="assets/images/fastspring-07-remote-license-configuration.png" class="imagelink" data-lightbox="fastspring" data-title="Remote license configuration" data-alt="Remote license configuration">
    <img src="assets/images/fastspring-07-remote-license-configuration.png" alt="Remote license configuration" />
</a>

#### Step 3: Solution for Subscription renewal

**Option A:** by requesting existing licensee number

This mode of subscription renewal requires an existing licensee number to be passed to the code generator. This is accomplished by passing licenseeNumber with tags parameter. To tags field see: [FastSpring Tags](https://docs.fastspring.com/integrating-with-fastspring/passing-and-capturing-custom-order-tags-and-product-attributes){:target="_blank"}{:rel="noopener nofollow"}

Note: Since only a single licensee number can be used, **quantityToLicensee** must be set to **false**.

**Option B:** by licenses transfer

This renewal mode uses a licenses transfer feature of NetLicensing. It requires a call to the [Licensee/transfer](licensee-services#transfer-licenses) method from the client software, see [Transferring licenses between licensees](transferring-licenses-between-licensees) on NetLicensing Wiki for details how to setup and use this method. Note that NetLicensing Gateway will already mark licensees for transfer as required.

#### Step 4: Verify order confirmation page

User should receive an order confirmation page with licensee number as license code:
<a href="assets/images/fastspring-08-order-complete.png" class="imagelink" data-lightbox="fastspring" data-title="Order confirmation" data-alt="Order confirmation">
    <img src="assets/images/fastspring-08-order-complete.png" alt="Order confirmation" />
</a>

## Quantity support

Quantity parameter from the shopping cart is supported in two different modes:

**Mode 1 (default):** Enabled by default (*quantityToLicensee* omitted) or by setting the *quantityToLicensee* parameter explicitly to "true". In this case quantity >1 will be equivalent to the same number of separate checkouts, i.e. the Gateway will create as many licensees as the requested quantity, each licensee getting the licenses according to the specified license templates. Generated licensee numbers are returned as a list, one number per line ('\n' separated).

**Mode 2:** Activated by setting *quantityToLicensee* parameter to "false". Gateway will add as many licenses as the requested quantity to the same licensee for each license template. *Note: you must only specify license templates that may be used to create multiple licenses for the same licensee, e.g. subscription time volume. Specifying license template that only allows a single license will lead to an error on quantity >1.*

### Big quantity issue

Execution time of a single request to the Gateway will linearly increase with the quantity. If the too big quantity is entered (in a range of hundreds), FastSpring will timeout on external code generator execution, reporting the purchase as failed. The Gateway will nevertheless finish its job, however, all generated licensee numbers will not be returned to the user.

Since FastSpring does not allow to specify the quantity upper limit, the only possible way to avoid this situation currently is to prevent the quantity change by the user in the shopping cart:

Select "Default Quantity" -> "Locked"
<a href="assets/images/fastspring-09-prevent-quantity-change.png" class="imagelink" data-lightbox="fastspring" data-title="Prevent quantity change" data-alt="Prevent quantity change">
    <img src="assets/images/fastspring-09-prevent-quantity-change.png" alt="Prevent quantity change" />
</a>

## Error handling

In case an error happens in the Remote Code Generator, FastSpring will not complete the purchase, and the end-user will not receive his order confirmation but will be redirected to an error page. Besides, FastSpring will send you as a vendor a notification message to the email associated with your FastSpring account. The error page and the email will contain the "Order Reference: #" that is the 'reference' of the failed transaction. You can use this number to retrieve the NetLicensing Gateway log by sending the following request:

```
https://gateway.netlicensing.io/FastSpring/log/{productNumber}[?reference={reference}]
```

* **productNumber** - same as for codegen endpoint (see above)
* **reference** - Optional reference number from FastSpring error notification. If 'reference' parameter omitted, the entire log for the given productNumber is returned.

NetLicensing Gateway keeps the logs for 30 days, however, logs are only kept in memory and will be lost on gateway maintenance, therefore we encourage you to retrieve the logs as soon as possible upon error detection.

### Non-existing product case

If you see `NotFoundException: Requested product does not exist` instead of the log, ensure your productNumber is correct. If the same productNumber was used for the failed `codegen` call, the failure was due to the wrong productNumber, no logs can be retrieved in this case.

## References

* [Integrating NetLicensing @ FastSpring](https://community.fastspring.com/s/article/Integrating-NetLicensing){:target="_blank"}{:rel="noopener nofollow"}
