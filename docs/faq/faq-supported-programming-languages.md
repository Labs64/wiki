---
layout: post
title: "Which programming languages does NetLicensing support?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "NetLicensing works with any language that can send HTTPS requests; official client libraries exist for Java, C#/.NET, PHP, JavaScript/Node.js, Kotlin and C++."
permalink: faq-supported-programming-languages
faq_category: Getting started
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Is there an SDK for my programming language?

## Answer

Any language that can send an HTTPS request can use NetLicensing, since it's a REST API. We also maintain open-source
client libraries for several languages:

| Language | Package | Guide |
|----------|---------|-------|
| Java | Maven `com.labs64.netlicensing:netlicensing-client` | [Java quick start](java-software-licensing) |
| C# / .NET | NuGet `NetLicensingClient-csharp` | [.NET quick start](dotnet-software-licensing) |
| PHP | Composer `labs64/netlicensingclient-php` | [PHP quick start](php-software-licensing) |
| JavaScript / Node.js | npm `netlicensing-client` | [JavaScript quick start](javascript-software-licensing) |
| Kotlin, C++ | Source on GitHub | [Client Libraries](client-libraries) |

For Python and everything else, call the REST API directly, as the [Python quick start](python-software-licensing)
shows, or generate a client from the [OpenAPI specification](restful-api#openapi-specification-and-api-test-center).
