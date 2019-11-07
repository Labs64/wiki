---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

PayPal </span>
=====================================

modified on 18-11-2018

<span class="aui-icon icon-success">Icon</span>

In order to enable PayPal as a payment method you need a Business
Account at PayPal and selected payment solution **"PayPal Digital Goods
(PayPal Express Checkout)"**.

You will receive all the payments processed via NetLicensing Shop
directly to your PayPal account.

Recuring payment limitations

<span class="aui-icon icon-warning">Icon</span>

Be aware that recurring payments are not allowed by PayPal for buyers
from Germany and China. In case you don't plan to use recurring
payments, you can omit "Create and manage Recurring Payments" permission
as well as skip entire "Step 2: Setup Instant Payment Notification".

 

 

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Step1: Configure PayPal</span>

Configure permissions for NetLicensing:

-   Login to PayPal under your account

<!-- -->

-   Under `"Profile"` choose `"Account settings"`

<!-- -->

-   Choose "`My Selling Tools`", then click `"Update"` next to
    "`API Access`"  
    <img src="assets/images/11010239/17629239.png" class="confluence-embedded-image" />

<!-- -->

-   Under the section `"Pre-built payment solution"` choose
    `"Grant API permission"` if adding permissions for the first time,
    or "Manage API permission" in case you already configured
    permissions for NetLicensing previously and now adding permission
    for recurring payments.  
    <img src="assets/images/11010239/17629240.png" class="confluence-embedded-image" />

<!-- -->

-   If configuring for the first time (`"Grant API permission"` option
    at the previous bullet) - enter PayPal API Username of Labs64
    NetLicensing and press "`Lookup`"
    -   API username for the
        <a href="https://www.paypal.com" class="external-link">PayPal Live</a>
        service: *"**`paypal_api1.labs64.de`"*
    -   API username for the
        <a href="https://www.sandbox.paypal.com" class="external-link">PayPal Sandbox</a>
        (<a href="https://www.sandbox.paypal.com/" class="external-link">https://www.sandbox.paypal.com</a>):
        *"*`paypal-sandbox_api1.labs64.de`*"*

    <img src="assets/images/11010239/17629242.png" class="confluence-embedded-image" />  
    If modifying permissions (`"Manage API permission"` option at the
    previous bullet) - click "Edit Third Party" next to the
    corresponding username  

    <img src="assets/images/11010239/17629241.png" class="confluence-embedded-image" />

<!-- -->

-   If configuring for the first time (`"Grant API permission"` option
    at the previous bullet) - select permissions as shown below and
    press `"Add"`  
    <img src="assets/images/11010239/17629243.png" class="confluence-embedded-image" />  

    If modifying permissions (`"Manage API permission"` option at the
    previous bullet) - add `"Create and manage Recurring Payments"`
    permission (verify also `"Granted Permissions"` match) and press
    `"Save"`  

    <img src="assets/images/11010239/17629244.png" class="confluence-embedded-image" />

<!-- -->

-   You have now enabled NetLicensing to call PayPal API on your behalf
    to receive one-time and recurring payments  
    <img src="assets/images/11010239/17629245.png" class="confluence-embedded-image" />

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Step2: Setup Instant Payment
Notification</span>

Once Recurring Payment is active, every related event happening on
PayPal (payment, cancellation, etc.) must be communicated to
NetLicensing. We use
<a href="https://developer.paypal.com/docs/classic/products/instant-payment-notification/" class="external-link">PayPal Instance Payment Notification (IPN)</a>
mechanism to achieve this.

<span class="aui-icon icon-problem">Icon</span>

PayPal only allows a single notification URL per account. When it points
to NetLicensing endpoint, PayPal will send *all* notifications related
to your PayPal account to NetLicensing. It may not be always desirable,
in this case we recommend creating a separate PayPal account for using
with NetLicensing.

Follow steps below to set up IPN:

-   Choose first "`My Selling Tools`", then
    "`Instant Payment Notification`"  
    <img src="assets/images/11010239/17629222.png" class="confluence-embedded-image" />
-   Press "`Choose IPN Settings`"  
    <img src="assets/images/11010239/17629223.png" class="confluence-embedded-image" />
-   Set up Notification URL
    "*`https://go.netlicensing.io/core/v2/external/paypal/ipn/`*" and
    press Save button  
    <img src="assets/images/11010239/17629224.png" class="confluence-embedded-image" />
-   Instant Payment Notification for NetLicensing is now enabled  
    <img src="assets/images/11010239/17629221.png" class="confluence-embedded-image" />

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Step3: Configure NetLicensing</span>

-   Enable *PayPal* or *PayPal (Sandbox)* as a payment method at
    "Settings / Payment Methods"
-   Provide *Subject* (typically this is the email address your PayPal
    account is associated with)

 

<span style="white-space: pre-wrap;">  
</span>
