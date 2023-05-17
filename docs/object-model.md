---
layout: default
title: Object Model
nav_order: 30
description: "NetLicensing Object Model"
permalink: object-model
---

NetLicensing Object Model
=========================

-   [Vendor](#vendor)
-   [Product](#product)
-   [Product Module](#product-module)
-   [License Template](#license-template)
-   [Licensing Model](#licensing-model)
-   [License](#license)
-   [Licensee](#licensee)
-   [Transaction](#transaction)
-   [Bundle](#bundle)

<img src="assets/images/netlicensing-object-model.png" usemap="#object-model-map"/>
<map name="object-model-map">
    <area target="" alt="Vendor" title="Vendor" href="#vendor" coords="25,35,115,105" shape="rect">
    <area target="" alt="Product" title="Product" href="#product" coords="172,140,261,207" shape="rect">
    <area target="" alt="Product Module" title="Product Module" href="#product-module" coords="337,239,425,306" shape="rect">
    <area target="" alt="License Template" title="License Template" href="#license-template" coords="502,328,590,396" shape="rect">
    <area target="" alt="Licensee" title="Licensee" href="#licensee" coords="337,430,425,498" shape="rect">
    <area target="" alt="License" title="License" href="#license" coords="633,430,721,498" shape="rect">
    <area target="" alt="Transaction" title="Transaction" href="#transaction" coords="26,282,115,350" shape="rect">
    <area target="" alt="Licensing Model" title="Licensing Model" href="#licensing-model" coords="337,36,425,103" shape="rect">
</map>

Vendor
------

Vendor is a licensor that uses NetLicensing service for managing the
licenses for his products. Vendor registers with NetLicensing by opening
an account. Vendor configures his products and desired licenses within
the NetLicensing service via
<a href="https://ui.netlicensing.io" class="external-link">NetLicensing Management Console</a>.
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
Models](licensing-models) offered by NetLicensing service.
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

[Licensing Model](licensing-models)
-------------------------------------------------

Licensing model is a set of rules and algorithms that define how to
process the licenses obtained by a licensee. A number of licensing
models is supported by NetLicensing service, refer to the [licensing
models documentation](licensing-models) for details.

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
new licenses for the product by redirecting him to the [NetLicensing Shop](netlicensing-shop)
in web browser.

<a href="https://go.netlicensing.io/javadoc/v2/com/labs64/netlicensing/domain/entity/Transaction.html" class="external-link">Transaction</a>
--------------------------------------------------------------------------------------------------------------------------------------------

Transaction is created each time a new bunch of licenses is obtained by
a licensee. It can be either a direct purchase by a licensee via
[NetLicensing Shop](netlicensing-shop), licenses can be given to a licensee by a vendor, or
assigned implicitly by NetLicensing if it is defined so by some license
model (e.g. evaluation license may be given automatically). All these
events are reflected in transactions.

Bundle
--------------------------------------------------------------------------------------------------------------------------------------------
Bundle stores license templates for different product modules, but all
templates in a bundle belong to the same product. It is used to create
an array of licenses based on the saved license templates.

<script type="text/javascript"> imageMapResize(); </script>
