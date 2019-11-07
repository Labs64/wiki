---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - LmBox 1.0.0-RC3
==============================================================


    ** Feature
        * [LMB-212] - Add filter controls to UI
        * [LMB-235] - Entities context menus should have items that open list views for linked entities with appropriate filters
        * [LMB-276] - Implement drop-down menus for links in the UI table views

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

    ** Bug
        * [LMB-262] - Analyze / fix PROD (RC2) exceptions
        * [LMB-239] - Return warnings for bad filter parameters
        * [LMB-260] - Transaction status CANCELLED after successful payment and order confirmation page
        * [LMB-261] - License Template save operation throws exception
        * [LMB-237] - Fix error 500 if shop is opened without token or with expired token
        * [LMB-278] - Transaction link to licenses list is broken
        * [LMB-280] - Transaction close date sometimes not set
        * [LMB-248] - Token service generates shop token for non-existing licensee
        * [LMB-283] - Related licenses link not shown in auto-transaction view form
