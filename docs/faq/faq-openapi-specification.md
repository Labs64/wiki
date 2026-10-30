---
layout: post
title: "Is there an OpenAPI (Swagger) specification for the NetLicensing API?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Download the OpenAPI 3.1 specification of the NetLicensing REST API to generate clients or import it into API tools."
permalink: faq-openapi-specification
faq_category: Getting started
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Where can I find a machine-readable description of the NetLicensing REST API?

## Answer

Yes, there's an OpenAPI 3.1 document here:
[https://netlicensing.io/NetLicensing-API/v2.x/netlicensing.yaml](https://netlicensing.io/NetLicensing-API/v2.x/netlicensing.yaml){:target="_blank"}{:rel="noopener"}

You can generate a client from it for a language we don't have a [client library](client-libraries) for, or import it
into a tool like Postman. It's also what powers the
[API Test Center](https://netlicensing.io/NetLicensing-API/){:target="_blank"}{:rel="noopener"}. If you work with XML,
there's an [XSD](restful-api#response) for the response format, and the readable reference lives at
[NetLicensing REST API Reference](restful-api).
