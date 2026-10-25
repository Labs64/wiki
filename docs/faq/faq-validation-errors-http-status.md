---
layout: post
title: "What do HTTP 400, 401, 402, 403 and 404 mean in NetLicensing API responses?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Meaning of NetLicensing REST API error status codes and where to find the error details in the response."
permalink: faq-validation-errors-http-status
faq_category: Validation
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

The API returns an error status. How do I find out what's wrong?

## Answer

Look at the `infos` element in the response body. It carries an `id` and a message that usually tell you exactly what
happened. As a rough guide:

| Status | Usual cause |
|--------|-------------|
| 400 | The request is malformed or not allowed, for example validating a licensee that doesn't exist without `productNumber` for auto-create |
| 401 / 403 | Wrong user name or password, an invalid API key, or a key whose [role](security#api-key-identification) doesn't allow this call |
| 402 | Your NetLicensing plan doesn't include the feature, for example the Agent or the Customer Portal |
| 404 | The entity you asked for doesn't exist |
| 500 | Something went wrong on our side; try again later and contact support if it keeps happening |

Every endpoint in the [services reference](services) lists the status codes it can return. If your client hides
response bodies, log them while you debug so you can see the `infos` message.
