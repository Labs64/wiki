---
layout: default
title: Utility Services API
nav_title: Utility Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 90
description: "REST API reference for utilities: list available licensing models, license types and countries."
permalink: utility-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Utility Services
================

Reference data such as licensing models, license types, countries and currencies.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/utility/licensingModels`](#licensing-models-list) | List licensing models | Analytics+ |
| <span class="http-method get">GET</span> [`/utility/licenseTypes`](#license-types-list) | List license types | Analytics+ |
| <span class="http-method get">GET</span> [`/utility/countries`](#countries-list) | List countries | Analytics+ |
| <span class="http-method get">GET</span> [`/utility/currencies`](#currencies-list) | List currencies | Analytics+ |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Licensing Models list
---------------------

<span class="http-method get">GET</span> `/utility/licensingModels`

**Required role:** Analytics+

Return a list of all licensing models supported by the service.

One `LicensingModelProperties` item (property `name`) per registered model.

**Parameters:** none.

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/utility/licensingModels
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="LicensingModelProperties">
            <property name="name">TimeLimitedEvaluation</property>
        </item>
        <item type="LicensingModelProperties">
            <property name="name">FeatureWithTimeVolume</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Utility/listLicensingModels)

---

License Types list
------------------

<span class="http-method get">GET</span> `/utility/licenseTypes`

**Required role:** Analytics+

Return a list of all license types supported by the service.

One `LicenseType` item (property `name`) per value of `LicenseType`.

**Parameters:** none.

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/utility/licenseTypes
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="LicenseType">
            <property name="name">FEATURE</property>
        </item>
        <item type="LicenseType">
            <property name="name">TIMEVOLUME</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Utility/listLicenseTypes)

---

Countries list
--------------

<span class="http-method get">GET</span> `/utility/countries`

**Required role:** Analytics+

Return a list of all countries.

`Country` items with properties `code`, `name`, `vatPercent`, `isEu`.

**Parameters:** none.

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/utility/countries
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Utility/listCountries)

---

Currencies list
---------------

<span class="http-method get">GET</span> `/utility/currencies`

**Required role:** Analytics+

Return a list of all currencies.

`Currency` items (property `name`), one for each currency except `NONE`.

**Parameters:** none.

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/utility/currencies
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Utility/listCurrencies)

