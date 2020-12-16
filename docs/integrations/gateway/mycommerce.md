---
layout: default
title: MyCommerce
parent: NetLicensing Gateway
grand_parent: Integrations
nav_order: 10
description: "MyCommerce integration"
permalink: mycommerce
---

{{ page.title }}
================

[Introduction](#introduction)  
[Limitations](#limitations)  
[URL format](#url-format)  
[Configuring MyCommerce](#configuring-mycommerce)  
[Quantity support](#quantity-support)  
[Error handling](#error-handling)  

## Introduction

Integration with [MyCommerce](https://www.mycommerce.com){:target="_blank"}{:rel="noopener nofollow"} uses [Remote Code Generator](http://help.mycommerce.com/add-topics/product-setup/211-prodsetup-licensingoptions#remote){:target="_blank"}{:rel="noopener nofollow"}. NetLicensing Gateway returns licensee number as license code.

**Option 1:** a new licensee is created for every MyCommerce purchase. MyCommerce allows to purchase several products at once (in the same shopping cart), in this case all these MyCommerce products must be mapped to a single NetLicensing product, and all will be associated with the same licensee. Accordingly, MyCommerce will return the same license code several times.

**Option 2:** MyCommerce product may be configured to add licenses to an existing licensee, instead of creating a new one. To use this functionality, custom field with id 'LICENSEENUMBER' must be configured for this product.

## Limitations

* Too big quantity may lead to incomplete purchase, see [Quantity support](#quantitysupport) below.

## URL format
    https://{user}:{pass}@gateway.netlicensing.io/mycommerce/codegen/{productNumber}?{param}={val}&{param}={val}&...
* {user} - NetLicensing user name
* {pass} - NetLicensing password
* {baseUrl} - NetLicensing Gateway base URL (tbd, fix also in examples below)
* {productNumber} - replace with the actual product number from NetLicensing
* request params ({param}={val}):
    * **licenseTemplateNumber** - license will be created from each specified license template. Multiple allowed.
    * **saveUserData** - "true" will trigger saving of the user data passed by MyCommerce with the created licensee as custom properties. Default is "false".
    * **quantityToLicensee** - "false" instructs the gateway to create multiple licenses for the same licensee with quantity >1. Default is "true" - generate as many licensees as the given quantity. See "Quantity support" below.

#### Example 1
    URL: https://demo:demo@gateway.netlicensing.io/mycommerce/codegen/PFLOAT-DEMO?saveUserData=false&licenseTemplateNumber=EFLOAT01-DEMO&licenseTemplateNumber=EFLOAT02-DEMO
* demo:demo - NetLicensing credentials
* gateway.netlicensing.io/mycommerce/codegen/ - URL to code generator
* PFLOAT-DEMO - NetLicensing productNumber (required)
* saveUserData=false - don't save user information collected by MyCommerce with new licensee
* licenseTemplateNumber=EFLOAT01-DEMO&licenseTemplateNumber=EFLOAT02-DEMO - List of NetLicensing license template numbers (at least one required)

#### Example 2
    URL: https://username:password@gateway.netlicensing.io/mycommerce/codegen/PSUBS-DEMO?saveUserData=true&licenseTemplateNumber=ESUBS01-DEMO
* username:password - NetLicensing credentials
* gateway.netlicensing.io/mycommerce/codegen/ - URL to code generator
* PSUBS-DEMO - Product Number in netlicensing.io (required)
* saveUserData=true - save user information (such as email, last name, first name, etc.) collected by MyCommerce with new licensee as custom properties
* licenseTemplateNumber=ESUBS01-DEMO - List of NetLicensing license template numbers (at least one required)

## Configuring MyCommerce
We assume you have successfully signed up to MyCommerce and activated your account. Also necessary products / product modules / license templates are configured in NetLicensing.


#### Step 1: Create your products
* Click **Create Product** and choose **Product**
[[images/MyCommerce/01_create-product.png]]

* Configure **Details** of your product
[[images/MyCommerce/02_edit-product.png]]

* Configure **Description**, **Marketing** (if necessary)


#### Step 2: Configure **Delivery**
* Click **Edit** in Delivery section
[[images/MyCommerce/03_edit-delivery.png]]

* Choose **License key** and click **Add**
[[images/MyCommerce/04_edit-delivery-types.png]]

* Select **Key generator via a URL**, enter URL (see above) and choose **UTF-8** in **Key generator version**.
[[images/MyCommerce/05_edit-delivery-key-generator.png]]


#### Step 3: Solution for Subscription renewal
**Option A:** by requesting existing licensee number

This mode of subscription renewal requires existing licensee number to be passed to the code generator. This is accomplished by letting the user to enter it in the custom field. To configure custom field:
* Click **Additional Options**
[[images/MyCommerce/06_additional-options.png]]

* set **ID** value to **`LICENSEENUMBER`**
[[images/MyCommerce/07_edit-additional-options.png]]
Attention: The input field must be configured for all languages, otherwise it will disappear on the checkout page when user switches languages. When additional languages are configured, it becomes visible on the checkout page only after certain time, not immediately.

Note: Since only a single licensee number can be used, **quantityToLicensee** must be set to **false**.

**Option B:** by licenses transfer

This renewal mode uses a licenses transfer feature of NetLicensing. It requires a call to the [Licensee/transfer](licensee-services#transfer-licenses) method from the client software, see [Transferring licenses between licensees](transferring-licenses-between-licensees) on NetLicensing Wiki for details how to setup and use this method. Note that NetLicensing Gateway will already mark licensees for transfer as required.


#### Step 4: Verify order confirmation page
User should receive an order confirmation page with licensee number as license code:
[[images/MyCommerce/08_order-complete.png]]

## Quantity support
Quantity parameter from the shopping cart is supported in two different modes:

**Mode 1 (default):** Enabled by default (*quantityToLicensee* omitted) or by setting the *quantityToLicensee* parameter explicitly to "true". In this case quantity >1 will be equivalent to the same number of separate checkouts, i.e. the Gateway will create as many licensees as the requested quantity, each licensee getting the licenses according to the specified license templates. Generated licensee numbers are returned as a list, one number per line ('\n' separated).

**Mode 2:** Activated by setting *quantityToLicensee* parameter to "false". Gateway will add as many licenses as the requested quantity to the same licensee for each license template. *Note: you must only specify license templates that may be used to create multiple licenses for the same licensee, e.g. subscription time volume. Specifying license template that only allows a single license will lead to an error on quantity >1.*

### Big quantity issue
Execution time of a single request to the Gateway will linear increase with the quantity. If too big quantity is entered (in a range of hundreds), MyCommerce will timeout on external code generator execution, reporting the purchase as failed. The Gateway will nevertheless finish its job, however all generated licensee numbers will not be returned to the user.

Since MyCommerce does not allow to specify the quantity upper limit, the only possible way to avoid this situation currently is to prevent the quantity change by the user in the shopping cart:

On the generate links page:
[[images/MyCommerce/20_generate-link.png]]

Select "Prevent changes to the cart" -> "Prevent changes to quantity and product removal"
[[images/MyCommerce/21_prevent-quantity-changes.png]]

## Error handling
In case an error happens in the Remote Code Generator, MyCommerce will not complete the purchase, and the end user will not receive his order confirmation, but will be redirected to an error page. Besides, MyCommerce will send you as a vendor a notification message to the email associated with your MyCommerce account. The error page and the email will contain the "Ref #" that is the PURCHASE_ID of the failed transaction. You can use this number to retrieve the NetLicensing Gateway log by sending the following request:

    https://{user}:{pass}@gateway.netlicensing.io/mycommerce/log/{productNumber}[?PURCHASE_ID={ref_no}]

* {user}, {pass} and {productNumber} - same as for codegen endpoint (see above)
* {ref_no} - Optional reference number / purchase id from MyCommerce error notification. If PURCHASE_ID parameter omitted, entire log for the given productNumber is returned.

NetLicensing Gateway keeps the logs for 30 days, however logs are only kept in memory and will be lost on gateway maintenance, therefore we encourage you to retrieve the logs as soon as possible upon error detection.

### Non-existing product case

If you see `NotFoundException: Requested product does not exist` instead of the log, ensure your productNumber is correct. If the same productNumber was used for the failed `codegen` call, the failure was due to the wrong productNumber, no logs can be retrieved in this case.
