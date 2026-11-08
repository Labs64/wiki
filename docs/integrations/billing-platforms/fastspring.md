---
layout: default
title: "FastSpring Licensing Integration"
nav_title: "FastSpring"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 90
description: "Connect FastSpring to NetLicensing without the Gateway: signed webhooks create licenses for orders and renewals and deactivate them on refunds and chargebacks."
permalink: fastspring-licensing
redirect_from:
  - /fastspring-webhooks
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: FastSpring sends signed webhooks for every order, rebill, refund and chargeback. A small receiver that you run
turns them into NetLicensing licenses: one license per paid order item and per paid billing period, deactivated on refund or
chargeback. No NetLicensing Gateway is involved, and the setup and a tested receiver script are part of this guide.

| Page | What it gives you |
|------|-------------------|
| This page | How the integration works, which events it uses, and why |
| [Step-by-step setup](fastspring-setup) | NetLicensing and FastSpring configuration, deployment, testing, going live |
| [Receiver script](fastspring-receiver) | Copy-paste Python receiver and backfill script (standard library only) |
| [Event examples](fastspring-event-examples) | Each FastSpring event with its payload and the NetLicensing calls it causes |

```text
Buyer        FastSpring                          Your receiver                    NetLicensing
|            |                                   |                                |
|-- order -->|                                   |                                |
|            |-- order.completed (signed) ------>| verify X-FS-Signature          |
|            |                                   |-- POST /licensee ------------->|  number = FastSpring account id
|            |                                   |-- POST /license -------------->|  number = <order id>-<product>
|            |<-- 200 ---------------------------|                                |
|            |                                   |                                |
|            |-- subscription.charge.completed ->|-- POST /license -------------->|  one per new billing period
|            |-- return.created / chargeback --->|-- POST /license/{n} active=false
|            |                                   |                                |
|  app ------------------------------------------------- POST /licensee/{email}/validate -->|
```

## Gateway connector or webhooks?

| | This guide (webhooks) | [Gateway connector](fastspring) |
|--|--|--|
| Runs where | A receiver you host | The NetLicensing Gateway |
| First purchase | `order.completed` webhook | FastSpring *Remote Server Request* fulfillment |
| Renewals, refunds, chargebacks | Yes | No; it needs webhooks in addition |
| License key in the FastSpring receipt | No; the customer signs in with the purchase email | Yes; the licensee number |
| Request authenticity | HMAC-SHA256 (`X-FS-Signature`), documented by FastSpring | Hash check based on the store's private key, as implemented in the Gateway |
| Recovery of missed events | FastSpring retries for 7 days, and `/events/unprocessed` | Gateway log for 30 days |

Use this guide for new integrations. Keep the Gateway connector only if your product needs a key printed in the FastSpring
receipt.

## How licenses are numbered

