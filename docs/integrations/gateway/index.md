---
layout: default
title: NetLicensing Gateway
parent: Integrations
nav_order: 3
has_children: true
has_toc: false
description: "NetLicensing Gateway is an open-source service that turns order fulfillment calls from an eCommerce platform into licenses. Available connector: FastSpring."
permalink: gateway
last_modified_at: 2026-11-08
---

{{ page.title }}
================

<img src="assets/images/gateway-stage.png" alt="NetLicensing Gateway" />

NetLicensing Gateway lets an eCommerce platform act as the license acquisition frontend. After a successful transaction, the
platform calls the Gateway, and the Gateway creates the Customers, Licenses and all related data in NetLicensing, ready for
later entitlement validation.

The Gateway is open source ([Apache 2.0](https://github.com/Labs64/NetLicensing-Gateway/blob/master/LICENSE){:target="_blank"}{:rel="noopener"}). A central instance runs at
[gateway.netlicensing.io](https://gateway.netlicensing.io/monitoring){:target="_blank"}{:rel="noopener"}, and you can run your own from the Docker image.

> **Is the Gateway the right tool?** A Gateway connector exists only for the platforms listed below. For every other billing or
> commerce platform with webhooks, use the
> [Billing and Commerce Platforms](billing-platforms) guides, which call the NetLicensing REST API directly.

## License Acquisition Flow

<a href="assets/images/gateway-external-ecommerce-flow.png" class="imagelink" data-lightbox="gateway" data-title="License Acquisition Flow" data-alt="License Acquisition Flow">
    <img src="assets/images/gateway-external-ecommerce-flow.png" alt="License Acquisition Flow" />
</a>

## Gateway

- [NetLicensing-Gateway](https://github.com/Labs64/NetLicensing-Gateway){:target="_blank"}{:rel="noopener"} - source code
- [labs64/netlicensing-gateway](https://hub.docker.com/r/labs64/netlicensing-gateway){:target="_blank"}{:rel="noopener"} - Docker image at Docker Hub

## Connectors

| Platform | Status | Notes |
|----------|--------|-------|
| [FastSpring (Contextual Commerce)](fastspring) | Available | Connector in the Gateway (Remote Server Request, first purchase). For new integrations, the [FastSpring Licensing Integration](fastspring-licensing) works with webhooks and no Gateway |

### Requests handled by integration guides

All open connector requests for the Gateway were closed, because the [integration guides](billing-platforms) cover the
platforms through webhooks and the REST API, without a Gateway connector: Recurly, SendOwl, 2Checkout, Authorize.Net,
Chargebee, billwerk, Paddle, Stripe, Zuora, Gumroad and MoonClerk (through the [Stripe Billing](stripe-billing) guide, since MoonClerk runs on Stripe).

## Contribute a connector

New connectors are welcome as pull requests. See the
[contributing instructions](https://github.com/Labs64/NetLicensing-Gateway/blob/master/CONTRIBUTING.md){:target="_blank"}{:rel="noopener"}:
document the connector and cover your code with tests.
