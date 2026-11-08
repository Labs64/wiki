---
layout: default
title: "Gumroad Licensing Integration"
nav_title: "Gumroad"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 110
description: "Connect Gumroad to NetLicensing: sale pings create a customer and a license, recurring charges add a period, refunds and ended memberships deactivate it."
permalink: gumroad
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Gumroad pings your URL after each sale, and the API lets you subscribe to refunds, cancellations and membership changes. Your receiver creates a licensee and a license per sale, one more per recurring charge, and deactivates the license on refund or when a membership ends.

[Gumroad](https://gumroad.com){:target="_blank"}{:rel="noopener nofollow"} sells digital products and memberships. It notifies you of sales in two ways:

- **Ping**: an HTTP `POST` to the *Ping URL* in your Gumroad account settings, for sales and refunds.
- **Resource subscriptions**: you subscribe through the Gumroad API to the resources `sale`, `refund`, `dispute`, `dispute_won`, `cancellation`, `subscription_updated`, `subscription_ended` and `subscription_restarted`. Each notification is an HTTP `POST` to the `post_url` you register.

Gumroad can generate its own license keys (`license_key` in the ping, when licenses are enabled for the product). When NetLicensing is your licensing system, ignore them: NetLicensing creates the license, and you decide how the buyer receives it (for example by email, or through the [Customer Portal](customer-portal)).

## What Gumroad sends

The Ping payload is `x-www-form-urlencoded`. Useful fields: `sale_id`, `sale_timestamp`, `email`, `full_name`, `product_id`, `product_permalink`, `product_name`, `subscription_id` (if the purchase is part of a subscription), `recurrence`, `variants`, `custom_fields`, `license_key`, `quantity`, `price` and the other amounts (always in USD cents), `is_recurring_charge`, `refunded`, `test` and `resource_name`. A retried delivery also carries `retry_count` (1, 2 or 3). The page for resource subscriptions says that `sale`, `refund` and `dispute` notifications use the same format as a ping; it does not describe the format of the other resources.

## Map Gumroad events to NetLicensing

| Gumroad event | What to do in NetLicensing |
|----------------|---------------------|
| `sale` (`resource_name=sale`) | Create a licensee from `email` and `full_name`, then create a license from the plan's template for the `product_id` |
| `sale` with `is_recurring_charge` true | Create an additional license for the next period |
| `subscription_updated` | Upgrade or downgrade: create a license from the new template and deactivate the old one. A downgrade takes effect at the end of the current billing period (currently only for tiered membership products). |
| `cancellation` | A subscriber cancelled: decide whether to deactivate now or when `subscription_ended` arrives |
| `subscription_ended` | Deactivate the license (`active=false`) |
| `subscription_restarted` | Reactivate the license or create a new one |
| `refund` | Deactivate the license (`active=false`) |
| `dispute`, `dispute_won` | Hold the license on `dispute`; restore it on `dispute_won` |

Ignore pings with `test` set to true unless you are testing: Gumroad sets it when you buy your own product, and for a test ping.

## Check that the request comes from Gumroad

**Turn signing on.** It is off by default, and until you enable it the endpoint URL is the only credential on a request. Enable it in your Gumroad account settings; Gumroad then signs every ping with a secret you can rotate. A signed ping carries the header `X-Gumroad-Signature: t=<unix time>,v1=<signature>`. `v1` is the hex HMAC-SHA256 of `t`, a period and the **raw request body exactly as it arrived**. Reject a timestamp more than 5 minutes away from your clock, compare in constant time, and do not re-encode the parameters before hashing.

The signature covers pings sent to your Ping URL, including the test ping. Notifications for **resource subscriptions** go to your application's own URL and are **not** signed with this secret. A retried ping is signed again with a new timestamp, so never deduplicate on the signature.

## Retries and duplicates

Answer with any `2xx` status within 5 seconds; Gumroad reads nothing from the response body, so acknowledge first and do the work afterwards. Delivery is at least once and not ordered: **a refund ping can reach you before the sale ping it refers to.** Deduplicate on `sale_id` together with `resource_name`, because a refund carries the same `sale_id` as its sale.

A failed delivery is retried after 1 minute, 3 minutes, 10 minutes and 1 hour, and then stops. Only the response codes 499, 500, 502, 503 and 504 are retried; any other non-2xx response is not, and neither is a connection error or a timeout. Deliveries can therefore be dropped.

## Match the customer and the plan

Identify the buyer by `email` (and `purchaser_id` if the buyer has a Gumroad account), the sale by `sale_id`, and the plan by `product_id` or `product_permalink` together with `variants` or `recurrence`. Keep a lookup table from these to your `licenseTemplateNumber`. Use the `sale_id` as the license `number`, so a repeated ping cannot create a second license; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids). `custom_fields` carries the answers to checkout questions you add.

