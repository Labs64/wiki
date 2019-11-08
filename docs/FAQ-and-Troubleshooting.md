---
layout: default
title: FAQ & Troubleshooting
nav_order: 110
description: "FAQ & Troubleshooting"
permalink: /faq-troubleshooting
---

FAQ & Troubleshooting
=====================



-   [FAQ](#FAQ&Troubleshooting-FAQ)
    -   [What is the amount upper limit on a single PayPal
        transaction?](#FAQ&Troubleshooting-WhatistheamountupperlimitonasinglePayPaltransaction?)
    -   [Is there a limit on a number of PayPal
        transactions?](#FAQ&Troubleshooting-IstherealimitonanumberofPayPaltransactions?)
    -   [Is there a limit on the total receipts via
        PayPal?](#FAQ&Troubleshooting-IstherealimitonthetotalreceiptsviaPayPal?)
    -   [What browsers are supported by NetLicensing
        Console?](#FAQ&Troubleshooting-WhatbrowsersaresupportedbyNetLicensingConsole?)
-   [Troubleshooting](#FAQ&Troubleshooting-Troubleshooting)
    -   [Payment cannot be processed due to the PayPal currency
        conversion handling
        error](#FAQ&Troubleshooting-PaymentcannotbeprocessedduetothePayPalcurrencyconversionhandlingerror)

FAQ
===

### What is the amount upper limit on a single PayPal transaction?

As of 2013 - in European Union EUR 8'000, in United States USD 10'000,
in other countries in the same range, clarify exact amount with local
PayPal.

There may be though other limits on the buyer's side, for instance there
is an additional limit for not verified PayPal account in EU, or credit
card / bank account limits. Check with local PayPal and/or corresponding
financial institution.

### Is there a limit on a number of PayPal transactions?

There is no limit.

### Is there a limit on the total receipts via PayPal?

After a certain amount of annual receipts via PayPal (EUR 2500 in EU as
of 2013), one-time extended account verification may be required by
PayPal. Please get in contact with local PayPal for details.

### What browsers are supported by NetLicensing Console?

All popular modern browsers (Chrome, Safari, FireFox, IE/Edge, Opera)
are supported, however we only consider latest releases as recommended
by the browser vendor. The only known incompatible browser is the
Internet Explorer 11 on Windows 8.1, if you hit the problem with IE11
(page is not responding) we recommend to use Microsoft Edge instead.

Troubleshooting
===============

<span class="aui-icon icon-warning">Icon</span>

### Payment cannot be processed due to the PayPal currency conversion handling error

<span class="underline">Problem:</span>

If merchant and buyer have different (main) currencies in their PayPal
accounts and merchant restricts currency conversion – PayPal is showing
following error message:

*“We aren't able to process your payment using your PayPal account at
this time. Please go back to the merchant and try using a different
payment method."*

<span class="underline">Solution:</span>

In order to resolve this issue, following steps recommended on vendor
(PayPal merchant Business account) side:

Go to *“Block payments (Business) -\> Payment receiving preferences”*
and select *„Yes, accept and convert them* to *U.S. Dollars.”*

See also the screenshots below for your reference (click to enlarge):

<img src="assets/images/11010235/17268748.png" class="confluence-embedded-image confluence-thumbnail" width="300" /><img src="assets/images/11010235/17268749.png" class="confluence-embedded-image confluence-thumbnail" width="300" /><img src="assets/images/11010235/17268750.png" class="confluence-embedded-image confluence-thumbnail" width="300" />
