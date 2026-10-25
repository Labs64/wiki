---
layout: default
title: "License Lifecycle: Activation, Expiry, Renewal and Revocation"
nav_title: License Lifecycle
parent: Guides
nav_order: 25
description: "How each stage of a software license lifecycle maps to NetLicensing: customer creation and activation, trials, device binding, expiry and grace periods, renewal and upgrades, transfer, deactivation and revocation, with the API calls and events involved."
permalink: license-lifecycle
last_modified_at: 2026-10-25
---

License Lifecycle: Activation, Expiry, Renewal and Revocation
=============================================================

Most software licenses go through the same stages. The customer is created, the license gets activated and used, it
expires or is renewed, and now and then it's moved to someone else or taken away. In Labs64 NetLicensing each stage is
one of three things: a [REST API](restful-api) call, an action in the Management Console or the Shop, or a rule of the
licensing model that kicks in during validation.

| Stage | How it happens in NetLicensing | Notification event |
|-------|--------------------------------|--------------------|
| Customer created | [Create licensee](licensee-services#create-licensee), or automatically on first validation if the product has licensee auto-create | `LICENSEE_CREATED` |
| Trial starts | An automatic license template (price 0) is assigned on first validation, for example in [Try & Buy](try-n-buy) or [Subscription](subscription) | |
| Purchase | [NetLicensing Shop](netlicensing-shop), your own shop via [Gateway](gateway), or [create license](license-services) from your back end | `PAYMENT_TRANSACTION_PROCESSED`, `LICENSE_CREATED` |
| Activation on a device | The first validation with a new `nodeSecret` in [Node-Locked](node-locked) client mode | |
| Use | [Validate](licensee-services#validate-licensee), cached until `ttl` | `WARNING_LEVEL_CHANGED` |
| Expiry gets close | The [warning level](warning-level) turns YELLOW, following the model's rules | `WARNING_LEVEL_CHANGED` |
| Expiry | Validation returns `valid=false` once the period ends; a [grace period](subscription#grace-period) can buy some time | `WARNING_LEVEL_CHANGED` |
| Renewal or upgrade | The customer buys in the Shop through a [shop token](token-services#create-token), or you add a license | `LICENSE_CREATED` |
| Transfer | [Transfer licenses](licensee-services#transfer-licenses) from a licensee marked for transfer | |
| Suspension | [Update the license](license-services) with `active=false`; inactive licenses are left out of validation | |
| Disabling a customer | [Update the licensee](licensee-services#update-licensee) with `active=false` (no new licenses), deactivate its licenses, or delete it | |

Events are delivered as [webhook notifications](notifications).

## Activation

There's no separate activation call. A license counts as activated the first time your application validates it. If
the product has licensee auto-create, passing `productNumber` on that call creates the licensee. Automatic license
templates, such as a trial period, are added at the same moment. In Node-Locked client mode, the first `nodeSecret`
values get bound to the license until its quota is used up.

If customers get a key from you, for example after buying in your own shop, use that key as the licensee number, or add
it as an [alias](aliases) of the licensee.

## Expiry and grace periods

Time-based models return the end of the paid period: `expires` in [Subscription](subscription), `evaluationExpires` in
[Try & Buy](try-n-buy). What happens once `valid` turns `false` is up to your application; read-only mode is a popular
choice. The Subscription model also has an optional grace period during which the customer can keep working.

## Renewal

Your application or website creates a shop token for the licensee and opens the `shopURL` from the response. The
customer buys a renewal there. If they renew before the current period ends, the new period is added on after it. The
next validation shows the new state, so there's no new key to send out.

Recurring payments work with the payment providers that support them. If billing runs somewhere else, see
[How to use NetLicensing with subscription management services](faq-3pp-subscription-management).

## Revocation

To take away a single license, set its `active` property to `false`. Validation ignores inactive licenses, and you can
switch it back on later. To shut out a whole customer, set the licensee's `active` property to `false` so it can't get
new licenses, and deactivate its licenses so validation stops granting use. To free a device or a seat, remove the
stored `nodeSecret` (Node-Locked) or `sessionId` (Floating) property.

Revocation takes effect at the next validation. A client that's offline keeps going on its cached result until the `ttl`
runs out, so pick your TTL interval with that delay in mind.

## Related

- [Software Licensing API: Architecture and Examples](software-licensing-api)
- [Transferring licenses between licensees](transferring-licenses-between-licensees)
- [FAQ: How do I revoke or deactivate a license?](faq-revoke-license)
- [FAQ: How do customers renew an expired subscription?](faq-renew-subscription)
