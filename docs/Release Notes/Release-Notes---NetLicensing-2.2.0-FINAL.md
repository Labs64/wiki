---
layout: default
title:
parent: Release Notes
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.2.0-FINAL
=======================================================================



    ** Feature
        * [LMB-659] - Floating Licensing Model
        * [LMB-760] - NetLicensing demo virtual appliance
        * [LMB-683] - Java client library (NetLicensingClient-java)

    ** Improvement
        * [LMB-883] - Add icons to popup menu
        * [LMB-628] - NetLicensing Manage info icons
        * [LMB-838] - Adapt icons for retina display
        * [LMB-492] - Fine-tuned demo data creation
        * [LMB-284] - Style improvements NetLicensing Shop
        * [LMB-344] - Make "cancel" link in NetLicensing Shop configurable by vendor
        * [LMB-811] - Improved LicenseeService documentation
        * [LMB-868] - Revisited Licensing Models description
        * [LMB-812] - Documented how to delete custom properties
        * [LMB-657] - Comply PayPal-System-Updates

    ** Bug
        * [LMB-635] - Registration view is broken if user is already logged in
        * [LMB-784] - Token is listed by LIST, but then can't be retrieved by GET -> expired
        * [LMB-785] - Misconfiguration in one of the product modules prevents entire product validation
        * [LMB-809] - Incorrect content type for schema 2.1
        * [LMB-911] - Try&Buy: Multiple try licenses can be added
        * [LMB-844] - Problems with symbols in Number "?? !#$%&'()*+,-./:;<"
        * [LMB-817] - Do not trigger PSP for the "zero"-amounts
        * [LMB-651] - When new license template is created from the product module context menu, license type drop-down selection is not updated
        * [LMB-846] - xmldsig included in JavaDoc
        * [LMB-828] - NetLicensing Agent: request without authentication is not handled properly
        * [LMB-830] - NetLicensing Agent: „No active modules“ error is not passed through
        * [LMB-891] - Pending licenses activation through null payment
        * [LMB-892] - Product module LM can be changed via REST API even when PM is in use
