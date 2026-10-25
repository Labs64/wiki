---
layout: post
title: "What happens if NetLicensing is unreachable?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Use the cached validation result until its TTL, retry with the backup host netlicensing.labs64.com, and define a grace policy for longer outages."
permalink: faq-service-unreachable
faq_category: Validation
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

What should my application do when it can't reach the NetLicensing API?

## Answer

It depends on what's wrong.

If `go.netlicensing.io` doesn't resolve, send the same request to the backup host `netlicensing.labs64.com`. It sits
under a different top-level domain, so a DNS problem with one doesn't affect the other. See
[Structure of the RESTful URIs](restful-api#structure-of-the-restful-uris).

If there's no connection at all, keep working from the last successful validation result while its `ttl` is valid.
Once that runs out, your own rules take over: a few days' grace, read-only mode, or a message asking the user to go
online.

Customers who are never online need a different setup altogether: signed offline validation files or the
[NetLicensing Agent](netlicensing-agent). [Offline License Validation](offline-license-validation) compares them. The
current service status is at [status.netlicensing.io](https://status.netlicensing.io){:target="_blank"}{:rel="noopener"}.
