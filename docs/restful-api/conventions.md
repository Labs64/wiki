---
layout: default
title: "REST API Conventions: Formats, Errors, Paging and Roles"
nav_title: Conventions
parent: NetLicensing REST API Reference
nav_order: 5
description: "Rules shared by every NetLicensing REST API endpoint: request and response formats, error codes, paging and filtering, role levels, data types and the backup host."
permalink: api-conventions
last_modified_at: 2026-10-30
---

API Conventions
===============

These rules apply to every endpoint. The [service pages](services) describe only what is specific to each endpoint and do not repeat them.

- [Base URL](#base-url)
- [Requests](#requests)
- [Responses](#responses)
- [Errors](#errors)
- [Paging, sorting and filtering](#paging-sorting-and-filtering)
- [Roles](#roles)
- [Data types](#data-types)
- [Custom properties](#custom-properties)

Base URL
--------

```
https://go.netlicensing.io/core/v2/rest/<resource>
```

If `go.netlicensing.io` cannot be resolved (a DNS problem outside of our control), retry the request with the backup host `netlicensing.labs64.com`.

Requests
--------

| Item | Rule |
|------|------|
| Authentication | HTTP Basic, with your vendor credentials or an API key. See [Security](security). |
| Methods | `GET` reads, `POST` creates and updates, `DELETE` deletes. |
| Query parameters | Used for `GET` and `DELETE`. |
| Body | Used for `POST`, form encoded: `Content-Type: application/x-www-form-urlencoded`. Without a `Content-Type`, `POST` bodies are read as form encoded. |

Responses
---------

**XML is the default.** Send `Accept: application/json` to get JSON. If `Accept` contains both formats, XML wins.

Every response uses the same envelope, described by the [XML schema](https://go.netlicensing.io/schema/context/netlicensing-context-2.1.xsd). Each entity is one `item` with a `type`, and its fields are a flat list of `property` name/value pairs. All values are strings.

```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Licensee">
            <property name="number">I001</property>
            <property name="active">true</property>
        </item>
    </items>
</netlicensing>
```

Errors
------

Errors use the same envelope, with an `info` entry of type `ERROR` whose `id` names the error.

| Status | Meaning |
|--------|---------|
| `200` | Request succeeded, the body contains the result. |
| `204` | Request succeeded, there is no body (for example after a delete). |
| `400` | Invalid request or business rule violation. **A missing entity also returns `400`, not `404`.** |
| `401` | Missing or wrong credentials. |
| `402` | The operation is not included in your pricing plan. |
| `403` | The credentials are valid, but the role may not call the operation. |
| `404` | Unknown endpoint, a feature that is not available, or an unsupported HTTP method. |
| `429` | Too many requests. Retry after the number of seconds in the `Retry-After` header. |
| `500` | Internal error. |

Paging, sorting and filtering
-----------------------------

List endpoints accept one `filter` query parameter that holds `key=value` pairs separated by `;`:

```
GET /core/v2/rest/licensee?filter=page=0;items=50;sortorder=number;sortdirection=DESC
```

| Key | Default | Description |
|-----|---------|-------------|
| `page` | `0` | Page number, starting at 0. |
| `items` | `100` | Page size. The maximum is 100. |
| `sortorder` | `number` | Property to sort by. |
| `sortdirection` | `ASC` | `ASC` or `DESC`. |

Roles
-----

Each endpoint lists the lowest [API key role](security#api-key-identification) that may call it. Roles are cumulative, and vendor credentials (username and password) may call every endpoint.

| Role | Includes |
|------|----------|
| `LICENSEE` | Validate, transfer, create a shop token. |
| `ANALYTICS` | `LICENSEE` plus read access to all entities. |
| `OPERATION` | `ANALYTICS` plus create, update and delete for licensees and licenses. |
| `MAINTENANCE` | `OPERATION` plus create, update and delete for products, product modules and license templates. |
| `ADMIN` | Everything an API key can do. |

"Analytics and above" on an endpoint therefore means `ANALYTICS`, `OPERATION`, `MAINTENANCE` and `ADMIN`.

Data types
----------

| Type | Representation |
|------|----------------|
| Boolean | `true` or `false`. |
| Timestamp | [ISO 8601](https://www.w3.org/TR/xmlschema-2/#isoformats), either a date (`2026-10-30`) or a date and time (`2026-10-30T12:00:00Z`). |
| Monetary | Two fields: a decimal `price` and a `currency`. Supported currencies: `EUR` and `USD`. A price above 0 needs a currency. |

Custom properties
-----------------

On create and update, every form field that is not a reserved property of the entity is stored as a [custom property](custom-properties) and returned with the entity.
