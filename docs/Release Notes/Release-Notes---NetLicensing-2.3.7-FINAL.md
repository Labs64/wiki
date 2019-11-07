---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.3.7-FINAL
=======================================================================

by <span class="editor"> Konstantin Korotkov</span> on 24-04-2017

    ** Feature
        * [LMB-898] - Preparing for EU VAT changes for digital products and services since 2015
        * [LMB-579] - Transfer licenses between licensees

    ** Improvement
        * [LMB-1177] - Improve 'invalid reuse of password present in password history' handling
        * [LMB-1194] - Add validation for custom property at predefined fields
        * [LMB-1291] - LicenseeServices.validate() prepare POST method as replacement for deprecated GET
        * [LMB-1317] - NetLicensingClient-java: add discounts support
        * [LMB-1328] - Transactions: rename columns price to grandTotal, change order of the fields in transaction view page
        * [LMB-1183] - Unsuccessful payment handling page
        * [LMB-1312] - Revisit NetLicensing Shop HTTP404 page
        * [LMB-1264] - NetLicensing Management Console: allow to select product VAT mode
        * [LMB-1265] - NetLicensing Shop: VAT ID on checkout and confirmation page
        * [LMB-1266] - NetLicensing Shop: select country during checkout
        * [LMB-1267] - Transactions: new custom properties for VAT, Country, PriceMode
        * [LMB-1268] - Add configuration for VAT by country (EU)
        * [LMB-1278] - Email: VAT ID on confirmation email
        * [LMB-1288] - Add VAT/TAX ID to transaction entity
        * [LMB-1299] - NetLicensing clients: add licensee/{licenseeNumber}/transfer method

    ** Bug
        * [LMB-1193] - Licensee edit page: wrong custom properties fields handling
        * [LMB-1200] - Misleading messages are shown during password reset
