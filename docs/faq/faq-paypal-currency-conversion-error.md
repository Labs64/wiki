---
layout: default
title: Payment cannot be processed due to the PayPal currency conversion handling error
parent: FAQ & Troubleshooting
description: "Payment cannot be processed due to the PayPal currency conversion handling error"
permalink: faq-paypal-currency-conversion-error
---

Payment cannot be processed due to the PayPal currency conversion handling error
=============

## Problem

If merchant and buyer have different (main) currencies in their PayPal accounts and merchant restricts currency conversion – PayPal is showing following error message:

*“We aren't able to process your payment using your PayPal account at this time. Please go back to the merchant and try using a different payment method."*

## Solution

In order to resolve this issue, following steps recommended on vendor (PayPal merchant Business account) side:

Go to *“Block payments (Business) -\> Payment receiving preferences”* and select *„Yes, accept and convert them* to *U.S. Dollars.”*

See also the screenshots below for your reference (click to enlarge):

<a href="assets/images/paypal-selling-tools.png" data-lightbox="faq-paypal-currency-conversion-error" data-title="Manage API permission" data-alt="Manage API permission">
  <img src="assets/images/paypal-selling-tools.png" />
</a>

<a href="assets/images/paypal-profile.png" data-lightbox="faq-paypal-currency-conversion-error" data-title="Manage API permission" data-alt="Manage API permission">
  <img src="assets/images/paypal-profile.png" />
</a>

<a href="assets/images/paypal-multicurrency.png" data-lightbox="faq-paypal-currency-conversion-error" data-title="Manage API permission" data-alt="Manage API permission">
  <img src="assets/images/paypal-multicurrency.png" />
</a>
