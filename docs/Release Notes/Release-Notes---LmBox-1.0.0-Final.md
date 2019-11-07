---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - LmBox 1.0.0-Final
================================================================


    ** Feature
        * [LMB-35] - LmBoxManage: Enable deletion for entities
        * [LMB-66] - Implement auto-creation of licensees
        * [LMB-98] - Implement licensing models lookup in LmBoxManage product module edit form.
        * [LMB-101] - Introduce additional properties to License templates
        * [LMB-114] - Introduce "description" and "licensingInfo" (rich-)text fields to Product
        * [LMB-117] - Refine LmBox RESTful response format
        * [LMB-370] - Add new licensing model "TimeVolume"

    ** Improvement
        * [LMB-309] - Incorrect username/password at LmBoxManage login should lead to an error message
        * [LMB-329] - After registration at LmBox confirmation page must be shown
        * [LMB-337] - Show LmBox PayPal API name in PayPal payment method edit dialog with hint that it must to be configured in vendor's paypal.
        * [LMB-63] - Introduce filter / LmQL expression for list operation.
        * [LMB-387] - Create demo data for the TimeVolume model
        * [LMB-116] - Enable editing of additional License fixed properties in LmBoxManage
        * [LMB-118] - Change DateTime format to ISO 8601 (using javax.xml.bind.DatatypeConverter)
        * [LMB-127] - Introduce endpoint that provide the list of available licensing models
        * [LMB-129] - Fix examples in https://www.labs64.de/confluence/x/s4GJ according to new XSD
        * [LMB-134] - Implement licensee auto creation at validate

    ** Bug
        * [LMB-97] - Logout-success view has no content
        * [LMB-367] - Licenses created via shop have "vendorNumber" as custom property
        * [LMB-339] - In case paypal is not properly configured, "Proceed to checkout" silently not working.
        * [LMB-340] - Shop calls validate(), actions possible on validation, e.g. evaluation start, should not be related to shop
        * [LMB-389] - Licensee create fails for product module with automatic TimeVolume license template (Feature With Time Volume, Time Volume licensing models)
