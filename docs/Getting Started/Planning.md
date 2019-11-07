---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Planning
=======================================


 

**[Step 2: Setting up \>\>\>](Setting-up_11010228.html)**

Step 1: Planning
----------------

### Elaborate the licensing scheme for your product

1.  Determine the layout of your
    [product](NetLicensing-Object-Model_11010225.html):
    -   how many [modules](NetLicensing-Object-Model_11010225.html) are
        in your product that should be licensed independently?
    -   choose the [licensing
        model](NetLicensing-Object-Model_11010225.html) for each module.
2.  Determine the possible licenses and their parameters for each
    product module. This must correspond to the chosen licensing model -
    see the [Licensing Models](Licensing-Models_11010230.html) for
    details.

#### Product and Product Module

NetLicensing uses a generalized representation for any product. In order
to integrate your product with NetLicensing, you'll need to find out how
to map your product on [NetLicensing Object
Model](NetLicensing-Object-Model_11010225.html).  
Fortunately, the product in the NetLicensing object model is very
simple: every product consists of one or more product modules, each
product module is licensed according to its licensing model.

This can be represented schematically:

<img src="assets/images/11010227/15171597.png" class="confluence-embedded-image" />

Each product module is licensed independently, which means there is no
logic within the NetLicensing that connects licenses of one product
module with the licenses of another product module. However all product
modules are visible to all licensees of the product. Licenses within a
single product module are connected according to the licensing model
chosen for this product module.

#### Licensee

Next category that needs a mapping is a licensee. Typically, licensee is
the end user of your product, but it may be as well an organization,
that acquires multi-user or shared licenses.

For each licensee the entire product is available for licensing with all
its modules.

#### License Template and License

Another important category within NetLicensing is the License Template.
License Templates serve as patterns to create corresponding licenses
that are then assigned to licensees.

License template is a configuration element, whereas license is given to
a licensee upon creation. Naturally, each license belongs to one and the
only licensee.

Each license always stays linked to the license template it was derived
from, and inherits its type from that license template. Other properties
of the license are also assigned initially from the license template (on
license creation), in particular user-defined properties are copied from
the license template to the license. However, once license is created
with its own properties, the properties of the license can be changed
without affecting the properties of the ancestor license template. Some
license properties may however be read-only after being initially
assigned from the license template. Same is true other way around:
changes in properties of a license template do not affect licenses
already created off this license template.

Example: price property of the license template. The license is created
on purchase from the license template, including copying of the price
property. Then price stays read-only in the license to indicate the
actual purchase price. Price specified in the license template may be
changed later on, reflecting the change in the actual market price for
the product, but it will not have backwards effect on already purchased
licenses.

#### Examples

Below mapping examples will help you to elaborate the appropriate
mapping for your product.

##### Example 1

Small tool that is licensed as a whole for evaluation within 30 days,
then has to be purchased by the end user.

<span style="text-decoration: underline;">Mapping:</span>

-   ***product:*** the tool itself
-   ***product modules:*** one product module that is again the whole
    tool, using "TimeLimitedEvaluation" licensing model
-   ***licensee:*** tool user that for example may identify himself via
    the serial number embedded in his copy of the tool

##### Example 2

Online portal offering following services:

-   mailbox, 1GB free, each following gigabyte to be purchased
-   file storage, 2GB free, each following GB to be purchased
-   online TV, one channel free, further channels to be purchased for a
    certain time.

<span style="text-decoration: underline;">Mapping:</span>

-   ***product:*** the online portal
-   ***product modules:***
    -   mailbox, licensing model "Volume"
    -   storage, licensing model "Volume"
    -   online TV, licensing model "FeatureWithTimeVolume"
-   ***licensee:*** portal user, identified by a unique number
    associated with its portal account

 

**[Step 2: Setting up \>\>\>](Setting-up_11010228.html)**
