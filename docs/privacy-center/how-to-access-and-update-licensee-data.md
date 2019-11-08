---
layout: default
title: How to access and update licensee data
parent: Privacy Center
nav_order: 99
description: "How to access and update licensee data"
permalink: how-to-access-and-update-licensee-data
---

How to access and update licensee data
======================================


<span class="veryhardreadability">In NetLicensing the personal data of
the data subjects is usually </span><span class="passivevoice">being
stored</span><span class="veryhardreadability"> in the *Licensee*,
*License* and *Transaction* entities (please refer to the [NetLicensing
Object Model](object-model) for more info on
the entities relationship)</span>.

You can always access the data stored in those entities using following
options:



NetLicensing Management Console
-------------------------------

<span class="hardreadability">Log in to the NetLicensing Management
Console using your vendor account and expand the section
`"Operate"`</span>.

<span class="hardreadability">By choosing corresponding menu item for
<a href="https://go.netlicensing.io/console/v2/content/vendor/licensee.xhtml" class="external-link">Licensee</a>,
<a href="https://go.netlicensing.io/console/v2/content/vendor/license.xhtml" class="external-link">License</a>
or
<a href="https://go.netlicensing.io/console/v2/content/vendor/transaction.xhtml" class="external-link">Transaction</a>
you can list all existing entities</span>.

By clicking on a single list entry and selecting `"Edit"` you can open
entry details to view or <span class="complexword">modify</span>.

<a href="https://go.netlicensing.io/console/v2/content/vendor/licensee.xhtml" class="external-link"><img src="assets/images/17433027/17629250.png?effects=drop-shadow" title="Operate - Licensee" alt="Operate - Licensee" class="confluence-embedded-image" width="800" /></a>  



NetLicensing RESTful API
------------------------

[NetLicensing RESTful API](11010215.html) offers you an automated way to
access subject's data from your products, services and/or internal
systems, such as CRM, ERP.

Please refer to the documentation for the LIST, GET and UPDATE
operations of the corresponding service:

-   [Licensee Services](Licensee-Services_11010217.html) - to access and
    modify the *Licensee* entities
-   [License Services](License-Services_11010220.html) - to access and
    modify the *License* entities
-   [Transaction Services](Transaction-Services_11010218.html) - to
    access and modify the *Transaction* entities

Tips
----

-   NetLicensing entities model support [Custom
    Properties](Custom-Properties_14058002.html), which can be used to
    store any licensing relevant information. We encourage you to design
    the data model with the data privacy in mind and also following
    separation of concern principles. So, for instance, you might store
    the personal data (name, address, etc.) of your customers (Licensee)
    in your CRM system and use customer id as a reference to the
    NetLicensing entities.
-   Make sure, that you are following *"least-to-know"* principles while
    designing the data model. So, for instance, storing of the
    customer's age is definitely possible, but might be not really
    needed in the context of the NetLicesning license management.
-   Assess the customers' data stored in your NetLicensing vendor
    account regularly and
    [delete](How-to-delete-licensee-data_17433029.html) this data
    whenever this is not needed for your business anymore.
