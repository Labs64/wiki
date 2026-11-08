---
layout: default
title: "PayPro Global Licensing Integration"
nav_title: "PayPro Global"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 220
description: "Connect PayPro Global to NetLicensing: order and subscription charge IPNs create licenses, terminations and refunds deactivate them. SHA-256 check."
permalink: payproglobal
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: PayPro Global sends form-encoded IPNs with a SHA-256 `SIGNATURE`. Your receiver creates a license for the initial order and one for each recurring charge, and deactivates it on termination, refund or chargeback.

[PayPro Global](https://payproglobal.com){:target="_blank"}{:rel="noopener nofollow"} describes itself as an "all-in-one platform for selling SaaS, software and video games". Its webhook, also called IPN, is configured in your PayPro Global account.

## What PayPro Global sends

PayPro Global sends an HTTPS `POST` with `Content-Type: application/x-www-form-urlencoded`. The event is in `IPN_TYPE_NAME`. Documented fields include `ORDER_ID`, `PRODUCT_ID`, `ORDER_ITEM_SKU`, `CUSTOMER_EMAIL`, `CUSTOMER_FIRST_NAME`, `CUSTOMER_LAST_NAME`, `SUBSCRIPTION_ID`, `SUBSCRIPTION_INITIAL_ORDER_ID`, `ORDER_TOTAL_AMOUNT`, `ORDER_CURRENCY_CODE` and `ACTION_REASON` (the reason for a refund, chargeback, decline or cancellation).

## Map PayPro Global events to NetLicensing

| PayPro Global event | What to do in NetLicensing |
|----------------|---------------------|
| `OrderCharged` | A one-time product or the initial order of a subscription: Create a licensee and create a license from the plan's template |
| `SubscriptionChargeSucceed` | A recurring payment was processed: create one license for the next period, numbered with the `ORDER_ID` |
| `SubscriptionRenewed` | The subscription was renewed by the customer or by PayPro Global support. PayPro Global does not say whether a renewal also sends `SubscriptionChargeSucceed`; with the `ORDER_ID` as license number, a second create for the same order fails as a duplicate |
| `SubscriptionTerminated` | Deactivate the license (`active=false`) |
| `SubscriptionSuspended` | Hold or deactivate the license until the subscription is active again |
| `OrderRefunded`, `OrderPartiallyRefunded` | Deactivate the license (`active=false`) for a full refund |
| `OrderChargedBack`, `OrderChargedBackWon` | Deactivate on chargeback; restore the license when the dispute is won |
| `SubscriptionChargeFailed`, `OrderDeclined` | Your choice: keep access during the platform's retry period, or deactivate |

Some events (`OrderOnWaiting`, `SubscriptionPaymentInfoChanged`, `InstantLeadNotification`, and the bank-decline case of `OrderDeclined`) need **extended webhooks**; PayPro Global's page says to contact the team.

## Check that the request comes from PayPro Global

Each request carries a `SIGNATURE` parameter, documented as `SHA256({ORDER_ID}+{ORDER_STATUS}+{ORDER_TOTAL_AMOUNT}+{CUSTOMER_EMAIL}+{VALIDATION_KEY}+{TEST_MODE}+{IPN_TYPE_NAME})`: recompute it with your validation key and compare. Use the exact notation of PayPro Global's webhook page. A `HASH` parameter (documented as an MD5 of the order id plus the secret key) is also sent, but prefer the `SHA256` signature. The page also lists fixed source IP addresses you can allow.

## Retries and duplicates

Return HTTP `200`. PayPro Global retries the call to your webhook URL every 30 minutes, for a maximum of 3 attempts. (The retries mentioned in the subscription documentation are charge attempts to the customer, not webhooks.)

## Match the customer and the plan

Identify the buyer by `CUSTOMER_EMAIL`, the subscription by `SUBSCRIPTION_ID`, and the product by `PRODUCT_ID` or `ORDER_ITEM_SKU`; map it to your `licenseTemplateNumber` with a lookup table. The payload also has `ORDER_CUSTOM_FIELDS` ("custom fields used in the order") and `CHECKOUT_QUERY_STRING`; the page we read does not say how a merchant sets custom fields, so test before you use them to carry a licensee number.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
PayPro Global               Your receiver                 NetLicensing
|                           |                             |
| OrderCharged ------------>|                             |
|                           | verify SIGNATURE            |
|                           | POST /licensee ------------>|
|                           |  number=customer            |
|                           | POST /license ------------->|
|                           |  number=ORDER_ID            |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. PayPro Global calls your receiver

```http
POST /webhooks/payproglobal HTTP/1.1
Content-Type: application/x-www-form-urlencoded

IPN_TYPE_NAME=SubscriptionChargeSucceed&ORDER_ID=1234567&ORDER_STATUS=Processed&ORDER_TOTAL_AMOUNT=49.00&CUSTOMER_EMAIL=jane%40example.com&SUBSCRIPTION_ID=7654&PRODUCT_ID=98765&TEST_MODE=0&SIGNATURE=<value>
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

from urllib.parse import parse_qsl

def verify_paypro(raw_body: bytes, validation_key: str) -> bool:
    f = dict(parse_qsl(raw_body.decode("utf-8"), keep_blank_values=True))
    base = (f["ORDER_ID"] + f["ORDER_STATUS"] + f["ORDER_TOTAL_AMOUNT"] + f["CUSTOMER_EMAIL"]
            + validation_key + f["TEST_MODE"] + f["IPN_TYPE_NAME"])
    expected = hashlib.sha256(base.encode("utf-8")).hexdigest()   # plain SHA-256, not HMAC
    return hmac.compare_digest(expected, f.get("SIGNATURE", "").lower())
```

PayPro Global's example is `sha256("12345Processed9.99test@payproglobal.comqwerty1OrderCharged")`: the values are concatenated without separators and hashed with plain SHA-256. Recompute `SIGNATURE` = `SHA256({ORDER_ID}+{ORDER_STATUS}+{ORDER_TOTAL_AMOUNT}+{CUSTOMER_EMAIL}+{VALIDATION_KEY}+{TEST_MODE}+{IPN_TYPE_NAME})` with your validation key, using the exact notation on PayPro Global's webhook page, and compare. Test the comparison with a sandbox IPN before you go live.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# OrderCharged: the customer email (or your own id) becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=jane%40example.com&name=Jane%20Doe" \
  $NLIC/licensee

# OrderCharged / SubscriptionChargeSucceed: one license per order
curl --user $AUTH --header "Accept: application/json" \
  --data "number=1234567&licenseeNumber=jane%40example.com&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# OrderRefunded or OrderChargedBack
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/1234567
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [PayPro Global: webhook (IPN)](https://developers.payproglobal.com/docs/integrate-with-paypro-global/webhook-ipn/){:target="_blank"}{:rel="noopener nofollow"}
- [PayPro Global: subscription overview](https://developers.payproglobal.com/docs/subscriptions/subscription-overview/){:target="_blank"}{:rel="noopener nofollow"}
- [PayPro Global](https://payproglobal.com/){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a PayPro Global connector. The PayPro Global details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
