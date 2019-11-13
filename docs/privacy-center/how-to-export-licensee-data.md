---
layout: default
title: How to export licensee data
parent: Privacy Center
nav_order: 99
description: "How to export licensee data"
permalink: how-to-export-licensee-data
---

How to export licensee data
===========================

GDPR requires to offer your customers the ability to ask for a copy of
their data for portability reasons. The data export should be in a
machine-readable format (not human readable).

NetLicensing RESTful API
------------------------

With the help of [NetLicensing RESTful API](restful-api), you can
easily export customer's data in `XML` or `JSON` format.

Please refer to the documentation for the GET operations of the
corresponding service:

-   [Licensee Services](licensee-services) -
    to retrieve *Licensee* data using its *LicenseeNumber*
-   [License Services](license-services) -
    to retrieve *License* data, which can be filtered post-export by
    `"`licenseeNumber`"` property within single *License* entity
-   [Transaction Services](transaction-services) -
    to retrieve *Transaction* data, which can be filtered post-export by
    `"`licenseNumber`"` property within single *Transaction* entity
