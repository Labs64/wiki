---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.0.2-FINAL </span>
=======================================================================


    ** Feature
        * [LMB-592] - Allow navigation to shop from licensee column of licenses list
        * [LMB-644] - APIKey authentication using HTTP Basic introduced
        * [LMB-518] - Add "Add license template" to the product module context menu in the license templates list
        * [LMB-538] - On the order confirmation page with multiple product modules, table columns are not aligned
     
    ** Improvement
        * [LMB-647] - APIKey authentication documentation
        * [LMB-649] - Add APIKey authentication to the PHP library
        * [LMB-668] - Add APIKey authentication to the C# library
     
    ** Bug
        * [LMB-680] - TokenService naming inconsistency between interfaces (Java / RESTful / C#)
        * [LMB-548] - Licensee edit form doesn't have "Name" field, while table view has corresponding column
        * [LMB-571] - Server error 500 when POST is sent with content type other than 'x-www-form-urlencoded'
        * [LMB-588] - Calendar calculations across the date of DST change cause mismatches in timezone
        * [LMB-594] - Add/delete empty entry for custom properties in frontend is not working consistently
        * [LMB-678] - Production server responds with "LmBox" instead of "NetLicensing" in the reply headers
        * [LMB-679] - Link to Labs64 logo in confirmation email is broken
        * [LMB-689] - Try & Buy Licensing Model + licensee auto-create: evaluation license created on validate even if inactive one already exists
        * [LMB-696] - Inactive licensee passes validation
        * [LMB-705] - Reset password form is broken
