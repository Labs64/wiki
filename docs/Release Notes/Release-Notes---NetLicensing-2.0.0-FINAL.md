---
layout: default
title:
parent: Release Notes
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.0.0-FINAL
=======================================================================


    ** Feature
        * [LMB-576] - Introduce authentication via APIKey (token)
        * [LMB-577] - Provide licensee “Name” attribute during validation call
        * [LMB-597] - Prevent vendor registration with already known email
        * [LMB-622] - Generate shop URL through APIKey
     
    ** Improvement
        * [LMB-643] - Extend token service documentation
        * [LMB-650] - Revisit NetLicensing Manage UI texts
        * [LMB-608] - Add frontend view for APIKey maintenance
        * [LMB-664] - Introduce request identifier attribute in NLIC XML schema
        * [LMB-674] - Update RishFaces to the version 4.3.6.Final
        * [LMB-575] - Length of licensee.number field is only 20 chars
     
    ** Bug
        * [LMB-519] - Pagination with filter is broken
        * [LMB-618] - Not existing user for eMail address support@labs64.com
        * [LMB-534] - In case shop is opened with expired token, no error is shown, page shows empty template
        * [LMB-564] - Attempt to login with not activated account is silently ignored
        * [LMB-573] - Handling of inactive entities is incorrect
        * [LMB-574] - Shop :: LicensingModel 'FeatureWithTimeVolume' - no feature licenses is not handled
        * [LMB-617] - Tax/VAT ID cannot be saved
        * [LMB-653] - Regular confirmation page is shown on unsuccessful shopping cart checkout
        * [LMB-654] - Shop checkout for 'FeatureWithTimeVolume' Licensing Model may activate licenses in wrong order that cause failing checkout
