1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)

<span id="title-text"> NetLicensing Wiki : NetLicensing Object Model </span>
============================================================================

Created by <span class="author"> Konstantin Korotkov</span>, last
modified on 24-09-2016

-   [Vendor](#NetLicensingObjectModel-Vendor)
-   [Product](#NetLicensingObjectModel-Product)
-   [Product Module](#NetLicensingObjectModel-ProductModule)
-   [License Template](#NetLicensingObjectModel-LicenseTemplate)
-   [Licensing Model](#NetLicensingObjectModel-LicensingModel)
-   [License](#NetLicensingObjectModel-License)
-   [Licensee](#NetLicensingObjectModel-Licensee)
-   [Transaction](#NetLicensingObjectModel-Transaction)

<img src="assets/images/11010225/10977322.png" class="confluence-embedded-image" />

Vendor
------

Vendor is a licensor that uses NetLicensing service for managing the
licenses for his products. Vendor registers with NetLicensing by opening
an account. Vendor configures his products and desired licenses within
the NetLicensing service via
<a href="https://go.netlicensing.io/console/v2/" class="external-link">NetLicensing Management Console</a>.
Besides, vendor has to integrate NetLicensing service into his products
by means of NetLicensing API.

<a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/Product.html" class="external-link">Product</a>
------------------------------------------------------------------------------------------------------------------------------------

Product of the vendor within NetLicensing. Usually it corresponds to an
actual product of the vendor, but variations possible - in some cases it
may be feasible to configure two or more separate products within
NetLicensing for a single actual product of the vendor. Licensing rules
are defined for each product individually, products are completely
independent of each other in terms of license management.

<a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/ProductModule.html" class="external-link">Product Module</a>
-------------------------------------------------------------------------------------------------------------------------------------------------

Product may comprise of multiple modules, but must have at least one.
Each module is licensed using one of the [Licensing
Models](Licensing-Models_11010230.html) offered by NetLicensing service.
Licensing within a module is independent of other modules, however all
modules belonging to a product are visible to every licensee of the
product.

<a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/LicenseTemplate.html" class="external-link">License Template</a>
-----------------------------------------------------------------------------------------------------------------------------------------------------

License template is a configuration element that is bound to a module.
License templates define concrete items available for obtaining by a
licensee, specifying what is an item, its price, amount (if applicable),
etc. Actual licenses created off these templates are then given to
licensees.

[Licensing Model](Licensing-Models_11010230.html)
-------------------------------------------------

Licensing model is a set of rules and algorithms that define how to
process the licenses obtained by a licensee. A number of licensing
models is supported by NetLicensing service, refer to the [licensing
models documentation](Licensing-Models_11010230.html) for details.

<a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/License.html" class="external-link">License</a>
------------------------------------------------------------------------------------------------------------------------------------

Licenses are cloned off the corresponding templates when a licensee
obtain them. Licenses always belong to a certain licensee. Collection of
all licenses that belong to a licensee are processed by a licensing
model(s) on validation request (sent via NetLicensing API), and the
validation result is then sent back for further processing on the
vendor/end user side.

<a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/Licensee.html" class="external-link">Licensee</a>
--------------------------------------------------------------------------------------------------------------------------------------

Licensee is usually an end customer, capable of obtaining licenses for
the product. From the vendor perspective a licensee may correspond to a
physical instance of the product, customer account within a vendor's
service, or it can be an USB dongle given to a product user. In
practice, a licensee must only have a unique identifier associated with
it, that is communicated to NetLicensing for performing operations
related to this licensee. Licensee doesn't need to have an own account
within NetLicensing. There are two main operations performed for
licensee: validation and obtaining new licenses. Validation process is
typically completely transparent to the licensee and performed from the
product by means of NetLicensing API. Licensee can be offered to obtain
new licenses for the product by redirecting him to the NetLicensing Shop
in web browser.

<a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/Transaction.html" class="external-link">Transaction</a>
--------------------------------------------------------------------------------------------------------------------------------------------

Transaction is created each time a new bunch of licenses is obtained by
a licensee. It can be either a direct purchase by a licensee via
NetLicensing Shop, licenses can be given to a licensee by a vendor, or
assigned implicitly by NetLicensing if it is defined so by some license
model (e.g. evaluation license may be given automatically). All these
events are reflected in transactions.

Attachments:
------------

<img src="assets/images/icons/bullet_blue.gif" width="8" height="8" />
[Object-Relation.png](attachments/11010225/10977323.png) (image/png)  
<img src="assets/images/icons/bullet_blue.gif" width="8" height="8" />
[NetLicensing-DomainObjects.png](attachments/11010225/10977322.png)
(image/png)  

Document generated by Confluence on 17-03-2019 17:44

[Atlassian](http://www.atlassian.com/)
