---
layout: default
title: "2Checkout (Verifone) Licensing Integration"
nav_title: "2Checkout (Verifone)"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 10
description: "Connect 2Checkout (Verifone) to NetLicensing: IPN orders create licenses, LCN renewals extend them, cancellations deactivate them. HMAC-SHA256 check."
permalink: 2checkout
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: 2Checkout, now part of Verifone, sends two kinds of form-encoded notifications with an HMAC-SHA256 hash: IPN for orders and LCN for subscription changes. Your receiver creates licenses for orders and renewals and deactivates them on refunds, cancellations and expirations.

2Checkout (documented at `verifone.cloud` and `docs.2checkout.com`) has two webhooks:

- **IPN** (Instant Payment Notification) for orders: authorized and completed payments, refunds, chargebacks and customer creation.
- **LCN** (License Change Notification) for subscription changes: license changes, expirations and cancellations.

A Gateway connector for 2Checkout was requested ([issue #6](https://github.com/Labs64/NetLicensing-Gateway/issues/6){:target="_blank"}{:rel="noopener"}) but does not exist. 2Checkout offers **no license key delivery callout**, so NetLicensing creates the license, and you deliver it to the customer yourself (for example by email, or let the customer open the [Customer Portal](customer-portal)).

## What 2Checkout sends

Both webhooks are secure HTTPS `POST` requests with named form fields (not JSON). IPN identifies the order with `REFNO` (and `REFNOEXT`, your own reference), the customer with `CUSTOMEREMAIL` and `EXTERNAL_CUSTOMER_REFERENCE`, and the products with arrays such as `IPN_PID[]`, `IPN_PNAME[]` and `IPN_QTY[]`. LCN identifies the subscription with `LICENSE_CODE` and carries `EMAIL`, `STATUS` (`PENDING_ACTIVATION`, `ACTIVE`, `CANCELED`, `EXPIRED`, `PASTDUE` or `PAUSED`), `EXPIRATION_DATE`, `NEXT_RENEWAL_DATE`, `PSKU` and `EXTERNAL_CUSTOMER_REFERENCE`.

## Map 2Checkout events to NetLicensing

| 2Checkout event | What to do in NetLicensing |
|----------------|---------------------|
| IPN `MESSAGE_TYPE` `COMPLETE` | Create a licensee from `CUSTOMEREMAIL`, then create a license from the plan's template for each `IPN_PID[]` |
| IPN `REFUND`, `CHARGEBACK_OPEN`, `CANCELED` | Deactivate the license (`active=false`) |
| LCN `LICENCE_CHANGE` with `STATUS=ACTIVE` and a later `EXPIRATION_DATE` | A renewal or change: create an additional license for the next period |
| LCN `LICENCE_EXPIRATION`, `CANCELATION_ON_DEMAND` | Deactivate the license (`active=false`) |
| LCN `LICENCE_PASTDUE` | Your choice: keep access during the platform's retry period, or deactivate |
| LCN `SCHEDULED_FOR_CANCELATION_ON_DEMAND` | Cancellation scheduled: deactivate at the scheduled date (`REVERT_CANCELATION_ON_DEMAND` reverses it) |

IPN has many more `MESSAGE_TYPE` values, for example `PENDING`, `APPROVED`, `ORDER_UNDER_REVIEW` and `SUSPECT`. LCN trigger names use the spelling `LICENCE_...`. 2Checkout's documentation does not name "renewal" or "upgrade" as LCN events; they arrive as license changes.

## Check that the request comes from 2Checkout

The request carries `SIGNATURE_SHA2_256` (or `SIGNATURE_SHA3_256`). To calculate it, take every value of the body **in the order received**, prefix each with its length **in bytes** (use a byte-length function such as PHP `strlen` on UTF-8 strings), concatenate without separators, and compute an HMAC-SHA256 hex digest with your account secret key. Empty values contribute `0` and no length. The older `HASH` (HMAC-MD5) is not supported since 2024-08-15.

2Checkout also expects a **read receipt** in your response, otherwise it resends: `<sig algo="sha256" date="YYYYMMDDHHMMSS">HASH</sig>`. For IPN the hash covers `IPN_PID[0]`, `IPN_PNAME[0]`, `IPN_DATE` and `DATE`; for LCN it covers `LICENSE_CODE`, `EXPIRATION_DATE` and `DATE` (date format `YmdGis`). Each value is length-prefixed in the same way. The 2Checkout pages show worked examples with test vectors; reproduce them before you go live.

## Retries and duplicates

IPN is sent immediately; if it fails, two more are sent after 5 minutes, four more at 15-minute intervals, and then hourly for a maximum of two days, until a valid response arrives. For LCN, the documentation refers to the same failure retry process without giving a schedule. You can set up to 8 IPN URLs. When you save a URL, 2Checkout makes a `GET` request to it and expects `200`.

## Match the customer and the plan

Set your own NetLicensing licensee number as the external customer reference (`EXTERNAL_CUSTOMER_REFERENCE`), so later notifications point straight to the licensee, and use the order reference (`REFNO`) in the license `number`; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids). Map `IPN_PID[]` (or `PSKU` in LCN) to your `licenseTemplateNumber`. 2Checkout supports custom order fields (`IPN_CUSTOM_TEXT[]`, `IPN_CUSTOM_VALUE[]`, `CUSTOM_FIELDS`); enable new parameters on the IPN settings page to receive them.

## Example: the calls

```text
2Checkout                   Your receiver                 NetLicensing
|                           |                             |
| IPN COMPLETE ------------>|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=ext. ref            |
|                           | POST /license ------------->|
|                           |  number=REFNO-item          |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. 2Checkout calls your receiver

```http
POST /webhooks/2checkout/ipn HTTP/1.1
Content-Type: application/x-www-form-urlencoded

REFNO=12345678&REFNOEXT=&CUSTOMEREMAIL=jane%40example.com&EXTERNAL_CUSTOMER_REFERENCE=CUST-1001&IPN_PID[]=1&IPN_PNAME[]=Pro&IPN_QTY[]=1&IPN_DATE=20261108100000&...&SIGNATURE_SHA2_256=<hex>
```

### 2. Your receiver checks the request

```python
import hashlib, hmac, time

from urllib.parse import parse_qsl

SIGNATURE_FIELDS = {"HASH", "SIGNATURE_SHA2_256", "SIGNATURE_SHA3_256"}

def length_prefixed(values) -> str:
    out = ""
    for v in values:
        n = len(v.encode("utf-8"))      # length in bytes, not characters
        out += f"{n}{v}" if n else "0"  # empty value: "0" and nothing else
    return out

def verify_2checkout_ipn(raw_body: bytes, secret_key: str) -> bool:
    pairs = parse_qsl(raw_body.decode("utf-8"), keep_blank_values=True)  # keeps the received order
    received = dict(pairs).get("SIGNATURE_SHA2_256", "")
    base = length_prefixed(v for k, v in pairs if k not in SIGNATURE_FIELDS)
    expected = hmac.new(secret_key.encode(), base.encode("utf-8"), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, received)

def ipn_read_receipt(pairs, secret_key: str) -> str:
    # Hash over IPN_PID[0], IPN_PNAME[0], IPN_DATE and DATE, answered as <sig .../>
    d = {}
    for k, v in pairs:
        d.setdefault(k, v)                # keep the first IPN_PID[] / IPN_PNAME[] value
    date = time.strftime("%Y%m%d%H%M%S", time.gmtime())
    base = length_prefixed([d["IPN_PID[]"], d["IPN_PNAME[]"], d["IPN_DATE"], date])
    sig = hmac.new(secret_key.encode(), base.encode("utf-8"), hashlib.sha256).hexdigest()
    return f'<sig algo="sha256" date="{date}">{sig}</sig>'
```

This follows 2Checkout's *Calculate the IPN HASH signature* page and its PHP sample: every received value in order, each prefixed with its length in bytes, `0` for an empty value, without the signature fields themselves. We ran `verify_2checkout_ipn` against the worked example on that page (secret key `AABBCCDDEEFF`, expected SHA-256 hash `d80f8520…e495`) and it matched. 2Checkout's own Node.js and Python samples skip empty values, which does not reproduce that example. Answer every IPN with the read receipt from `ipn_read_receipt`; 2Checkout's PHP sample computes its `DATE` in UTC in the format `YYYYMMDDHHMMSS`.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# IPN COMPLETE: your EXTERNAL_CUSTOMER_REFERENCE becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=CUST-1001&name=Jane%20Doe" \
  $NLIC/licensee

# One license per order line, numbered with REFNO and the product
curl --user $AUTH --header "Accept: application/json" \
  --data "number=12345678-1&licenseeNumber=CUST-1001&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# IPN REFUND or CHARGEBACK_OPEN
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/12345678-1
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [2Checkout: webhooks](https://docs.2checkout.com/2checkout-apis/2checkout-apis/webhooks.md){:target="_blank"}{:rel="noopener nofollow"}
- [2Checkout: IPN parameters](https://docs.2checkout.com/2checkout-apis/2checkout-apis/webhooks/instant-payment-notification-ipn/ipn-parameters.md){:target="_blank"}{:rel="noopener nofollow"}
- [2Checkout: calculate the IPN hash signature](https://docs.2checkout.com/2checkout-apis/2checkout-apis/webhooks/instant-payment-notification-ipn/calculate-the-ipn-hash-signature.md){:target="_blank"}{:rel="noopener nofollow"}
- [2Checkout: IPN post failure recovery](https://docs.2checkout.com/2checkout-apis/2checkout-apis/webhooks/instant-payment-notification-ipn/ipn-post-failure-recovery-process.md){:target="_blank"}{:rel="noopener nofollow"}
- [2Checkout: LCN triggers](https://docs.2checkout.com/2checkout-apis/2checkout-apis/webhooks/license-change-notification-lcn/lcn-triggers.md){:target="_blank"}{:rel="noopener nofollow"}
- [2Checkout: LCN read receipt](https://docs.2checkout.com/2checkout-apis/2checkout-apis/webhooks/license-change-notification-lcn/lcn-read-receipt-response-for-2checkout.md){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a 2Checkout connector. The 2Checkout details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