The receiver uses FastSpring's own ids as NetLicensing numbers, so every later event can address the right entity and repeated
deliveries cannot create duplicates (see [IDs as numbers](billing-platforms#platform-ids)).

| NetLicensing entity | Number | Taken from |
|---------------------|--------|------------|
| Licensee | FastSpring account id, for example `abCdE1FGH2Hij3KLMnOpqR` | `account.id` |
| Licensee alias | The buyer's email address | `account.contact.email` (or `customer.email`) |
| License | `<order id>-<product path>`, for example `aBCDE12fGH3iJkL4mNOpq-cloud-storage` | Order `id` and `items[].product` |

The email alias lets your application validate with the address the customer knows:
`POST /licensee/jane.doe@company.com/validate` works the same as validating by the account id. We tested both on the live API.
An alias is unique: a second licensee with the same alias is rejected with `DuplicateEntityException`.

## Events used and what they do

| FastSpring event | What the receiver does |
|------------------|------------------------|
| `order.completed` | Creates the licensee (account id, email alias) and one license per item that is in your product map. For a subscription item whose `state` is `trial`, no license is created yet. For a paid subscription item it also records the subscription's billing period (`sequence`) on the licensee |
| `subscription.charge.completed` | A rebill. If its `sequence` is higher than the last licensed period of that subscription, creates one license for the period and records the new `sequence`; otherwise does nothing |
| `return.created` | Deactivates the licenses of the returned items: `<original.id>-<items[].product>` |
| `chargeback.created` | The event names only the order (`order`), so the receiver deactivates `<order>-<product>` for every product in your map; licenses that do not exist are skipped |

Why the `sequence` check: FastSpring states that `subscription.charge.completed` also fires for prorated charges, for example
after a plan change, and documents `sequence` as the number of the current billing period. A prorated charge inside a period that
is already licensed therefore adds no time. The last licensed period is stored on the licensee as the custom property
`fsSeq_<subscription id>`.

Events you can leave out with time-based plans:

| Event | Why it is not needed |
|-------|----------------------|
| `subscription.activated` | Fires for new subscriptions and trials; `order.completed` already covers the first purchase |
| `subscription.canceled`, `subscription.deactivated` | Without a new charge, no new license arrives and access ends when the paid time runs out |
| `subscription.paused`, `subscription.resumed` | A paused subscription is not charged; the next charge after resuming adds a period |
| `subscription.charge.failed`, `subscription.payment.overdue` | Nothing to do; the customer keeps the time already paid for. Add a [grace period](subscription#grace-period) if you want more |

This model fits the NetLicensing [Subscription](subscription) licensing model, where each license adds its time volume after the
time already bought. Map each FastSpring subscription product to a template with the same period, for example a monthly product
to a template of 1 month.

## Check that the request comes from FastSpring

Set an **HMAC SHA256 Secret** on the webhook URL endpoint. FastSpring computes an HMAC-SHA256 of the raw request body with that
secret, Base64-encodes it and sends it in the `X-FS-Signature` header; the header name can arrive in any letter case. The receiver
recomputes it over the raw body and rejects a mismatch with `401`. FastSpring also states that webhooks come from the IP address
`107.23.30.83`, and that IP addresses can be spoofed.

## Retries and duplicates

| Your answer | FastSpring treats it as |
|-------------|-------------------------|
| `200` | All events in the post are processed |
| `202` with event ids in the body, one per line | Only the listed events are processed; the others are retried |
| Any other status | Failed; FastSpring recommends a `5xx` code |

FastSpring retries unprocessed events for up to 7 days (after 1, 2, 4, 6, 6, 6 hours, then once a day), and automatic retries carry
the same event id. One post can contain several events. The receiver answers `200` when every event succeeded and `202` with the
ids of the successful ones otherwise. Because license numbers come from FastSpring ids, a repeated event creates nothing new.

For events that still fail, the [backfill script](fastspring-receiver#backfill-missed-events) reads
`GET /events/unprocessed` from the FastSpring API, processes the events and marks them processed. FastSpring notes that the
`/events` endpoint only covers events posted to the **first** webhook on the Webhooks page.

## Requirements and limits of the foundation script

| Topic | Behavior |
|-------|----------|
| Webhook Expansion | Must be enabled: the receiver needs the expanded `account`, `order` and `subscription` objects, and fails events without them so that FastSpring retries |
| NetLicensing products | One NetLicensing product per FastSpring store; several FastSpring products map to templates of that product |
| Quantity | One license per order item, whatever the quantity |
| Partial refunds | Treated like full refunds: the item's license is deactivated |
| Test orders | Acknowledged and ignored unless `ACCEPT_TEST_EVENTS=true` |
| Email changes | Not synchronized; the alias keeps the purchase email |

The script is a foundation: extend it where your licensing differs, for example quantity-based licenses or a licensing model
without an end date.

## Sources

- [FastSpring: webhooks overview](https://developer.fastspring.com/reference/webhooks-overview){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: message security](https://developer.fastspring.com/reference/message-security){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: processed and unprocessed webhook events](https://developer.fastspring.com/reference/processed-and-unprocessed-webhook-events){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: webhook expansion](https://developer.fastspring.com/reference/webhook-expansion){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: order.completed](https://developer.fastspring.com/reference/ordercompleted){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: subscription.charge.completed](https://developer.fastspring.com/reference/subscription-charge-completed){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: subscription.activated](https://developer.fastspring.com/reference/subscriptionactivated){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: subscription.deactivated](https://developer.fastspring.com/reference/subscription-deactivated){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: return.created](https://developer.fastspring.com/reference/returncreated){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: chargeback.created](https://developer.fastspring.com/reference/order-chargeback){:target="_blank"}{:rel="noopener nofollow"}
- [FastSpring: list all unprocessed events](https://developer.fastspring.com/reference/list-all-unprocessed-events){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host it. The FastSpring details on this page are based on the sources above, and the receiver was run end to end against the live NetLicensing API with FastSpring-shaped test events. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to
[Billing and Commerce Platforms](billing-platforms).
