---
layout: default
title: "FastSpring Gateway Connector"
nav_title: "FastSpring"
parent: NetLicensing Gateway
grand_parent: Integrations
nav_order: 20
description: "Issue NetLicensing licenses from FastSpring orders without code: a Remote Server Request fulfillment calls the Gateway, which returns the license code."
permalink: fastspring
last_modified_at: 2026-11-08
---

{{ page.title }}
================

<div class="alert alert-info" markdown="1">
**For new integrations, use the [FastSpring Licensing Integration](fastspring-licensing).** It works with FastSpring webhooks and
a small receiver of your own, covers renewals, refunds and chargebacks, and does not depend on the NetLicensing Gateway. This
page describes the Gateway connector for existing setups.
</div>

In short: FastSpring calls the NetLicensing Gateway while it processes an order. The Gateway creates the customer and the licenses in NetLicensing and returns the licensee number, which FastSpring delivers to the buyer as the license code. You configure it in FastSpring; no code is needed. The connector covers the first purchase only.

[Introduction](#introduction)  
[Limitations](#limitations)  
[URL format](#url-format)  
[Configuring FastSpring](#configuring-fastspring)  
[Quantity support](#quantity-support)  
[Error handling](#error-handling)  
[Renewals and cancellations](#renewals-and-cancellations)  
[Example: the calls](#example-the-calls)  

## Introduction

Integration with [FastSpring](https://fastspring.com){:target="_blank"}{:rel="noopener nofollow"} uses a *Generate a License* fulfillment of the type [Remote Server Request](https://developer.fastspring.com/docs/license-key-fulfillments#remote-server-request){:target="_blank"}{:rel="noopener nofollow"}: FastSpring contacts the Gateway while it processes the order. NetLicensing Gateway creates the customer and licenses and returns the licensee number as license code.

> **Which FastSpring?** This guide is for **Contextual Commerce** stores (managed in the FastSpring app). FastSpring describes Classic Commerce as [a legacy product that it no longer actively develops](https://developer.fastspring.com/docs/classic-commerce-upgrade-overview){:target="_blank"}{:rel="noopener nofollow"}; the [Classic connector](https://github.com/Labs64/NetLicensing-FastSpring){:target="_blank"}{:rel="noopener"} is deprecated.
>
> **Subscriptions:** the remote request runs when the order is processed, so it covers the **first purchase**. To react to renewals, cancellations, refunds and overdue payments, you need FastSpring webhooks: see [Renewals and cancellations](#renewals-and-cancellations).

**Option 1:** New licensee is created for every FastSpring purchase. FastSpring allows to purchase several products at once (in the same shopping cart), in this case, all these FastSpring products must be mapped to a single NetLicensing product, and all will be associated with the same licensee. Accordingly, FastSpring will return the same license code several times.

**Option 2:** FastSpring product may be configured to add licenses to an existing licensee, instead of creating a new one. To use this functionality, `licenseeNumber` parameter must be configured for this product.

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

> The screenshots below show an earlier version of the FastSpring app; the steps and names follow FastSpring's [current documentation](https://developer.fastspring.com/docs/license-key-fulfillments){:target="_blank"}{:rel="noopener nofollow"}.

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

* Open the product's details page. In the **Fulfillments** section click **Edit**, then **+ Add Fulfillment**
<a href="assets/images/fastspring-03-add-fulfillment.png" class="imagelink" data-lightbox="fastspring" data-title="Add fulfillment" data-alt="Add fulfillment">
    <img src="assets/images/fastspring-03-add-fulfillment.png" alt="Add fulfillment" />
</a>

* Choose **Generate a License**, then **Choose a Generator…**, select **Remote Server Request** and click **Next**
<a href="assets/images/fastspring-04-generate-license.png" class="imagelink" data-lightbox="fastspring" data-title="Generate License" data-alt="Generate License">
    <img src="assets/images/fastspring-04-generate-license.png" alt="Generate License" />
</a>

* Fill **URL** with the Gateway URL (see [URL format](#url-format)) and select the method **POST**: FastSpring recommends POST, and the Gateway accepts POST only. Select the **Output Format** **Single-Line License (Quantity Based)**: one license per quantity purchased, separated by a line feed, which is how the Gateway returns the licensee numbers. (FastSpring separates licenses with an *empty* line only in the *Multi-Line License* format, which earlier versions of this page named.) Click **Create**
<a href="assets/images/fastspring-05-license-configuration.png" class="imagelink" data-lightbox="fastspring" data-title="License configuration" data-alt="License configuration">
    <img src="assets/images/fastspring-05-license-configuration.png" alt="License configuration" />
</a>

* Open the **Security** subpage and copy the 32-character **Private Key**
<a href="assets/images/fastspring-06-private-key-security.png" class="imagelink" data-lightbox="fastspring" data-title="Security" data-alt="Security">
    <img src="assets/images/fastspring-06-private-key-security.png" alt="Security" />
</a>

* Create Token with **tokenType=APIKEY**, **apiKeyRole=ROLE_APIKEY_ADMIN** and Custom property **fastspringPrivateKey=(copied from previous step)** on NetLicensing side. (see: [NetLicensing API Documentation](token-services#create-token))

* Open the **Parameters** subpage (FastSpring allows up to 10 custom parameters) and add the parameters listed in [Parameters used by the Gateway](#parameters-used-by-the-gateway). Insert the apiKey number from the previous step.
<a href="assets/images/fastspring-07-remote-license-configuration.png" class="imagelink" data-lightbox="fastspring" data-title="Remote license configuration" data-alt="Remote license configuration">
    <img src="assets/images/fastspring-07-remote-license-configuration.png" alt="Remote license configuration" />
</a>

#### Parameters used by the Gateway

These are the parameters the Gateway reads, taken from its [source code](https://github.com/Labs64/NetLicensing-Gateway/blob/master/src/main/java/com/labs64/netlicensing/gateway/integrations/fastspring/FastSpring.java){:target="_blank"}{:rel="noopener"}:

| Parameter | Required | Set by | Meaning |
|-----------|----------|--------|---------|
| `apiKey` | yes | you (fixed value) | Number of the NetLicensing API key token created in the previous step |
| `productNumber` | yes | you (fixed value) | NetLicensing product |
| `licenseTemplateList` | yes | you (fixed value) | Comma-separated license template numbers |
| `saveUserData` | no | you (fixed value) | `true` saves the order data as a custom property of the licensee |
| `quantityToLicensee` | no | you (fixed value) | See [Quantity support](#quantity-support) |
| `reference` | yes | FastSpring order parameter | Order reference, used in the Gateway log |
| `quantity` | yes | FastSpring order parameter | Quantity purchased, at least 1 |
| `name` | no | FastSpring order parameter | Customer name, saved when `saveUserData` is `true` |
| `tags` | no | FastSpring order parameter | JSON that may contain `licenseeNumber`; see Step 3, option A |
| `security_request_hash` | yes | FastSpring | Request hash that the Gateway checks against the private key stored on the token |

If the Gateway answers `Property 'fastspringPrivateKey' do not match`, the private key on the token differs from the one on the FastSpring **Security** subpage.

#### Step 3: Solution for Subscription renewal

**Option A:** by requesting existing licensee number

This mode of subscription renewal requires an existing licensee number to be passed to the code generator. This is accomplished by passing `licenseeNumber` with the `tags` parameter. In a Contextual store, custom data is passed with the `tags` object of the [FastSpring session object](https://developer.fastspring.com/reference/session-object){:target="_blank"}{:rel="noopener nofollow"} ("tags can be accessed in webhooks and server-side integrations"), for example `tags: { licenseeNumber: "CUST-1001" }`. Test this in your store's test mode before you go live. Note that FastSpring's license-script documentation uses *tags* in a different sense (product-level tags with quantities); the Gateway expects the order `tags` described here.

Note: Since only a single licensee number can be used, **quantityToLicensee** must be set to **false**.

**Option B:** by licenses transfer

This renewal mode uses a licenses transfer feature of NetLicensing. It requires a call to the [Licensee/transfer](licensee-services#transfer-licenses) method from the client software, see [Transferring licenses between licensees](transferring-licenses-between-licensees) on NetLicensing Wiki for details how to setup and use this method. Note that NetLicensing Gateway will already mark licensees for transfer as required.

**Option C:** by FastSpring webhooks

Webhooks tell you about every renewal, cancellation, refund and overdue payment, which the remote request cannot do. See [Renewals and cancellations](#renewals-and-cancellations).

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

If an error happens in the Gateway, the request fails, and the Gateway logs the error with the order `reference`. FastSpring's documentation says that the `order.completed` webhook does not fire for failed fulfillments, and that a [`fulfillment.failed`](https://developer.fastspring.com/reference/fulfillmentfailed){:target="_blank"}{:rel="noopener nofollow"} webhook fires when fulfillment steps fail after a successful payment. Subscribe to `fulfillment.failed` in your FastSpring webhook settings to be told about it; its payload contains the order `reference`. You can use the reference to retrieve the NetLicensing Gateway log with the following request (HTTP Basic authentication with your NetLicensing credentials, which the Gateway forwards to NetLicensing):

```
https://gateway.netlicensing.io/fastspring/log/{productNumber}[?reference={reference}]
```

* **productNumber** - same as for codegen endpoint (see above)
* **reference** - Optional order reference from FastSpring. If 'reference' parameter omitted, the entire log for the given productNumber is returned.

NetLicensing Gateway keeps the logs for 30 days, however, logs are only kept in memory and will be lost on gateway maintenance, therefore we encourage you to retrieve the logs as soon as possible upon error detection.

### Non-existing product case

If you see `NotFoundException: Requested product does not exist` instead of the log, ensure your productNumber is correct. If the same productNumber was used for the failed `codegen` call, the failure was due to the wrong productNumber, no logs can be retrieved in this case.

## Renewals and cancellations

The remote request creates licenses when the order is processed. For the rest of the subscription lifecycle, use FastSpring webhooks: `subscription.charge.completed` (renewal), `subscription.deactivated` (end of a cancelled subscription), `subscription.payment.overdue`, `subscription.paused` and `subscription.resumed`, and `return.created` (refund). The [FastSpring Licensing Integration](fastspring-licensing) explains the events, the signature check and the retry behavior.

Its [receiver script](fastspring-receiver) is not meant to run next to this connector: it creates its own licensees (numbered with the FastSpring account id) and licenses for `order.completed`, so both would license the first purchase. To keep the connector, handle only the later events in your own receiver and address the Gateway's licensees, for example through the licensee number in the order `tags` (option A above). To start fresh, use the webhook integration alone.

## Example: the calls

```text
Buyer        FastSpring                      NetLicensing Gateway          NetLicensing
|            |                               |                             |
|-- order -->|                               |                             |
|            |-- POST /fastspring/codegen/ ->| check security_request_hash |
|            |   (form fields)               |-- create licensee(s) ------>|
|            |                               |-- create licenses --------->|
|            |<-- licensee numbers ----------|                             |
|<- e-mail --|   (one per line, plain text)  |                             |
```

### 1. FastSpring calls the Gateway

A Remote Server Request is a form POST. The Gateway reads the parameters you configure in FastSpring (`apiKey`, `productNumber`, `licenseTemplateList`, and optionally `saveUserData`, `quantityToLicensee`) together with the order fields FastSpring adds (`reference`, `quantity`, `name`, `tags`):

```http
POST /fastspring/codegen/ HTTP/1.1
Host: gateway.netlicensing.io
Content-Type: application/x-www-form-urlencoded

apiKey=<NetLicensing API key>&productNumber=PSUBS-DEMO&licenseTemplateList=ESUBS01-DEMO&saveUserData=true&reference=ABC123456-7891-01112&quantity=1&name=Jane+Doe&security_request_hash=<md5 hex>
```

### 2. What the Gateway checks

The Gateway recomputes the hash with the `fastspringPrivateKey` stored on the API key's token, exactly like this (Gateway source, `FastSpring.isPrivateKeyValid`):

```python
import hashlib
from urllib.parse import parse_qsl

def gateway_hash(form_body: str, private_key: str) -> str:
    fields = dict(parse_qsl(form_body, keep_blank_values=True))
    data = "".join(fields[k].replace("\\", "")          # values sorted by parameter name, backslashes removed
                   for k in sorted(fields) if k != "security_request_hash")
    return hashlib.md5((data + private_key).encode()).hexdigest()
```

Every field FastSpring sends counts, so compare with a real request in the Gateway log if the check fails.

### 3. What the Gateway answers

Plain text: a line break, then one licensee number per line. FastSpring delivers it to the buyer as the license.

```text
I4F6HUDGM
```

### 4. Read the Gateway log

```bash
curl --user "$NETLICENSING_USER:$NETLICENSING_PASSWORD" \
  "https://gateway.netlicensing.io/fastspring/log/PSUBS-DEMO?reference=ABC123456-7891-01112"
```

## References

* FastSpring: [License Keys](https://developer.fastspring.com/docs/license-key-fulfillments){:target="_blank"}{:rel="noopener nofollow"} (Remote Server Request)
* FastSpring: [License Management integrations](https://developer.fastspring.com/docs/license-management-integrations){:target="_blank"}{:rel="noopener nofollow"}, which lists NetLicensing
* FastSpring: [Migrate from Classic to Contextual Commerce](https://developer.fastspring.com/docs/classic-commerce-upgrade-overview){:target="_blank"}{:rel="noopener nofollow"}
* [FastSpring Licensing Integration](fastspring-licensing) (webhooks, without the Gateway)
