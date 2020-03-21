---
layout: default
title: Multi-Feature
parent: Licensing Models
nav_order: 99
description: "Multi-Feature"
permalink: multi-feature
---

Multi-Feature
=============

**Multi-Feature** licensing model is designed to make the product
adjustable to the specific needs of different individual users. Certain
aspects of the software may be considered as ‘core’ i.e. they will be
needed in order for the software to perform its basic functions and
delivery its core purpose, but all of the other features are paid for
individually. Using this licensing model it is possible to create an
upgrade path from a “lite” version to “standard,” “pro,” “enterprise”
etc. NetLicensing Validation shows what features are valid (permitted)
for the [licensee](object-model) at the time
of validation.

To enable certain product feature, licensee acquires an appropriate
[license](object-model). Accordingly,
Multi-Feature licensing model must be configured with one or more
[license templates](object-model) of type
FEATURE. The entity **number** of each license template serves also as
an identifier of the corresponding feature and is made available for
processing in the validation result. License template **name** field
provides a descriptive name of the feature, which is visible to the end
user in the NetLicensing shop. Every feature gets its own price. E.g.:

-   License template with number **Emf-lite** -\> "Lite SW version" for
    10 EUR
-   License template with number **Emf-pro** -\> "Professional SW
    version" for 20 EUR

Optionally, some features may be marked "automatic" in their license
templates - licenses for these features will be added automatically to
every new licensee, regardless of the license price. This may be used
for features that can be later disabled at vendor's decision, by
deactivating the corresponding license.

No additional properties required for license templates or licenses in
this licensing model.

On validation, this licensing model returns all configured features
(according to the license templates), with the following values per
feature:

-   String **name** - attribute of the \<list\> container representing a
    feature, to be interpreted as a unique feature id. This is the
    entity **number** of the corresponding license template.
-   Boolean **valid** - **true** if the feature use is allowed (valid
    license is available)
-   String **featureName** - descriptive user-friendly name of the
    feature. This is the **name** field of the corresponding license
    template.

Validation response example:
<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context" ttl="2016-09-07T21:43:22.638Z">
    <ns2:infos/>
    <ns2:items>
        <ns2:item type="ProductModuleValidation">
            <ns2:property name="productModuleNumber">Mmf-DEMO</ns2:property>
            <ns2:property name="productModuleName">Multi-Feature licensing model upgrade path demo</ns2:property>
            <ns2:property name="licensingModel">MultiFeature</ns2:property>
            <ns2:list name="Emf-lite">
                <ns2:property name="valid">true</ns2:property>
                <ns2:property name="featureName">Lite SW version</ns2:property>
            </ns2:list>
            <ns2:list name="Emf-pro">
                <ns2:property name="valid">false</ns2:property>
                <ns2:property name="featureName">Professional SW version</ns2:property>
            </ns2:list>
        </ns2:item>
    </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }
