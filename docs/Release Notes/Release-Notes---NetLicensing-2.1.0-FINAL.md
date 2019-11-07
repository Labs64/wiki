---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.1.0-FINAL </span>
=======================================================================


    ** Feature
        * [LMB-626] - Rename NetLicensing Licensing Models (Try & Buy, Subscription, Rental)
        * [LMB-631] - Vendor Dashboard
        * [LMB-820] - NetLicensing Agent

    ** Improvement
        * [LMB-819] - Update XML Schema at NetLicensing client libraries
        * [LMB-543] - Modify user-agent string in NetLicensing client libraries
        * [LMB-695] - On license create/edit once licensee is selected, only show license templates of the corresponding product in the drop-down
        * [LMB-686] - Move tokenType parameter in TokenService::list to the filter

    ** Bug
        * [LMB-719] - Missing services in NetLicensing C# client+demo library
        * [LMB-677] - HTTP 401 "Unauthorized" for DELETE requests replaced with HTTP 403 "Forbidden"
        * [LMB-690] - Try&Buy: it is possible to set timeVolume for evaluation license to 0 in edit, causing error on validate
        * [LMB-693] - No transaction added for licensee auto-create and corresponding automatic licenses
        * [LMB-694] - Licensee is bound to the product, it is however possible to add a license based on license template of another product
        * [LMB-697] - "Feature" is shown in the drop-down for license type in "Subscription" Licensing Model
        * [LMB-700] - Fields prefill in License Template edit is broken
        * [LMB-685] - toString() method of DB entities alters entity state
        * [LMB-741] - Fix LicenseTemplateService.update method
        * [LMB-778] - Set correct content type for error responses
        * [LMB-786] - Shop cancel link is broken
        * [LMB-787] - Shop: when add license popup is closed by "cancel", add license action is no more working
        * [LMB-783] - Shop token is shown as APIKey in the UI
        * [LMB-807] - Customization and shopping cart data is not reset on shop open in same browser session
        * [LMB-815] - Not existing property expected at Licensing Model
