---
layout: default
title: NetLicensing (LmBox) 1.0.0-FINAL
parent: Release Notes
nav_order: 5
description: "NetLicensing (prev. LmBox) 1.0.0-FINAL"
permalink: netlicensing-1-0-0-final
---

Release Notes - LmBox 1.0.0-Final
=================================

    ** Feature
        * [LMB-26] - Refactor Object Model
        * [LMB-27] - Enable entities delete opertaion
        * [LMB-28] - Add custom properties to entities
        * [LMB-29] - Extend LmBox XML schema by messages section
        * [LMB-36] - Enable editing of custom properties for selected entities
        * [LMB-57] - Document end-points
        * [LMB-62] - "Feedback" slide-out tag on the page
        * [LMB-65] - Implement licensee validate operation
        * [LMB-68] - Sub-entities linking
        * [LMB-76] - Enable users registration
        * [LMB-80] - Introduce LmBoxShop
        * [LMB-88] - Create validate operation in licensee service
        * [LMB-161] - Implement volume discount system
        * [LMB-162] - Add "Paid Amount", "Discount" and "Currency" fields to the Transaction business entity
        * [LMB-163] - Add discounts entry to the LmBoxManage Product edit page (similar to custom properties)
        * [LMB-164] - Implement discounts validation in core
        * [LMB-165] - Add discounts calculation to LmBoxShop
        * [LMB-166] - Enable payment methods page
        * [LMB-168] - Feature expiration warning level in FeatureWithTimeVolume Licensing Model
        * [LMB-169] - Implement calculation of the warning level in FeatureWithTimeVolume Licensing Model
        * [LMB-173] - Paypal configuration instructions for vendor
        * [LMB-174] - Add read-only property to FEATURE license reporting current green/yellow/red status
        * [LMB-175] - Add custom properties to product module
        * [LMB-181] - Add product module properties "redTreshold", "yellowTreshold" (FeatureWithTimeVolume Licensing Model)
        * [LMB-183] - Documentation for vendor: redirect to LmBoxShop
        * [LMB-189] - Add "type" attribute to XML "info"
        * [LMB-192] - Introduce basic filter functionality for the list operations
        * [LMB-193] - Implement dynamic popup content on license add in LmBoxShop, that depends on selected license template
        * [LMB-198] - Prepare Licensing Model / License Template specific forms for the popup
        * [LMB-204] - Make entity tables number fields clickable
        * [LMB-205] - Introduce token service
        * [LMB-212] - Add filter controls to UI
        * [LMB-219] - Implement subtotals and discounts display
        * [LMB-239] - Return warnings for bad filter parameters
        * [LMB-251] - Shop confirmation page
        * [LMB-212] - Add filter controls to UI
        * [LMB-235] - Entities context menus should have items that open list views for linked entities with appropriate filters
        * [LMB-276] - Implement drop-down menus for links in the UI table views
        * [LMB-77] - Propose sample data creation after user registration
        * [LMB-263] - Additional parameters for Transaction
        * [LMB-275] - Synchronize C# library
        * [LMB-316] - Improve handling of parent entities numbers in frontend
        * [LMB-317] - Make license templates edit dialogs licensing model specific
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

    ** Task
        * [LMB-220] - Add filter parameter to entities list method
        * [LMB-221] - Add filter controls to product module view page
        * [LMB-231] - Add filter controls to license templates view page
        * [LMB-232] - Add filter controls to licensees templates view page
        * [LMB-233] - Add filter controls to licenses templates view page
        * [LMB-234] - Add filter controls to transactions view page
        * [LMB-249] - TimeEvaluation should only allow to purchase the feature once
        * [LMB-259] - Fix totals font in shop
        * [LMB-264] - Rollback PSP transaction in case of core failure
        * [LMB-268] - Revisite "Getting started / Integration" section
        * [LMB-281] - Shop token response shold contain link to the shop
        * [LMB-266] - Additional fields at Transaction list/view forms
        * [LMB-267] - Add dateCreated, dateClosed fields to transaction entity
        * [LMB-272] - Publish LmBox XML Schema
        * [LMB-282] - Delete "Number" column at shop's purchased items
        * [LMB-286] - Rename transaction source - EXPLICIT to SHOP
        * [LMB-314] - Rename Licensing Model TimeEvaluation to TimeLimitedEvaluation
        * [LMB-279] - Skip internal transactions in default display
        * [LMB-307] - Refactor lmBox -> LmBox
        * [LMB-311] - Sync with actual RESTful LmBoxAPI state
        * [LMB-312] - Create sample data via LmBoxAPI
        * [LMB-318] - Complete LmBoxClient-demo
        * [LMB-320] - Make parent entity numbers read-only on entity update
        * [LMB-321] - Make parent entity number selection via drop-down on entity creation
        * [LMB-322] - LM specific edit for license template
        * [LMB-323] - LM specific edit for license
        * [LMB-324] - LM specific prefill of standard fields: hidden, automatic, etc.
        * [LMB-325] - LM short description in product module edit

    ** Bug
        * [LMB-97] - Logout-success view has no content
        * [LMB-367] - Licenses created via shop have "vendorNumber" as custom property
        * [LMB-339] - In case paypal is not properly configured, "Proceed to checkout" silently not working.
        * [LMB-340] - Shop calls validate(), actions possible on validation, e.g. evaluation start, should not be related to shop
        * [LMB-389] - Licensee create fails for product module with automatic TimeVolume license template (Feature With Time Volume, Time Volume licensing models)
        * [LMB-136] - Frontend: In case of exception, the view is broken
        * [LMB-237] - Fix error 500 if shop is opened without token or with expired token
        * [LMB-249] - TimeEvaluation Licensing Model should only allow to purchase the feature once
        * [LMB-262] - Analyze / fix PROD (RC2) exceptions
        * [LMB-239] - Return warnings for bad filter parameters
        * [LMB-260] - Transaction status CANCELLED after successful payment and order confirmation page
        * [LMB-261] - License Template save operation throws exception
        * [LMB-237] - Fix error 500 if shop is opened without token or with expired token
        * [LMB-278] - Transaction link to licenses list is broken
        * [LMB-280] - Transaction close date sometimes not set
        * [LMB-248] - Token service generates shop token for non-existing licensee
        * [LMB-283] - Related licenses link not shown in auto-transaction view form
        * [LMB-315] - Product "Description" and "Licensing Information" cannot be unset
        * [LMB-341] - Fix 0 discount transfer to PayPal
        * [LMB-48] - Adjust LmBox XSD to allow only one root element <lmbox> in XML
        * [LMB-73] - New entities can not be created with auto-generated number: number set as required field in the form.
        * [LMB-69] - Create new entity fails for all entities except product.
        * [LMB-92] - Validation error produces duplicate breadcrumbs
