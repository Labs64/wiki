---
layout: default
title: PayPal
parent: Payment Service Providers
grand_parent: NetLicensing Shop
nav_order: 10
description: "PayPal"
permalink: paypal
---

PayPal
======

In order to enable PayPal as a payment method you need a Business Account at PayPal and selected payment solution **"PayPal Digital Goods (PayPal Express Checkout)"**.

You will receive all the payments processed via NetLicensing Shop directly to your PayPal account.

Recuring payment limitations

Be aware that recurring payments are not allowed by PayPal for buyers from Germany and China. In case you don't plan to use recurring payments, you can omit "Create and manage Recurring Payments" permission as well as skip entire "Step 2: Setup Instant Payment Notification".

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
    <a href="assets/images/paypal-selling-tools-03.png" class="imagelink" data-lightbox="paypal" data-title="My Selling Tools" data-alt="My Selling Tools">
      <img src="assets/images/paypal-selling-tools-03.png" />
    </a>

<!-- -->

-   Under the section `"Pre-built payment solution"` choose
    `"Grant API permission"` if adding permissions for the first time,
    or "Manage API permission" in case you already configured
    permissions for NetLicensing previously and now adding permission
    for recurring payments.
    <a href="assets/images/paypal-api-grant.png" class="imagelink" data-lightbox="paypal" data-title="Pre-built payment solution" data-alt="Pre-built payment solution">
      <img src="assets/images/paypal-api-grant.png" />
    </a>

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

    <a href="assets/images/paypal-3pp-add.png" class="imagelink" data-lightbox="paypal" data-title="Grant API permission" data-alt="Grant API permission">
      <img src="assets/images/paypal-3pp-add.png" />
    </a>
    If modifying permissions (`"Manage API permission"` option at the
    previous bullet) - click "Edit Third Party" next to the
    corresponding username

    <a href="assets/images/paypal-3pp-access.png" class="imagelink" data-lightbox="paypal" data-title="Manage API permission" data-alt="Manage API permission">
      <img src="assets/images/paypal-3pp-access.png" />
    </a>

<!-- -->

-   If configuring for the first time (`"Grant API permission"` option
    at the previous bullet) - select permissions as shown below and
    press `"Add"`
    <a href="assets/images/paypal-3pp-permissions.png" class="imagelink" data-lightbox="paypal" data-title="Grant API permission" data-alt="Grant API permission">
      <img src="assets/images/paypal-3pp-permissions.png" />
    </a>

    If modifying permissions (`"Manage API permission"` option at the
    previous bullet) - add `"Create and manage Recurring Payments"`
    permission (verify also `"Granted Permissions"` match) and press
    `"Save"`

    <a href="assets/images/paypal-3pp-permissions-recurring.png" class="imagelink" data-lightbox="paypal" data-title="Granted Permissions" data-alt="Granted Permissions">
      <img src="assets/images/paypal-3pp-permissions-recurring.png" />
    </a>

<!-- -->

-   You have now enabled NetLicensing to call PayPal API on your behalf
    to receive one-time and recurring payments
    <a href="assets/images/paypal-3pp-access-02.png" class="imagelink" data-lightbox="paypal" data-title="PayPal API" data-alt="PayPal API">
      <img src="assets/images/paypal-3pp-access-02.png" />
    </a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Step2: Setup Instant Payment
Notification</span>

Once Recurring Payment is active, every related event happening on
PayPal (payment, cancellation, etc.) must be communicated to
NetLicensing. We use
<a href="https://developer.paypal.com/docs/classic/products/instant-payment-notification/" class="external-link">PayPal Instance Payment Notification (IPN)</a>
mechanism to achieve this.

PayPal only allows a single notification URL per account. When it points
to NetLicensing endpoint, PayPal will send *all* notifications related
to your PayPal account to NetLicensing. It may not be always desirable,
in this case we recommend creating a separate PayPal account for using
with NetLicensing.

Follow steps below to set up IPN:

-   Choose first "`My Selling Tools`", then
    "`Instant Payment Notification`"
    <a href="assets/images/paypal-selling-tools-02.png" class="imagelink" data-lightbox="paypal" data-title="Instant Payment Notification" data-alt="Instant Payment Notification">
      <img src="assets/images/paypal-selling-tools-02.png" />
    </a>
-   Press "`Choose IPN Settings`"
    <a href="assets/images/paypal-ipn-02.png" class="imagelink" data-lightbox="paypal" data-title="Choose IPN Settings" data-alt="Choose IPN Settings">
      <img src="assets/images/paypal-ipn-02.png" />
    </a>
-   Set up Notification URL
    "*`https://go.netlicensing.io/core/v2/external/paypal/ipn/`*" and
    press Save button
    <a href="assets/images/paypal-ipn-edit.png" class="imagelink" data-lightbox="paypal" data-title="Set up Notification URL" data-alt="Set up Notification URL">
      <img src="assets/images/paypal-ipn-edit.png" />
    </a>
-   Instant Payment Notification for NetLicensing is now enabled
    <a href="assets/images/paypal-ipn.png" class="imagelink" data-lightbox="paypal" data-title="Instant Payment Notification" data-alt="Instant Payment Notification">
      <img src="assets/images/paypal-ipn.png" />
    </a>

<span
class="expand-control-icon"><img src="assets/images/icons/grey_arrow_down.png" class="expand-control-image" /></span><span
class="expand-control-text">Step3: Configure NetLicensing</span>

-   Enable *PayPal* or *PayPal (Sandbox)* as a payment method at "Settings / Payment Methods"
-   Provide *Subject* (typically this is the email address your PayPal account is associated with)
