---
layout: default
title: "Cleverbridge Licensing Integration"
nav_title: "Cleverbridge"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 70
description: "Connect Cleverbridge to NetLicensing: paid order and subscription notifications create licenses, or use the license key generator callout."
permalink: cleverbridge
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Cleverbridge can post notifications for paid orders and subscription payments, protected by Basic auth, or call your URL at checkout and expect a license key back. Either way your receiver creates the NetLicensing licensee and license.

Cleverbridge is a merchant of record with public developer documentation (DevHub at `dev.cleverbridge.com`). It offers two mechanisms, and either can drive NetLicensing:

1. **Notifications**: Cleverbridge posts events (paid order, subscription paid, cancelled, refund and others) to your URL. Use the event mapping table below.
2. **License key generator**: when the customer clicks *Buy*, Cleverbridge calls a URL you provide, submits the purchase details, and expects the license in the response. This is similar to how the retired [MyCommerce](mycommerce) integration worked, where the Gateway returned the licensee number as the license code. **NetLicensing Gateway has no Cleverbridge connector today.** A receiver of your own can implement it: create the licensee and license through the REST API, and return the licensee number as the response.

## What Cleverbridge sends

Notifications use HTTPS `POST` (other transports exist: email, FTPS and SFTP upload). Cleverbridge recommends the **JSON object** format, which includes all transaction information; XML, CSV, key-value and Excel formats also exist. The pages we checked do not list the JSON field names: take them from the DevHub notification schema.

## Map Cleverbridge events to NetLicensing

| Cleverbridge event | What to do in NetLicensing |
|----------------|---------------------|
| `PaidOrderNotification` | Create a licensee, then create a license from the plan's template |
| `SubscriptionPaidNotification` | Create one license for the next period. The pages we read do not say whether it also fires for the first payment, which `PaidOrderNotification` already covers; check with a test order before you go live |
| `RecurringBillingCanceledNotification` | Deactivate the license (`active=false`) |
| `RefundNotification`, `PartialRefundNotification`, `ChargebackNotification` | Deactivate the license (`active=false`) |
| `RecurringBillingOnHoldNotification`, `RecurringBillingOnGraceNotification` | Your choice: keep access during the platform's retry period, or deactivate |
| `RecurringBillingReinstatedNotification` | Reactivate the license |
| `SubscriptionRenewalTypeChangedNotification`, `CustomerContactDataChangedNotification` | Informational, or update the licensee name |

## Check that the request comes from Cleverbridge

For notifications, Cleverbridge documents **basic web authentication** (username and password) on your URL and lists the IP ranges it sends from (`91.242.212.0/27` and `93.94.129.32/27`), while recommending against security based on IP addresses alone. We found no message signing. For the license key generator, use a username and password (recommended) or IP restrictions.

## Retries and duplicates

For notifications, Cleverbridge retries an undelivered notification automatically for 48 hours or 24 attempts, whichever comes first. For the license key generator, any content returned with HTTP `200` is treated as a valid license key (text for `text/html` or `text/plain`, a file for any other content type, up to 100 KB). A `4xx` or `5xx` response delays the transaction, and Cleverbridge retries once the problem is resolved.

## Match the customer and the plan

Customer, subscription and product fields come from the DevHub schema, which we did not read in full; the notification pages do not say whether your own parameters appear in notifications (the API has *Update Purchase Parameters* and *Update Subscription Parameters* endpoints). Plan a lookup table from the Cleverbridge product to your `licenseTemplateNumber`.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Cleverbridge                Your receiver                 NetLicensing
|                           |                             |
| PaidOrder --------------->|                             |
|                           | check Basic auth            |
|                           | POST /licensee ------------>|
|                           |  number=customer            |
|                           | POST /license ------------->|
|                           |  number=purchase            |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Cleverbridge calls your receiver

```http
POST /webhooks/cleverbridge HTTP/1.1
Content-Type: application/json
Authorization: Basic <base64 of user:password>

{ ...JSON object format, fields as in Cleverbridge's notification schema... }
```

### 2. Your receiver checks the request

```python
import base64, hmac

def basic_auth_ok(authorization_header: str, user: str, password: str) -> bool:
    expected = "Basic " + base64.b64encode(f"{user}:{password}".encode()).decode()
    return hmac.compare_digest(authorization_header or "", expected)
```

Cleverbridge documents Basic auth and its source IP ranges, and no message signing. Take the field names from the DevHub notification schema.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# PaidOrderNotification: your customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=cb-cust-1001&name=Jane%20Doe" \
  $NLIC/licensee

# PaidOrderNotification / SubscriptionPaidNotification: one license per paid purchase
curl --user $AUTH --header "Accept: application/json" \
  --data "number=cb-purchase-555&licenseeNumber=cb-cust-1001&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# RefundNotification or ChargebackNotification
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/cb-purchase-555
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Cleverbridge DevHub](https://dev.cleverbridge.com/){:target="_blank"}{:rel="noopener nofollow"}
- [Cleverbridge: notifications overview](https://dev.cleverbridge.com/docs/notifications-overview.md){:target="_blank"}{:rel="noopener nofollow"}
- [Cleverbridge: manage notifications](https://dev.cleverbridge.com/docs/manage-notifications.md){:target="_blank"}{:rel="noopener nofollow"}
- [Cleverbridge: key generator](https://dev.cleverbridge.com/docs/key-generator.md){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Cleverbridge connector. The Cleverbridge details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
