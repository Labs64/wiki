---
layout: default
title: "Getting Started with NetLicensing: Add Licensing to Your Software"
nav_title: Getting Started
nav_order: 15
has_toc: false
description: "Add software licensing to your application with NetLicensing in three steps: plan the licensing scheme, configure the product in the Management Console, and call the validate API from your code. Includes a first validation request you can run now."
permalink: getting-started
image: assets/images/NetLicensing-GettingStarted.png
last_modified_at: 2026-10-25
redirect_from:
  - /quick-start
  - /quickstart
---

Getting Started with NetLicensing
=================================

Adding NetLicensing to your software takes three steps. First you plan which licensing models you need. Then you set
up a product with those models in the NetLicensing Management Console. Finally you add one
[validate](licensee-services#validate-licensee) call to your application and let the result decide what the user can
do. Customers buy and renew their licenses in [NetLicensing Shop](netlicensing-shop) or in your own online shop.

<img src="assets/images/NetLicensing-GettingStarted.png" alt="NetLicensing getting started: planning, setting up, integration" usemap="#getting-started">
<map name="getting-started">
<area shape="rect" coords="15,15,165,65" alt="Planning" href="planning">
<area shape="rect" coords="210,15,360,65" alt="Setting up" href="setting-up">
<area shape="rect" coords="400,15,550,65" alt="Integration" href="integration">
</map>

<script type="text/javascript"> imageMapResize(); </script>

## Try a validation request now

You don't need an account to try the API. The public demo account (user `demo`, password `demo`) is a shared sandbox
with sample products and licensees. Anyone can change it, so list the licensees that exist right now and then validate
one of them:

```bash
# list licensees in the demo account
curl --header "Accept: application/json" --user demo:demo \
  https://go.netlicensing.io/core/v2/rest/licensee

# validate one of the returned licensee numbers
curl --request POST --header "Accept: application/json" --user demo:demo \
  https://go.netlicensing.io/core/v2/rest/licensee/<licenseeNumber>/validate
```

You get one result per product module, with values such as `valid`, `expires` or `remainingQuantity` depending on the
[licensing model](licensing-models), plus a `ttl` timestamp that says how long you can reuse the result. You can also
try the same request in the browser in the
[API Test Center](https://netlicensing.io/NetLicensing-API/){:target="_blank"}{:rel="noopener"}.

## Step 1: Plan

Work out what you're licensing and how customers will pay. Is the product sold once (perpetual), for a period
(subscription) or by usage (credits, quota)? Is there a free trial or a free plan? Should a license be tied to a
device, limited to a number of people working at the same time, or neither? Are some features or editions sold
separately?

Each of these answers points to a licensing model. [Software Licensing Models Compared](software-licensing-models-compared)
and [How to plan the licensing scheme for your product](planning) help with the choice.

## Step 2: Set up

1. [Register a free vendor account](https://ui.netlicensing.io/#/register){:target="_blank"}{:rel="noopener"}.
2. In the Management Console, create a **product**, then one **product module** per licensing model, then the
   **license templates** that define what customers can obtain and at what price.
3. Create an **API key** with the role `ROLE_APIKEY_LICENSEE` for use inside your application, see
   [API Security](security#api-key-identification).

[Setting up](setting-up) walks through a complete configuration example.

## Step 3: Integrate

1. Give every customer, installation or account a unique licensee number. You can create licensees ahead of time, or
   switch on *licensee auto-create* for the product and let NetLicensing create them on their first validation.
2. Call [validate](licensee-services#validate-licensee) with that number when your application starts or when someone
   opens a licensed feature, and keep the result until its `ttl`.
3. Turn features on or off based on the result, and link to NetLicensing Shop (with a
   [shop token](token-services#create-token)) so customers can buy or renew.

Examples for your language:
[Java](java-software-licensing) ·
[C# / .NET](dotnet-software-licensing) ·
[PHP](php-software-licensing) ·
[JavaScript / Node.js](javascript-software-licensing) ·
[Python](python-software-licensing).
Overview of all SDKs: [Client Libraries](client-libraries).

## Next steps

- [Software Licensing API: Architecture and Examples](software-licensing-api)
- [Offline License Validation](offline-license-validation) for customers without a permanent internet connection
- [License Lifecycle: Activation, Expiry, Renewal and Revocation](license-lifecycle)
- [FAQ & Troubleshooting](faq)
