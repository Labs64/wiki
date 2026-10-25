---
layout: default
title: "Client Libraries and SDKs: Java, .NET, PHP, JavaScript, Kotlin, C++"
nav_title: "Client Libraries"
nav_order: 100
description: "Official open-source NetLicensing client libraries (SDKs) for Java, C#/.NET, PHP, JavaScript/Node.js, Kotlin and C++, with package names, feature support and links to quick-start guides."
permalink: client-libraries
last_modified_at: 2026-10-25
redirect_from:
  - /sdk
  - /sdks
---

Client Libraries and SDKs
=========================

Labs64 maintains open-source client libraries (Apache License 2.0) that wrap the NetLicensing [REST API](restful-api)
for Java, C#/.NET, PHP, JavaScript/Node.js, Kotlin and C++. They handle authentication, request encoding and response
parsing, so validating a customer is a single method call. For other languages, such as Python, Go or Ruby, call the
REST API directly or generate a client from the [OpenAPI specification](restful-api#openapi-specification-and-api-test-center).

Contributions are welcome. Use each project's issue tracker for bugs and feature requests, or contact us at
[netlicensing.io/contact](https://netlicensing.io/contact).

## Overview

| Language | Package | Signed responses | Offline validation file | Quick start |
|----------|---------|------------------|-------------------------|-------------|
| Java | Maven `com.labs64.netlicensing:netlicensing-client` | Yes | Yes | [Java](java-software-licensing) |
| C# / .NET | NuGet `NetLicensingClient-csharp` | Yes | Yes | [C# / .NET](dotnet-software-licensing) |
| PHP | Composer `labs64/netlicensingclient-php` | Offline files only | Yes | [PHP](php-software-licensing) |
| JavaScript / Node.js | npm `netlicensing-client` | No | No | [JavaScript](javascript-software-licensing) |
| Kotlin | Source on GitHub | | | |
| C++ | Source on GitHub (CMake, libcurl) | | | |
| Python | No client library; use the REST API | Verify XML signatures yourself | Verify XML signatures yourself | [Python](python-software-licensing) |

"Signed responses" and "Offline validation file" refer to verifying [response signatures](signing-the-response) and
evaluating [offline validation files](offline-license-validation) with your public key.

Clients
-------

### Java

- [NetLicensingClient-java](https://github.com/Labs64/NetLicensingClient-java){:target="_blank"}{:rel="noopener"} - Java wrapper for NetLicensing RESTful API, with a demo project covering every API method and offline validation

### JavaScript

- [NetLicensingClient-javascript](https://github.com/Labs64/NetLicensingClient-javascript){:target="_blank"}{:rel="noopener"} - JavaScript wrapper for NetLicensing RESTful API, for Node.js and the browser, with TypeScript types

### Kotlin

- [NetLicensingClient-kotlin](https://github.com/Labs64/NetLicensingClient-kotlin){:target="_blank"}{:rel="noopener"} - Kotlin wrapper for NetLicensing RESTful API

### .NET

- [NetLicensingClient-csharp](https://github.com/Labs64/NetLicensingClient-csharp){:target="_blank"}{:rel="noopener"} - C\# wrapper for NetLicensing RESTful API

### PHP

- [NetLicensingClient-php](https://github.com/Labs64/NetLicensingClient-php){:target="_blank"}{:rel="noopener"} - PHP wrapper for NetLicensing RESTful API

### C++

- [NetLicensingClient-cpp](https://github.com/Labs64/NetLicensingClient-cpp){:target="_blank"}{:rel="noopener"} - C++ wrapper for NetLicensing RESTful API

### Command-line

-   [cURL code snippets](restful-api) - please refer to the *"Try it now"* sections at NetLicensing API (RESTful) endpoints description

### AI agents

- [NetLicensing MCP server](netlicensing-mcp) - manage NetLicensing from AI assistants and IDE agents through the Model Context Protocol

Integrations
------------

NetLicensing can be easily [integrated](integrations) with common *e-Commerce, Billing and Subscription Management* platforms.

Online test application
-----------------------

- [NetLicensing API Test Center](https://netlicensing.io/NetLicensing-API/) - Test Labs64 NetLicensing RESTful API online
- [NetLicensing-Demo](https://github.com/Labs64/NetLicensing-Demo){:target="_blank"}{:rel="noopener"} - NetLicensing Demo Application
