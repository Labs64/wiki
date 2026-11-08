---
layout: default
title: "Recurly Licensing Integration"
nav_title: "Recurly"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 230
description: "Connect Recurly to NetLicensing: new and renewed subscription notifications create licenses, expirations deactivate them. Signature, retries, ID matching."
permalink: recurly
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Recurly sends webhook notifications as JSON (with an HMAC-SHA256 signature) or XML. Your receiver creates a license for a new subscription and one for each renewal, and deactivates it when the subscription expires.

[Recurly](https://recurly.com){:target="_blank"}{:rel="noopener nofollow"} sends webhook notifications for accounts, subscriptions and payments. You set up endpoints in the Recurly admin interface, up to 10 per site. Webhooks are available on all Recurly plans.

A Gateway connector for Recurly was requested ([issue #3](https://github.com/Labs64/NetLicensing-Gateway/issues/3){:target="_blank"}{:rel="noopener"}) but does not exist. The approach below needs no Gateway.

## What Recurly sends

Recurly sends an HTTP `POST` in JSON or XML, whichever format you choose for the endpoint. JSON notifications carry `id`, `object_type`, `site_id`, `event_type` and `event_time`, plus the subscription `uuid` or the account `account_code`.

## Map Recurly events to NetLicensing

| Recurly event | What to do in NetLicensing |
|----------------|---------------------|
| `new_account_notification` | Create a licensee |
| `new_subscription_notification` | Create a license from the plan's template |
| `renewed_subscription_notification` | Create an additional license for the next period |
| `successful_payment_notification` | Payment succeeded. The subscription notifications already cover the periods, so do not add a license here as well |
| `updated_subscription_notification` | Upgrade, downgrade or renewal date change: create a license from the new template and deactivate the old one |
| `canceled_subscription_notification` | The subscription stays valid until `expires_at`: deactivate the license at that date, or when `expired_subscription_notification` arrives |
| `expired_subscription_notification` | Deactivate the license (`active=false`) |
| `failed_payment_notification` | Your choice: keep access during the platform's retry period, or deactivate |

Recurly documents no named past-due notification, and calls the payment notifications "legacy", suggesting subscription and invoice notifications instead.

## Check that the request comes from Recurly

Choose **JSON** for the endpoint: only JSON notifications are signed (XML notifications are not). The header `recurly-signature` has the form `<timestamp in milliseconds>,<hex signature>[,<hex signature>]`. The signature is an HMAC-SHA256 over the timestamp, a dot and the raw body, keyed with the endpoint's own key. You can add HTTP Basic Auth on the Webhook Endpoints page.

## Retries and duplicates

Answer with `2xx` within 5 seconds; redirects are not followed. Recurly makes up to 10 attempts, with the interval `10 + x * 2^(x + 5)` seconds, and keeps notifications for 15 days. The header `recurly-notification-id` stays the same across retries, so use it to deduplicate. Expect duplicates and out-of-order delivery.

## Match the customer and the plan

The JSON samples are minimal: they do **not** include the account email or the plan. XML notifications include `<account_code>`, `<email>`, the subscription `<uuid>` and `<plan_code>`. If you use JSON, take the missing details from the Recurly API. Recurly custom fields exist on accounts, charges, items, plans and subscriptions (text, up to 255 characters, defined in the admin console; the number allowed depends on your Recurly plan). The documentation does not say whether they appear in webhook payloads, so a lookup table from `plan_code` to `licenseTemplateNumber` is the safe route.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Recurly                     Your receiver                 NetLicensing
|                           |                             |
| subscription renewed ---->|                             |
|                           | verify signature            |
|< GET account (API) -------|                             |
|                           | POST /licensee ------------>|
|                           |  number=account code        |
|                           | POST /license ------------->|
|                           |  number=uuid-period         |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Recurly calls your receiver

```http
POST /webhooks/recurly HTTP/1.1
Content-Type: application/json
recurly-signature: 1731052800000,<hex signature>

{
  "id": "ra8foq26o2dt",
  "object_type": "subscription",
  "site_id": "qc326l1hl8k9",
  "event_type": "renewed",
  "event_time": "2022-07-26T22:01:56Z",
  "uuid": "63ab531e1d5b1d47eaf1ef44eeb853c3"
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_recurly(raw_body: bytes, header: str, endpoint_key: str) -> bool:
    # header = request.headers["recurly-signature"]: "<ms timestamp>,<sig>[,<sig>]"
    timestamp, *signatures = header.split(",")
    signed = timestamp.encode() + b"." + raw_body
    expected = hmac.new(endpoint_key.encode(), signed, hashlib.sha256).hexdigest()
    return any(hmac.compare_digest(expected, s) for s in signatures)
```

Verify the **raw** request body exactly as received, before any JSON or form parsing. Only JSON endpoints are signed. The minimal JSON notification has no email or plan, so read the account and subscription through the Recurly API before you create the license.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# New account: the Recurly account code becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=acct_1001&name=Jane%20Doe" \
  $NLIC/licensee

# created or renewed: one license per period, <subscription uuid>-<period>
curl --user $AUTH --header "Accept: application/json" \
  --data "number=63ab531e1d5b1d47eaf1ef44eeb853c3-2026-11&licenseeNumber=acct_1001&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# expired, or refunded
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/63ab531e1d5b1d47eaf1ef44eeb853c3-2026-11
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Recurly: webhooks](https://docs.recurly.com/docs/webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [Recurly: notifications](https://docs.recurly.com/recurly-subscriptions/docs/notifications){:target="_blank"}{:rel="noopener nofollow"}
- [Recurly: subscription notifications](https://docs.recurly.com/recurly-subscriptions/docs/subscription-notifications){:target="_blank"}{:rel="noopener nofollow"}
- [Recurly: payment notifications](https://docs.recurly.com/recurly-subscriptions/docs/payment-notifications){:target="_blank"}{:rel="noopener nofollow"}
- [Recurly: custom fields](https://docs.recurly.com/recurly-subscriptions/docs/custom-fields){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Recurly connector. The Recurly details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
