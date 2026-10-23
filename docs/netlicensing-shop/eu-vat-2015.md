---
layout: default
title: EU VAT
parent: NetLicensing Shop
nav_order: 20
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

From January 1st, 2015, telecommunications, broadcasting and electronic services are** always taxed in the country where the customer belongs\*** – regardless of whether the customer is a business or consumer – and regardless of whether the supplier is based in the EU or outside.

*\* For a business (taxable person) = either the country where it is registered or the country where it has fixed premises receiving the service.*

*\* For a consumer (non-taxable person) = the country where they are registered, have their permanent address or usually live.*

<a href="https://ec.europa.eu/taxation_customs/business/vat/telecommunications-broadcasting-electronic-services_en" target="_blank" class="external-link">More details</a>

Implementation details
----------------------

### VAT Applicability

Below table summarizes how we apply VAT, depending on transaction
participants and their location

<table>
  <tbody>
    <tr>
      <td style="text-align: center;"><strong>Transaction participants</strong></td>
      <td style="text-align: center;"><strong>Seller country</strong></td>
      <td style="text-align: center;"><strong>Buyer country</strong></td>
      <td style="text-align: center;"><strong>VAT</strong></td>
      <td style="text-align: center;"><strong>Notes</strong></td>
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
      <td>Customer must account for the tax (reverse-charge mechanism)</td>
    </tr>
    <tr>
      <td>EU (country A)</td>
      <td>EU (country A)</td>
      <td>VAT</td>
      <td>Same country</td>
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
      <td>Customer must account for the tax (reverse-charge mechanism)</td>
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


### VAT Calculation and Vendor Type

Vat calculation depends on the vendor account type, which is
either **Private** or **Company**:

-   **Private** - VAT is not applicable
-   **Company** - VAT is applied to all prices.

**Vendor type** is managed in the
<a href="https://ui.netlicensing.io/#/profile" class="external-link">Vendor Profile</a> section of the NetLicensing Console:

<a href="assets/images/eu-vat-09.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Vendor type" data-alt="Vendor type">
  <img alt="Management Console Vendor Profile with the vendor type (Private or Company) and Tax/VAT ID fields" src="assets/images/eu-vat-09.png" />
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

<a href="assets/images/eu-vat-08.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Vat Calculation Mode" data-alt="Vat Calculation Mode">
  <img alt="Management Console product settings with the VAT Calculation Mode option: Gross (VAT included in prices) or Net (VAT not included)" src="assets/images/eu-vat-08.png" />
</a>


### Shop and VAT Calculation Mode

1.  **Gross** calculation mode implies that the VAT is already included in the specified price, which is reflected in the NetLicensing Shop as a corresponding note below the shown prices:

    <a href="assets/images/eu-vat-07.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Gross shopping" data-alt="Gross shopping">
      <img alt="Shop product page listing 20, 10 and 5 unit Pay-per-Use packages with prices including sales tax/VAT" src="assets/images/eu-vat-07.png" />
    </a>

    And VAT percentage and actual calculated amount shown on the
    checkout page as well as order confirmation:

    <a href="assets/images/eu-vat-01.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Gross checkout" data-alt="Gross checkout">
      <img alt="Shop shopping cart with three Pay-per-Use packages priced including 19% VAT, a EUR 9.00 discount and a checkout form with Germany selected" src="assets/images/eu-vat-01.png" />
    </a>
    <a href="assets/images/eu-vat-06.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Gross confirmation" data-alt="Gross confirmation">
      <img alt="Order confirmation for a gross-priced order: items include VAT and the 19% VAT portion (EUR 9.31) is shown below the grand total of EUR 49.00" src="assets/images/eu-vat-06.png" />
    </a>

2.  **Net** calculation mode implies
    that the VAT is not included in the specified price and must be
    added on top of it, if necessary. Accordingly, NetLicensing Shop
    adds a note below the shown prices:

    <a href="assets/images/eu-vat-05.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Net shopping" data-alt="Net shopping">
      <img alt="Shop product page listing 20, 10 and 5 unit Pay-per-Use packages with prices excluding sales tax/VAT" src="assets/images/eu-vat-05.png" />
    </a>

    Shopping cart view and confirmation page shows calculated VAT as a
    separate field:

    <a href="assets/images/eu-vat-02.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Net checkout" data-alt="Net checkout">
      <img alt="Shop shopping cart with prices excluding VAT; 19% sales tax/VAT of EUR 9.31 is added as a separate line to a grand total of EUR 58.31" src="assets/images/eu-vat-02.png" />
    </a>
    <a href="assets/images/eu-vat-04.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Net confirmation" data-alt="Net confirmation">
      <img alt="Order confirmation for a net-priced order, showing items excluding VAT, subtotal, discount, 19% VAT and grand total" src="assets/images/eu-vat-04.png" />
    </a>


### Changes to the Checkout Flow

Checkout page includes new fields, required for the correct VAT
calculation:

-   Country
-   Company
-   Tax/VAT ID

<a href="assets/images/eu-vat-03.png" class="imagelink" data-lightbox="eu-vat-2015" data-title="Checkout" data-alt="Checkout">
  <img alt="Checkout contact information reduced to the fields relevant for VAT calculation: Country, Company and Tax/VAT ID" src="assets/images/eu-vat-03.png" />
</a>
