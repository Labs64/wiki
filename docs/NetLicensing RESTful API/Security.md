---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Security
=======================================

by <span class="editor"> Konstantin Korotkov</span> on 18-11-2018

Basic Authentication
--------------------

NetLicensing supports HTTP Basic authentication (via SSL) relying on the
client's username and password to be added in the request.  
In order to access secured REST services with HTTP Basic authentication,
client applications have to set the HTTP Authorization header's value
to: Basic *\<base64\_encoded\_username\_password\>*. UTF-8 is the
default decoding charset; therefore, the value must also have been
encoded with the same charset.

<span class="aui-icon icon-warning">Icon</span>

In case of unauthorized access, HTTP response with status
code <a href="http://en.wikipedia.org/wiki/HTTP_403" class="external-link">403</a> will
be returned.

API Key Identification
----------------------

NetLicensing also supports API key identification to allow limited API
access on vendor's behalf.  
Leveraging API key improves security by:

-   Reducing the need to store sensitive credentials on the client side
-   Limiting the set of possible operations which can be done with a
    particular key
-   Defining fine-grained access rules for critical services (for
    example: a token is only valid for one service invocation within the
    next 5 minutes)

Access to the REST services with an API key is the same as with Basic
authentication, except that username is fixed to the value
"`apiKey"` (without quotation marks) and the actual API key should be
provided in the password field. Use of the API key does not grant access
to any account information, and is not used for authorization.

**API key request example**

``` theme:
$ curl -X POST --header 'Content-Type: application/x-www-form-urlencoded' --header 'Accept: application/xml' --user apiKey:%API_KEY% 'https://go.netlicensing.io/core/v2/rest/licensee/123/validate' | xmllint --format -
```

API key can be obtained via
the <a href="https://go.netlicensing.io/console/v2/" class="external-link">NetLicensing Management Console</a> or
using the API [token
service](https://www.labs64.de/confluence/display/NLICPUB/Token+Services).

Each API key has associated role, that grants access to a specific API
subset:

| Role               | RoleID                    | API Access                                                         | Description                                                                                                         |
|--------------------|---------------------------|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Licensee (default) | ROLE\_APIKEY\_LICENSEE    | Licensee validate and transfer, create shop token                  | Minimum access level, intended for keys embedded in client software for validation                                  |
| Analytics          | ROLE\_APIKEY\_ANALYTICS   | "Licensee" + get / list for all entities                           | "Read-only" access (except validation), intended for automated access to entities from ERP, CRM, etc. for analytics |
| Operation          | ROLE\_APIKEY\_OPERATION   | "Analytics" + CRUD for licensee and license                        | Allows all operations with operational entities, but will not allow modification of product configuration entities  |
| Maintenance        | ROLE\_APIKEY\_MAINTENANCE | "Operation" + CRUD for product / product module / license template | Full product maintenance, does not allow modification to profile and any global configurations                      |
| Admin              | ROLE\_APIKEY\_ADMIN       | Full access, same as login/password (with few exceptions)          | Can be used to grant (temporary) access, while keeping login/password undiscovered                                  |


Check the [services documentation](Services_14942714.html) to determine
which security mechanisms and roles are allowed for particular
NetLicensing service.
