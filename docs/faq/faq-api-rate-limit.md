---
layout: post
title: "What is the NetLicensing API Rate Limit and what happens when I exceed it?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "The API Rate Limit is the guaranteed minimum throughput of your NetLicensing plan, not a hard cap. Every REST API request counts, and HTTP 429 is returned only when you are above it while the system is busy."
permalink: faq-api-rate-limit
faq_category: Getting started
last_modified_at: 2026-11-04
---

{{ page.title }}
=============

- [What the limit means](#what-the-limit-means)
- [Limits per plan](#limits-per-plan)
- [Which requests count](#which-requests-count)
- [What happens above the limit](#what-happens-above-the-limit)
- [What 1 request per minute means in practice](#what-1-request-per-minute-means-in-practice)
- [How to send fewer requests](#how-to-send-fewer-requests)
- [Getting a higher limit](#getting-a-higher-limit)

## Question

My plan says "1 request / minute". Does that mean my application can validate a license only once a minute?

## Answer

No. The API Rate Limit is a **guaranteed minimum**, not a maximum. It is the throughput NetLicensing always serves for
your vendor account, even when the system is under heavy load. When the system is not busy, requests above that rate
are served as usual.

What the limit means
--------------------

| You send... | System not busy | System busy |
|-------------|-----------------|-------------|
| At or below your plan's rate | Served | Served (guaranteed) |
| Above your plan's rate | Served | May be rejected with `429` |

The limit only matters when NetLicensing is busy. At those times, your plan's rate is what you can count on.

Limits per plan
---------------

| Plan | Guaranteed throughput |
|------|-----------------------|
| Community | 1 request / minute |
| Basic | 1 request / minute |
| Premium | 1 request / second |
| Select | Customizable |

The limit applies per **vendor account**. All your products, API keys and client applications share it.

The API Rate Limit is not the same as the number of products, licensees or licenses your plan allows. Those are
separate plan limits. The rate limit only controls how fast requests are served when the system is busy.

Which requests count
--------------------

Every request to the NetLicensing REST API counts, whatever the endpoint: license validation, creating and updating
licensees and licenses, tokens, and so on. It makes no difference whether the request comes from your own code, one of
the [client libraries](client-libraries), the [MCP server](netlicensing-mcp) or a
[NetLicensing Agent](netlicensing-agent) in proxy mode.

What happens above the limit
----------------------------

If you are above your plan's rate while the system is busy, NetLicensing rejects the request with HTTP `429 Too Many
Requests`. The `Retry-After` header gives the number of seconds to wait before you try again (see
[API Conventions](api-conventions#errors)).

Your application should:

1. Treat `429` as "try again later", not as an invalid license.
2. Wait for the number of seconds in `Retry-After`, then retry.
3. Meanwhile, keep using the last successful validation result while its `ttl` is valid, as you would during a
   [network outage](faq-service-unreachable).

Never lock the user out because of a `429`. It says nothing about the license.

What 1 request per minute means in practice
-------------------------------------------

One validation is one request. A single call to
[`POST /licensee/{licenseeNumber}/validate`](licensee-services#validate-licensee) returns the result for every product
module of the licensee, so you never need one call per module.

At the guaranteed rate, 1 request per minute is 60 validations per hour, or 1,440 per day. That covers applications
that validate at start-up, when a licensed feature is opened, or a few times a day. If you have many active users who
validate often, plan for a higher limit.

How to send fewer requests
--------------------------

- **Validate when it matters, not on every action.** Validate at start-up, when a session begins or when the user opens
  a licensed feature. See [How often should my application validate the license?](faq-validation-frequency)
- **Reuse the result until its TTL.** Every validation response contains a `ttl`. Cache the response and don't call the
  API again until it expires. You set the TTL in the Management Console settings. See
  [Offline validation using TTL](faq-offline-validation-ttl).
- **Validate once for all modules.** One validate call covers every product module of the licensee.
- **Put a NetLicensing Agent in front of many clients.** In proxy mode (`run-agent`), the Agent caches validation
  results (locally or in Redis), so clients on the same network don't each call the cloud. See
  [Validation Cache in Proxy Mode](netlicensing-agent#validation-cache-in-proxy-mode).
- **Don't poll for changes.** Use [webhook notifications](notifications) to find out about purchases and license changes
  instead of calling the API repeatedly.

Getting a higher limit
----------------------

Upgrade to **Premium** for a guaranteed 1 request per second. If you need more, the **Select** plan's limit is set to
match your load: [contact us](https://netlicensing.io/contact/){:target="_blank"}{:rel="noopener"}.

Related
-------

- [FAQ: What do HTTP 400, 401, 402, 403 and 404 mean in NetLicensing API responses?](faq-validation-errors-http-status)
- [FAQ: What happens if NetLicensing is unreachable?](faq-service-unreachable)
- [API Conventions: Errors](api-conventions#errors)
