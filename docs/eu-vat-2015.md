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
------------

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
----------------------


### VAT Applicability

Below table summarizes how we apply VAT, depending on transaction
participants and their location

<table>
  <tbody>
    <tr>
      <td>Transaction participants</td>
      <td style="text-align: center;">Seller country</td>
      <td style="text-align: center;">Buyer country</td>
      <td style="text-align: center;">VAT</td>
      <td style="text-align: center;">Notes</td>
    </tr>
    <tr>
      <td rowspan="4">C2C<br><span markdown="1">*Consumer to Consumer*</span></td>
      <td>EU</td>
      <td>EU</td>
      <td>No VAT mention</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>EU</td>
      <td>non-EU</td>
      <td>No VAT mention</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>non-EU</td>
      <td>EU</td>
      <td>No VAT mention</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>non-EU</td>
      <td>non-EU</td>
      <td>No VAT mention</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td rowspan="5">B2B<br><span markdown="1">*Business to Business*</span></td>
      <td>EU (country A)</td>
      <td>EU (country B)</td>
      <td>No VAT (RC)</td>
      <td>customer must account for the tax (reverse-charge mechanism)</td>
    </tr>
    <tr>
      <td>EU (country A)</td>
      <td>EU (country A)</td>
      <td>VAT</td>
      <td>same country</td>
    </tr>
    <tr>
      <td>EU</td>
      <td>non-EU</td>
      <td>No VAT</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>non-EU</td>
      <td>EU</td>
      <td>No VAT (RC)</td>
      <td>customer must account for the tax (reverse-charge mechanism)</td>
    </tr>
    <tr>
      <td>non-EU</td>
      <td>non-EU</td>
      <td>No VAT</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td rowspan="4">B2C<br><span markdown="1">*Business to Consumer*</span></td>
      <td>EU</td>
      <td>EU</td>
      <td>VAT</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>EU</td>
      <td>non-EU</td>
      <td>No VAT</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>non-EU</td>
      <td>EU</td>
      <td>VAT</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>non-EU</td>
      <td>non-EU</td>
      <td>No VAT</td>
      <td>&nbsp;</td>
    </tr>
  </tbody>
</table>


### VAT Calculation and Vendor Type

Vat calculation depends on the vendor account type, which is
either **Private** or **Company**:

-   **Private** - VAT is not applicable
-   **Company** - VAT is applied to all prices.

**Vendor type** is managed in the
<a href="https://ui.netlicensing.io/#/profile" class="external-link">Vendor Profile</a> section of the NetLicensing Console:

<a href="assets/images/17432840/17629219.png" data-lightbox="eu-vat-2015" data-title="Vendor type" data-alt="Vendor type">
  <img src="assets/images/17432840/17629219.png" />
</a>


### VAT Calculation and Product

For each product you can choose one of the two **Vat Calculation
Modes**:

1.  **Gross**: VAT is already included in the specified price\*

2.  **Net**: VAT is not included in the specified price

*\* **Gross** mode is default for all new products and products created
prior to introduction of VAT handling.*

<img src="assets/images/icons/emoticons/warning.png" alt="(warning)" class="emoticon emoticon-warning" />* **Vat Calculation Mode** options may not be available in your pricing plan!*
{: .alert .alert-warning}

**Vat Calculation Mode** is managed via the Product Edit in the NetLicensing Console:

<a href="assets/images/17432840/17629218.png" data-lightbox="eu-vat-2015" data-title="Vat Calculation Mode" data-alt="Vat Calculation Mode">
  <img src="assets/images/17432840/17629218.png" />
</a>


### Shop and VAT Calculation Mode

1.  **Gross** calculation mode implies that the VAT is already included
    in the specified price, which is reflected in the NetLicensing Shop
    as a corresponding note below the shown prices:

    <a href="assets/images/17432840/17629217.png" data-lightbox="eu-vat-2015" data-title="Gross shopping" data-alt="Gross shopping">
      <img src="assets/images/17432840/17629217.png" />
    </a>

    And VAT percentage and actual calculated amount shown on the
    checkout page as well as order confirmation:

    <a href="assets/images/17432840/17629211.png" data-lightbox="eu-vat-2015" data-title="Gross checkout" data-alt="Gross checkout">
      <img src="assets/images/17432840/17629211.png" />
    </a>
    <a href="assets/images/17432840/17629216.png" data-lightbox="eu-vat-2015" data-title="Gross confirmation" data-alt="Gross confirmation">
      <img src="assets/images/17432840/17629216.png" />
    </a>

2.  **Net** calculation mode implies
    that the VAT is not included in the specified price and must be
    added on top of it, if necessary. Accordingly, NetLicensing Shop
    adds a note below the shown prices:

    <a href="assets/images/17432840/17629215.png" data-lightbox="eu-vat-2015" data-title="Net shopping" data-alt="Net shopping">
      <img src="assets/images/17432840/17629215.png" />
    </a>

    Shopping cart view and confirmation page shows calculated VAT as a
    separate field:

    <a href="assets/images/17432840/17629212.png" data-lightbox="eu-vat-2015" data-title="Net checkout" data-alt="Net checkout">
      <img src="assets/images/17432840/17629212.png" />
    </a>
    <a href="assets/images/17432840/17629214.png" data-lightbox="eu-vat-2015" data-title="Net confirmation" data-alt="Net confirmation">
      <img src="assets/images/17432840/17629214.png" />
    </a>


### Changes to the Checkout Flow

Checkout page includes new fields, required for the correct VAT
calculation:

-   Country
-   Company
-   Tax/VAT ID

<a href="assets/images/17432840/17629213.png" data-lightbox="eu-vat-2015" data-title="Checkout" data-alt="Checkout">
  <img src="assets/images/17432840/17629213.png" />
</a>
