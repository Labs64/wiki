---
layout: default
title: FAQ & Troubleshooting
has_children: true
nav_order: 110
description: "NetLicensing FAQ & Troubleshooting"
permalink: faq
---

FAQ & Troubleshooting
=====================

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

<img src="assets/images/paypal-selling-tools.png" width="300" />
<img src="assets/images/paypal-profile.png" width="300" />
<img src="assets/images/paypal-multicurrency.png" width="300" />
