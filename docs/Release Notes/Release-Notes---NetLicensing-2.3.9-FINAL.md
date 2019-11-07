---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.3.9-FINAL </span>
=======================================================================


    ** Feature
        * [NLIC-240] - NetLicensing Guided Tour (In-App features)
        * [NLIC-356] - Collect Licensee billing information during Shop process
        * [NLIC-660] - Signing the NetLicensing API validation response
        * [NLIC-870] - Implement PayPal recurring payments (e.g. for Subscription model)
        * [NLIC-889] - Create NetLicensing Demo web application (Docker)
        * [NLIC-1161] - On License create prefill fields from the License Template
        * [NLIC-1170] - Enable C++ client library
        * [NLIC-1197] - Introduce Pricing Table licensing model (Beta)
        * [NLIC-1198] - Integrate NetLicensing with vendor profiles (NetLicensing-over-NetLicensing)
        * [NLIC-1323] - Allow vendor login by email address and/or vendor number
        * [NLIC-1437] - Pay-per-Use licensing model: differentiate between PRE/POST-accounting
        * [NLIC-1440] - Implement "Quota" Licensing Model

    ** Improvement
        * [NLIC-749] - Add "Add License" to the context menu of the License Template
        * [NLIC-1393] - Support GET method for validate in NetLicensing Agent (legacy)
        * [NLIC-1394] - Suppress NetLicensing Java Client request/response logging in NetLicensing Agent
        * [NLIC-722] - Ensure secure communication between Client <-> NetLicensing Agent <-> NetLicensing.io
        * [NLIC-771] - Make default TTL for NetLicensing validation response configurable by vendor
        * [NLIC-1132] - Implement offline validation in NetLicensing Agent
        * [NLIC-1359] - Enable NetLicensing Agent operational data storage
        * [NLIC-1386] - Signing an NetLicensing validation response XML using XMLDSIG
        * [NLIC-1387] - Revisit/improve CLI properties for NetLicensing Agent
        * [NLIC-1415] - Provide option for vendor's pricing plan change via NetLicensing Management Console
        * [NLIC-1421] - Add transaction number to NetLicensing Shop 'successURL'
        * [NLIC-1422] - Improve 'successURL' redirects handling
        * [NLIC-1439] - NetLicensing Management Console: improve Dashboard performance
        * [NLIC-1449] - Pricing Table licensing model (beta) support in the NetLicensing client libraries
        * [NLIC-1450] - Support Pricing Table licensing model in NetLicensing Shop
        * [NLIC-1453] - Quota Licensing Model support in the NetLicensing client libraries
        * [NLIC-1466] - PayPal: Recurring Payment vendor notification
        * [NLIC-1471] - Create demo data for Pricing Table (beta) licensing model
        * [NLIC-1486] - Add possibility to cancel previous recurring payment (PayPal)
        * [NLIC-1518] - Filter NetLicensing Agent assets export per licensee(-s)
        * [NLIC-1520] - Mark exported licensees using actual export timestamp

    ** Bug
        * [NLIC-788] - Rental licensing model: TimeVolume licenses aren't sub-ordered to features in the purchase confirmation email
        * [NLIC-1115] - "Transaction exists" error thrown after PayPal checkout cancellation
        * [NLIC-1249] - Subscription -> TimeVolume license create -> startDate validation inconsistency
        * [NLIC-1425] - When Product -> VAT Calculation Mode is disabled, and there is no hint why
        * [NLIC-1428] - IE11 hangs when opening NetLicensing Shop from the Management Console
        * [NLIC-1433] - PayPal / NetLicensing Shop inconsistences
        * [NLIC-1456] - Shopping cart differs for private and business vendor types
