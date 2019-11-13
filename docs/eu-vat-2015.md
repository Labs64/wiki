---
layout: default
title: EU VAT
nav_order: 70
description: "EU VAT Rules applicable since 2015"
permalink: eu-vat-2015
---

EU VAT Rules applicable since 2015
==================================

-   [General Info](#general-info)
-   [Implementation details](#implementation-details)
    -   [VAT Applicability](#vat-applicability)
    -   [VAT Calculation and Vendor Type](#vat-calculation-and-vendor-type)
    -   [VAT Calculation and Product](#vat-calculation-and-product)
    -   [Shop and VAT Calculation Mode](#shop-and-vat-calculation-mode)
    -   [Changes to the Checkout Flow](#changes-to-the-checkout-flow)

General Info
============

From January 1st, 2015, telecommunications, broadcasting and electronic
services are** always taxed in the country where the customer
belongs\*** – regardless of whether the customer is a business or
consumer – and regardless of whether the supplier is based in the EU or
outside.

*\* For a business (taxable person) = either the country where it is
registered or the country where it has fixed premises receiving the
service.*

*\* For a consumer (non-taxable person) = the country where they are
registered, have their permanent address or usually live.*

<a href="https://ec.europa.eu/taxation_customs/business/vat/telecommunications-broadcasting-electronic-services_en" class="external-link">More details</a>

Implementation details
======================

VAT Applicability
-----------------

Below table summarizes how we apply VAT, depending on transaction
participants and their location

<table style="border:1px;"><colgroup><col><col><col><col><col></colgroup><tbody><tr><td>Transaction participants</td><td style="text-align: center;">Seller country</td><td style="text-align: center;">Buyer country</td><td style="text-align: center;">VAT</td><td style="text-align: center;">Notes</td></tr><tr><td rowspan="4">C2C<br><em>Consumer to Consumer</em></td><td>EU</td><td>EU</td><td>No VAT mention</td><td>&nbsp;</td></tr><tr><td>EU</td><td>non-EU</td><td>No VAT mention</td><td>&nbsp;</td></tr><tr><td>non-EU</td><td>EU</td><td>No VAT mention</td><td>&nbsp;</td></tr><tr><td>non-EU</td><td>non-EU</td><td>No VAT mention</td><td>&nbsp;</td></tr><tr><td rowspan="5">B2B<br><em><em>Business to&nbsp;<em>Business</em></em></em></td><td>EU (country A)</td><td>EU (country B)</td><td>No VAT (RC)</td><td>customer must account for the tax (reverse-charge mechanism)</td></tr><tr><td>EU (country A)</td><td>EU (country A)</td><td>VAT</td><td>same country</td></tr><tr><td>EU</td><td>non-EU</td><td>No VAT</td><td>&nbsp;</td></tr><tr><td>non-EU</td><td>EU</td><td>No VAT (RC)</td><td>customer must account for the tax (reverse-charge mechanism)</td></tr><tr><td>non-EU</td><td>non-EU</td><td>No VAT</td><td>&nbsp;</td></tr><tr><td rowspan="4">B2C<br><em><em>Business to&nbsp;<em>Consumer</em></em></em></td><td>EU</td><td>EU</td><td>VAT</td><td>&nbsp;</td></tr><tr><td>EU</td><td>non-EU</td><td>No VAT</td><td>&nbsp;</td></tr><tr><td>non-EU</td><td>EU</td><td>VAT</td><td>&nbsp;</td></tr><tr><td>non-EU</td><td>non-EU</td><td>No VAT</td><td>&nbsp;</td></tr></tbody></table>

VAT Calculation and Vendor Type
-------------------------------

Vat calculation depends on the vendor account type, which is
either <span style="color: rgb(0,0,0);">**Private** or</span>**<span
style="color: rgb(0,0,0);"> **Company**</span>**<span
style="color: rgb(0,0,0);">:</span>

-   **<span style="color: rgb(0,0,0);">Private</span>** - VAT is not
    applicable
-   <span style="color: rgb(0,0,0);">**Company** - VAT is applied to all
    prices.</span>

<span style="color: rgb(0,0,0);">**Vendor type** is managed in the
<a href="https://go.netlicensing.io/console/v2/content/vendor/vendor.xhtml" class="external-link">Vendor Profile</a>
section of the NetLicensing Console:</span>

<img src="assets/images/17432840/17629219.png" width="700" height="366" />

VAT Calculation and Product
---------------------------

For each product you can choose one of the two **Vat Calculation
Modes**:

1.  <span style="color: rgb(0,0,0);">**Gross**: VAT is already included
    in the specified price\* </span>

2.  <span style="color: rgb(0,0,0);"><span
    style="color: rgb(0,0,0);">**Net**: VAT is not included in the
    specified price</span></span>

*\* **Gross** mode is default for all new products and products created
prior to introduction of VAT handling.*

<span class="aui-icon icon-warning">Icon</span>

***Vat Calculation Mode **options may not be available in your pricing
plan!*

<span style="color: rgb(0,0,0);">**Vat Calculation Mode** <span
style="color: rgb(0,0,0);">is managed via</span> the Product Edit
in <span style="color: rgb(0,0,0);">the NetLicensing
Console</span>:</span>

<img src="assets/images/17432840/17629218.png" width="700" />

Shop and VAT Calculation Mode
-----------------------------

1.  **Gross** calculation mode i<span style="color: rgb(0,0,0);"><span
    style="color: rgb(0,0,0);">mplies that the VAT is already included
    in the specified price, which is reflected in the NetLicensing Shop
    as a corresponding note below the shown prices:</span></span>  
    <span
    style="color: rgb(0,0,0);"><img src="assets/images/17432840/17629217.png" width="900" />  
    </span>And VAT percentage and actual calculated amount shown on the
    checkout page as well as order confirmation:   
    <img src="assets/images/17432840/17629211.png" width="900" />  
    <span
    style="color: rgb(0,0,0);"><img src="assets/images/17432840/17629216.png" width="900" /></span>  

2.  <span style="color: rgb(0,0,0);">**Net** calculation mode implies
    that the VAT is not included in the specified price and must be
    added on top of it, if necessary. Accordingly, NetLicensing Shop
    adds a note below the shown prices:</span>  
    <img src="assets/images/17432840/17629215.png" width="900" />  
    Shopping cart view and confirmation page shows calculated VAT as a
    separate field:   
    <img src="assets/images/17432840/17629212.png" width="900" />  
    <img src="assets/images/17432840/17629214.png" width="900" />

Changes to the Checkout Flow
----------------------------

Checkout page includes new fields, required for the correct VAT
calculation:

-   Country
-   Company
-   Tax/VAT ID  
    <img src="assets/images/17432840/17629213.png" width="900" />
