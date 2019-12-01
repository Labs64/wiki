---
layout: default
title: How to delete licensee data
parent: Privacy Center
nav_order: 99
description: "How to delete licensee data"
permalink: how-to-delete-licensee-data
---

How to delete licensee data
===========================

GDPR requires you to delete customers' data on their request.

NetLicensing Management Console
-------------------------------

<span class="hardreadability">Log in to the NetLicensing Management Console using your vendor account and expand the section `"Operate"`</span>.

<span class="hardreadability">You can access customer's data such as profile details, licenses and transaction, by choosing menu item <a href="https://ui.netlicensing.io/#/customers" class="external-link">Customers</a></span>.

By clicking on a single list entry and selecting `"Delete"` you can delete entity and all descendants (*License, Transaction*).

<a href="https://ui.netlicensing.io/#/customers" class="external-link"><img src="assets/images/gdpr-delete-licensee.png" title="Operate - Delete Licensee" alt="Operate - Delete Licensee" width="800" /></a>  

NetLicensing RESTful API
------------------------

With the help of [NetLicensing RESTful API](restful-api),
you can easily delete customer's data.

Please refer to the documentation for the DELETE operations of the
corresponding service:

-   [Licensee Services](licensee-services#delete-licensee) -
    to delete *Licensee* data using its *LicenseeNumber*

Did you know?

<span class="aui-icon icon-hint">Icon</span>

`"forceCascade"` query param, forces *Licensee* entity deletion and
all descendants (*License, Transaction*)

-   [License Services](license-services#delete-license) -
    to *delete License* data using its *LicenseNumber*
-   [Transaction Services](transaction-services) -
    to *delete Transaction* data using its **Transaction*Number*

Tips
----

-   We recommend you to execute data deletion using two-step approach:
    1.  Collect and verify all relevant (to be deleted) entities identifiers as it is described [here](how-to-export-licensee-data)
    2.  Delete data after careful verification of to be deleted entities

<span class="aui-icon icon-problem">Icon</span>

Please note: deleted data cannot be restored anymore, so your customers
might be not validated in your products and services!
