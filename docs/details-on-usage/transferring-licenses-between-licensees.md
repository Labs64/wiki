---
layout: default
title: Transferring licenses between licensees
parent: Details on Usage
nav_order: 99
description: "Transferring licenses between licensees"
permalink: transferring-licenses-between-licensees
---

Transferring licenses between licensees
=======================================


Motivation
----------

In NetLicensing, [licenses](object-model) are
bound to the [licensee](object-model) via
*licensee number* - unique identifier for the licensee. When
NetLicensing used with external eCommerce system, it is often not
possible to pass existing *licensee number* to a shopping session, so
that newly purchased licenses are bound to already existing licensee.
This makes it difficult to use external eCommerce together with
[licensing models](licensing-models) requiring licenses
renewal or extension, such as [Subscription](subscription)
or [Pay-per-Use](pay-per-use). To overcome this problem,
NetLicensing allows to bind renewal / extension licenses to a temporary
licensee, and transfer these licenses to the target licensee later on.

Workflow
--------

In the following workflow we will use the term *licensee number* when
referring to NetLicensing and *license key* when referring to an
external eCommerce system. When using NetLicensing with external
eCommerce, *licensee number* is mapped to eCommerce's *license key*.

Typical flow for eCommerce shopping session:

1.  Customer enters online shop via link provided by vendor / software
2.  Customer adds products (licenses) to the shopping cart
3.  Customer goes through payment process
4.  eCommerce system executes custom fulfillment script configured by
    vendor, that returns *license key* -\> connection to NetLicensing
5.  eCommerce delivers *license key* to the customer

Fulfillment script for NetLicensing will typically do the following:

1.  Create new licensee and receive its *licensee number*
2.  Add licenses according to the shopping cart content
3.  Mark licensee for transfer
4.  Return the new *licensee number* as *license key*

And here's how the software will use the *license key* that customer
received from eCommerce:

1.  Obtain the *license key* from the user
2.  Call [transfer](licensee-services#transfer-licenses) method for own
    *licensee number*, passing the received *license key* as source
    *licensee number*
3.  [Validate](licensee-services#validate-licensee) as usual for own
    *licensee number*

Above workflow assumes that own *licensee number* already exists,
naturally, *license key* received from eCommerce for the first time can
as well be assigned as own *licensee number*.

API Example
-----------

Following example calls assume the product and target licensee already
configured with the following numbers:

```
productNumber: PQVJQ5F7H
licenseeNumber (target): I542PBSID
```


The purchase fulfillment script will execute the following calls:

1.  Create new (temporary) licensee and receive its *licensee number*
    (`I762LBSSX` in this example)

    <span
    class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
    class="expand-control-text">Example</span>

    <div>Request</div>
    {: .code-example .ml-5 .code-header }
    ```http
    POST https://go.netlicensing.io/core/v2/rest/licensee
    productNumber=PQVJQ5F7H&active=true
    Accept: application/xml
    Content-Type: application/x-www-form-urlencoded
    ```
    {: .ml-5 }

    <div>Response</div>
    {: .code-example .ml-5 .code-header }
    ```xml
    <netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
        <items>
            <item type="Licensee">
                <property name="number">I762LBSSX</property>
                <property name="active">true</property>
                <property name="productNumber">PQVJQ5F7H</property>
            </item>
        </items>
    </netlicensing>
    ```
    {: .ml-5 }

2.  Add licenses to the new licensee according to the shopping cart
    content

    <span
    class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
    class="expand-control-text">Example</span>

    <div>Request</div>
    {: .code-example .ml-5 .code-header }
    ```http
    POST https://go.netlicensing.io/core/v2/rest/license
    licenseeNumber=I762LBSSX&licenseTemplateNumber=EUJOJ74GS&active=true
    Accept: application/xml
    Content-Type: application/x-www-form-urlencoded
    ```
    {: .ml-5 }

    <div>Response</div>
    {: .code-example .ml-5 .code-header }
    ```xml
    <netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
        <items>
            <item type="License">
                <property name="number">IKPQGUUJ4</property>
                <property name="active">true</property>
            </item>
        </items>
    </netlicensing>
    ```
    {: .ml-5 }

3.  Mark the new licensee for transfer

    <span
    class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
    class="expand-control-text">Example</span>

    <div>Request</div>
    {: .code-example .ml-5 .code-header }
    ```http
    POST https://go.netlicensing.io/core/v2/rest/licensee/I762LBSSX
    markedForTransfer=true
    Accept: application/xml
    Content-Type: application/x-www-form-urlencoded
    ```
    {: .ml-5 }

    <div>Response</div>
    {: .code-example .ml-5 .code-header }
    ```xml
    <netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
        <items>
            <item type="Licensee">
                <property name="number">I762LBSSX</property>
                <property name="active">true</property>
                <property name="productNumber">PQVJQ5F7H</property>
                <property name="markedForTransfer">true</property>
            </item>
        </items>
    </netlicensing>
    ```
    {: .ml-5 }

Now the new licensee number `I762LBSSX` to be communicated to the
software at the end user, e.g. via the purchase confirmation page /
email and entered manually by the user, notification URL, or by any
other means. The permanent licensee number `I542PBSID` is already
assigned to the end user and is known to the software. When the software
receives the new (temporary) licensee number, it will execute the
following:

1.  Call [transfer](licensee-services#transfer-licenses) method
    for permanent licensee number `I542PBSID`, passing the new licensee
    number `I762LBSSX` as `sourceLicenseeNumber` parameter

     

    <span
    class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
    class="expand-control-text">Example</span>

    <div>Request</div>
    {: .code-example .ml-5 .code-header }
    ```http
    POST https://go.netlicensing.io/core/v2/rest/licensee/I542PBSID/transfer
    sourceLicenseeNumber=I762LBSSX
    Accept: application/xml
    Content-Type: application/x-www-form-urlencoded
    ```
    {: .ml-5 }

    <div>Response</div>
    {: .code-example .ml-5 .code-header }
    ```html
    HTTP/1.1 204 No Content
    ```
    {: .ml-5 }
