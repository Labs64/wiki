1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)
3.  [Privacy Center](Privacy-Center_17433021.html)

<span id="title-text"> How to delete licensee data </span>
==========================================================


GDPR requires you to delete customers' data on their request.

NetLicensing Management Console
-------------------------------

<span class="hardreadability">Log in to the NetLicensing Management
Console using your vendor account and expand the section
`"Operate"`</span>.

<span class="hardreadability">By choosing corresponding menu item for
<a href="https://go.netlicensing.io/console/v2/content/vendor/licensee.xhtml" class="external-link l64-extlink">Licensee</a>,
<a href="https://go.netlicensing.io/console/v2/content/vendor/license.xhtml" class="external-link l64-extlink">License</a>
or
<a href="https://go.netlicensing.io/console/v2/content/vendor/transaction.xhtml" class="external-link l64-extlink">Transaction</a>
you can list all existing entities</span>.

By clicking on a single list entry and selecting `"Delete"` you can
delete entity and all descendants (*License, Transaction*).

<a href="https://go.netlicensing.io/console/v2/content/vendor/licensee.xhtml" class="external-link"><img src="assets/images/17433029/17629257.png?effects=drop-shadow" title="Operate - Delete Licensee" alt="Operate - Delete Licensee" class="confluence-embedded-image" width="800" /></a>  

NetLicensing RESTful API
------------------------

With the help of [NetLicensing RESTful
API](https://www.labs64.de/confluence/pages/viewpage.action?pageId=11010215),
you can easily delete customer's data.

Please refer to the documentation for the DELETE operations of the
corresponding service:

-   [Licensee
    Services](https://www.labs64.de/confluence/display/NLICPUB/Licensee+Services) -
    to delete *Licensee* data using its *LicenseeNumber*

Did you know?

<span class="aui-icon icon-hint">Icon</span>

`"forceCascade"` query param, forces *Licensee* entity deletion and
all descendants (*License, Transaction*)

-   [License
    Services](https://www.labs64.de/confluence/display/NLICPUB/License+Services) -
    to *delete License* data using its *LicenseNumber*
-   [Transaction
    Services](https://www.labs64.de/confluence/display/NLICPUB/Transaction+Services) -
    to *delete Transaction* data using its **Transaction*Number*

Tips
----

-   We recommend you to execute data deletion using two-step approach:
    1.  Collect and verify all relevant (to be deleted) entities
        identifiers as it is described
        [here](How-to-export-licensee-data_17433031.html)
    2.  Delete data after careful verification of to be deleted entities

<span class="aui-icon icon-problem">Icon</span>

Please note: deleted data cannot be restored anymore, so your customers
might be not validated in your products and services!

Attachments:
------------

<img src="assets/images/icons/bullet_blue.gif" width="8" height="8" />
[NetLicensing-Licensees-delete.png](attachments/17433029/17629257.png)
(image/png)  


