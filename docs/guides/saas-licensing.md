---
layout: default
title: "Licensing a SaaS Application: Plans, Tenants and Entitlements"
nav_title: SaaS Licensing
parent: Guides
nav_order: 26
description: "How to license a SaaS or multi-tenant application with NetLicensing: map tenants to licensees, model plans with Pricing Table, add features, seats and usage limits, check entitlements on the server with caching, and handle upgrades, trials and renewals."
permalink: saas-licensing
last_modified_at: 2026-10-25
---

Licensing a SaaS Application: Plans, Tenants and Entitlements
=============================================================

In a SaaS application the license check runs on your server, not on the customer's machine, which makes life a lot
easier. Each tenant (a customer account, workspace or organization) is one NetLicensing **licensee**, identified by a
stable tenant ID. Your back end validates the tenant, caches the result until its `ttl`, and switches plans, features
and limits on or off from there. Plans are modelled with [Pricing Table](pricing-table); seats and usage limits with
[Quota](quota), [Floating](floating) or [Pay-per-Use](pay-per-use).

## How SaaS concepts map to NetLicensing

| In your SaaS | In NetLicensing |
|--------------|-----------------|
| Tenant, account, organization | [Licensee](object-model#licensee), with your tenant ID as its number (or as an [alias](aliases)) |
| Plan (free, pro, business) | A plan in a [Pricing Table](pricing-table) module |
| Feature that comes with a plan | A SKU or feature in the Pricing Table, or a [Multi-Feature](multi-feature) module |
| Seat limit | [Quota](quota) for named seats you count yourself, or [Floating](floating) for concurrent sessions |
| Metered usage | [Pay-per-Use](pay-per-use) credits |
| Free trial | The trial option of a Pricing Table plan, or an automatic free license in [Subscription](subscription) |
| Billing and checkout | [NetLicensing Shop](netlicensing-shop), or your own billing system via [integrations](integrations) |
| Customer self-service | [Customer Portal](customer-portal) |

## The request flow

When a user signs in, your back end already knows the tenant ID. It looks for a cached validation result for that
tenant. If there isn't one, or its `ttl` has passed, it calls [validate](licensee-services#validate-licensee) with the
tenant ID, plus `productNumber` if tenants are created automatically on first validation. The back end then hands the
plan, features and limits to the rest of the application, for example as an entitlements object in the session.

When a tenant upgrades, throw away its cached result so the very next request sees the new plan.

The API key lives on your server here, so you can use a role with more rights, such as `ROLE_APIKEY_OPERATION`, and
create licensees and licenses straight from your sign-up and billing flows. See
[API key roles](security#api-key-identification).

## Upgrades, downgrades and renewals

You can send the tenant to NetLicensing Shop with a [shop token](token-services#create-token), or put a permanent shop
token for a particular plan behind a button on your pricing page. If billing happens in your own system, create or
deactivate licenses through the [License Services API](license-services) whenever a payment succeeds or fails. Either
way, subscribe to [webhook notifications](notifications) (`LICENSE_CREATED`, `PAYMENT_TRANSACTION_PROCESSED`,
`WARNING_LEVEL_CHANGED`) so you know when to clear caches or send an email.

## Performance and availability

One validation per tenant per TTL is plenty; don't call the API on every page view. If DNS fails, retry against the
backup host `netlicensing.labs64.com`. And if NetLicensing can't be reached at all, keep serving from the cached
entitlements while their TTL is valid, then decide how your service should behave after that.

## Related

- [Pricing Table](pricing-table) reference
- [Subscription vs Perpetual Licensing](subscription-vs-perpetual-licensing)
- [Usage-Based Software Licensing](usage-based-licensing)
- [FAQ: How do I license a SaaS application?](faq-saas-licensing)