Gumroad's own advice is to treat a ping as a trigger rather than as data: take the `sale_id`, read the sale back through the Gumroad API, and reconcile against your own records from time to time, since a signature proves the origin but does not make the payload the source of truth.

## Example: the calls

```text
Gumroad                     Your receiver                 NetLicensing
|                           |                             |
| sale ping --------------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=email               |
|                           | POST /license ------------->|
|                           |  number=sale_id             |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Gumroad calls your receiver

```http
POST /webhooks/gumroad HTTP/1.1
Content-Type: application/x-www-form-urlencoded
X-Gumroad-Signature: t=1731052800,v1=<hex HMAC-SHA256>

sale_id=FiLe1Q%3D%3D&sale_timestamp=2026-11-08T10%3A00%3A00Z&email=jane%40example.com&full_name=Jane+Doe&product_id=abc123&product_permalink=pro&subscription_id=sub123&is_recurring_charge=false&test=false
```

### 2. Your receiver checks the request

```python
import hashlib, hmac, time

def verify_gumroad(raw_body: bytes, header: str, secret: str) -> bool:
    # header = request.headers["X-Gumroad-Signature"], "t=<unix time>,v1=<hex>"
    parts = dict(item.split("=", 1) for item in header.split(","))
    if abs(time.time() - int(parts["t"])) > 300:
        return False
    signed = parts["t"].encode() + b"." + raw_body
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, parts["v1"])
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. Signing covers pings to your Ping URL only. Gumroad advises reading the sale back through its API rather than trusting the ping.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# sale: the buyer's email becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=jane%40example.com&name=Jane%20Doe" \
  $NLIC/licensee

# sale (first or recurring charge): one license per sale, numbered from the sale_id (see below)
curl --user $AUTH --header "Accept: application/json" \
  --data "number=gr-191dac7790d7a51e70e44d1d83c4dc1e&licenseeNumber=jane%40example.com&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# refund, or subscription_ended with paid time left
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/gr-191dac7790d7a51e70e44d1d83c4dc1e
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

Gumroad sale ids can contain `=`, which NetLicensing does not accept in a number: numbers may contain only letters, digits and `@ + % & $ : . - _`. In our test, `FiLe1Q==` failed with `IllegalOperationException`, also when percent-encoded. Derive the number from the sale id instead:

```python
import hashlib

def license_number(sale_id: str) -> str:
    return "gr-" + hashlib.sha256(sale_id.encode()).hexdigest()[:32]

license_number("FiLe1Q==")   # "gr-191dac7790d7a51e70e44d1d83c4dc1e"
```

## Sources

- [Gumroad: Ping (source of the page)](https://github.com/antiwork/gumroad/blob/main/app/javascript/pages/Public/Ping.tsx){:target="_blank"}{:rel="noopener nofollow"}
- [Gumroad: resource subscriptions API (source)](https://github.com/antiwork/gumroad/blob/main/app/javascript/components/ApiDocumentation/Endpoints/ResourceSubscriptions.tsx){:target="_blank"}{:rel="noopener nofollow"}
- [Gumroad: ping signature (source)](https://github.com/antiwork/gumroad/blob/main/app/services/ping_signature.rb){:target="_blank"}{:rel="noopener nofollow"}
- [Gumroad](https://gumroad.com){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Gumroad connector. The Gumroad details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
