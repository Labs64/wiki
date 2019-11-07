---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.4.0-FINAL
=======================================================================


    ** Feature
        * [NLIC-623] - Support multiple APIKeys with different roles
        * [NLIC-661] - NetLicensing Agent protection by hardware dongle; offline mode
        * [NLIC-1446] - Enable new licensing model "Pricing Table (beta)"

    ** Improvement
        * [NLIC-737] - Improve NetLicensing RESTful API documentation
        * [NLIC-1628] - NetLicensing Shop: Update Stripe integration API
        * [NLIC-904] - NetLicensing Shop: Verify accept payments with Stripe functionality
        * [NLIC-638] - NetLicensing Core: Enable CORS
        * [NLIC-932] - NetLicensing Console: Dashboard Y-Axis is bounded by max value over whole time period
        * [NLIC-978] - NetLicensing Console: Show current licensing model info at the top of license template edit page
        * [NLIC-907] - NetLicensing Console: Include "Add Product Module" in the Product drop-down of the Product Modules list
        * [NLIC-927] - NetLicensing Console: Add context menu entry to the product on product modules list
        * [NLIC-1131] - NetLicensing Agent: Add product setup export / import functionality
        * [NLIC-1449] - Add support for Licensing Model "Pricing Table" in NetLicensing Client Libraries
        * [NLIC-1529] - NetLicensing Console: Prevent edit number if entity in use
        * [NLIC-1710] - GDPR: Collect customer consent in shop
        * [NLIC-1027] - NetLicensing Shop: Clear ToS/PP checkbox upon navigating away from shopping cart
        * [NLIC-1044] - "Rental" Licensing Model: Add feature license name entry field must have focus by default
        * [NLIC-1420] - NetLicensing Console: Show username in management console
        * [NLIC-1549] - Restrict usernames character set to aplhanumeric only
        * [NLIC-1587] - NetLicensing Agent: Enable CORS
        * [NLIC-1615] - NetLicensing Agent: Implement exit codes

    ** Bug
        * [NLIC-712] - By editing email in existing vendor account it is possible to have two accounts with the same email
        * [NLIC-1410] - NetLicensing Console: Product, Product Module Number, License Template Number cannot be found in dropdown box
        * [NLIC-1558] - NetLicensing Console: Cancel URL is not set properly for the plan upgrade shop session
        * [NLIC-1561] - NetLicensing Shop: Confirmation email showing all sub-licenses for pricing tables
        * [NLIC-1571] - NetLicensing Console: Creating APIKey in console broken
        * [NLIC-1640] - NetLicensing Console: Vendor Profile Website validation pattern improvements
        * [NLIC-1655] - Attempt to create a product module with non-existing Licensing Model results in 402 instead of 400
        * [NLIC-1719] - Return from NetLicensing Shop to NetLicensing Console showing an error
