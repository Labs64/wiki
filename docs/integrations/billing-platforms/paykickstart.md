---
layout: default
title: "PayKickstart Licensing Integration"
nav_title: "PayKickstart"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 200
description: "Connect PayKickstart to NetLicensing: each sales IPN creates a license, including rebills; cancellations and refunds deactivate it. HMAC-SHA1 check."
permalink: paykickstart
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: PayKickstart posts form-encoded IPNs with an HMAC-SHA1 `hash`. The `sales` event fires for every successful transaction, including rebills, so your receiver creates one license per transaction and deactivates it on cancellation or refund.

[PayKickstart](https://paykickstart.com){:target="_blank"}{:rel="noopener nofollow"} calls the IPN URL you set on a product when something happens. Each product needs its own IPN URL (you can add several), and you choose whether it fires on all events or on specific events.

## What PayKickstart sends

PayKickstart sends an HTTP `POST` as `application/x-www-form-urlencoded`. Documented fields include `buyer_email`, `buyer_first_name`, `buyer_last_name`, `transaction_id`, `invoice_id` (the purchase id), `product_id`, `product_name`, `campaign_id`, `tracking_id`, `transaction_time`, `mode` (`live` or `test`) and `payment_processor`.

## Map PayKickstart events to NetLicensing

| PayKickstart event | What to do in NetLicensing |
|----------------|---------------------|
| `sales` | Fires for every successful transaction, including subscription rebills. Create the licensee from `buyer_email` the first time, and one license per transaction, numbered with `transaction_id` |
| `subscription-created` | No license: the payment arrives as `sales` |
| `subscription-payment` | Fires for each subscription transaction (`is_rebill` marks renewals). `sales` already covers the payment, so create no license here; if you prefer this event for subscriptions, ignore `sales` for them, never use both |
| `subscription-updated`, `subscription-changed` | Create a license from the new template and deactivate the old one |
| `subscription-pause`, `subscription-unpaused` | Deactivate on pause; reactivate on unpause |
| `subscription-cancelled`, `subscription-completed`, `refund` | Deactivate the license (`active=false`) |
| `subscription-pending-cancelation` | Cancellation at the end of the period: deactivate at period end (`subscription-pending-cancellation-revoked` reverses it) |
| `subscription-payment-failed` | Your choice: keep access during the platform's retry period, or deactivate |

PayKickstart documents no event named `rebill` or `cancel`: use `subscription-payment` and `subscription-cancelled`. Further events exist for trials, leads and fulfilment status.

## Check that the request comes from PayKickstart

The request contains a `hash` field. Remove `hash` and `verification_code`, drop empty values, sort the remaining keys alphabetically, join the values with `|`, and compute an **HMAC-SHA1** hex digest with your IPN secret key. The secret is unique to each campaign (`campaign_id` tells you which one). PayKickstart's PHP, JavaScript and Python examples differ slightly in which values they drop (the JS and Python versions also drop `"0"`, `0` and null), so copy one example and use it consistently.

## Retries and duplicates

An IPN has a 20 second timeout in total (5 for the connection, 15 for the request). PayKickstart tries up to 13 times to get a positive response. After the last failed retry the IPN URL is **suspended** until you edit and save it again, so monitor it. Events may not arrive in the order they happened.

## Match the customer and the plan

`buyer_email` identifies the customer and `product_id` the product: map it to your `licenseTemplateNumber`. The documentation lists no subscription id; `invoice_id` is the purchase id. Fields starting with `custom_` carry GET variables of the checkout page URL: `?var1=123` arrives as `custom_var1`, so you can pass your NetLicensing licensee number or template number through the checkout link.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
PayKickstart                Your receiver                 NetLicensing
|                           |                             |
| sales IPN --------------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=email               |
|                           | POST /license ------------->|
|                           |  number=transaction_id      |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. PayKickstart calls your receiver

```http
POST /webhooks/paykickstart HTTP/1.1
Content-Type: application/x-www-form-urlencoded

event=sales&mode=live&buyer_email=jane%40example.com&buyer_first_name=Jane&buyer_last_name=Doe&transaction_id=5567&invoice_id=PK-123&product_id=42&campaign_id=7&hash=<hex HMAC-SHA1>
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

from urllib.parse import parse_qsl

def verify_paykickstart(raw_body: bytes, ipn_secret: str) -> bool:
    fields = dict(parse_qsl(raw_body.decode(), keep_blank_values=True))
    received = fields.pop("hash", "")
    fields.pop("verification_code", None)
    data = "|".join(v for k, v in sorted(fields.items()) if v != "")
    expected = hmac.new(ipn_secret.encode(), data.encode(), hashlib.sha1).hexdigest()
    return hmac.compare_digest(expected, received)
```

This follows the rule described above. PayKickstart's own JavaScript and Python examples also drop `"0"` values; pick one of its examples and keep it consistent. The secret is per campaign (`campaign_id`).

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# First sales event: the buyer's email becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=jane%40example.com&name=Jane%20Doe" \
  $NLIC/licensee

# sales (initial or rebill): one license per transaction_id
curl --user $AUTH --header "Accept: application/json" \
  --data "number=pk-5567&licenseeNumber=jane%40example.com&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# refund, or subscription-cancelled with paid time left
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/pk-5567
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [PayKickstart: API and IPN documentation](https://docs.paykickstart.com/){:target="_blank"}{:rel="noopener nofollow"}
- [PayKickstart: product IPN URL field](https://support.paykickstart.com/articles/5892063-using-the-product-ipn-url-field){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a PayKickstart connector. The PayKickstart details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
