---
layout: default
title: "Authorize.Net Licensing Integration"
nav_title: "Authorize.Net"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 20
description: "Connect Authorize.Net recurring billing (ARB) to NetLicensing: each captured subscription payment creates a license, cancellation deactivates it."
permalink: authorize-net
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Authorize.Net signs its webhooks with HMAC-SHA512. Your receiver creates one license per captured subscription payment and deactivates it when the subscription is cancelled, terminated or expires.

[Authorize.Net](https://www.authorize.net){:target="_blank"}{:rel="noopener nofollow"} sends webhooks for events in your account, including customer profiles and automated recurring billing (ARB) subscriptions. Authorize.Net states that webhooks replace the Silent Post method. You declare a secure URL on your server to receive them.

## What Authorize.Net sends

Authorize.Net sends JSON with `notificationId`, `eventType`, `eventDate`, `webhookId` and `payload`. The payload has an `entityName` (`subscription`, `customerProfile`, `customerPaymentProfile` or `transaction`) and an `id`. A subscription payload shows `name`, `amount`, `status` and `profile.customerProfileId`.

## Map Authorize.Net events to NetLicensing

| Authorize.Net event | What to do in NetLicensing |
|----------------|---------------------|
| `net.authorize.customer.created` | Create a licensee |
| `net.authorize.customer.subscription.created` | Record the subscription; the payments arrive as `net.authorize.payment.authcapture.created` |
| `net.authorize.payment.authcapture.created` | A payment was captured. Authorize.Net stores the subscription id with every transaction a subscription generates; the webhook payload carries only the transaction `id`, so read the transaction through the API. For a subscription payment, create one license for the period, numbered with the transaction `id` |
| `net.authorize.customer.subscription.updated` | Read the subscription's new values; replace the license if the plan changed |
| `net.authorize.customer.subscription.cancelled`, `.terminated`, `.expired` | Deactivate the license (`active=false`) |
| `net.authorize.customer.subscription.suspended`, `.failed` | Your choice: keep access during the platform's retry period, or deactivate |
| `net.authorize.customer.subscription.expiring` | Informational |

The documentation lists payment events such as `net.authorize.payment.authcapture.created` but does not say which of them an automatic recurring charge produces. Test with a sandbox subscription before you create "next period" licenses from payment events.

## Check that the request comes from Authorize.Net

Authorize.Net sends the header `X-ANET-Signature`: an HMAC-SHA512 of the **body of the notification**, keyed with your merchant *Signature Key*. Reject the request if the hashes do not match.

## Retries and duplicates

Answer with `200 OK`. Authorize.Net retries up to 10 times: three times at three-minute intervals, three more times at eight-hour intervals, and four times at 48-hour intervals. After that the webhook is set to inactive and no more notifications are sent to the URL, so monitor failures: the REST endpoint `GET /rest/v1/notifications` lists them.

## Match the customer and the plan

The subscription payload shows a name and an amount, but **no plan or product id and no email**. Two fields help you correlate: `merchantCustomerId` on the customer profile and `merchantReferenceId`, which corresponds to the `refId` you send in your own API requests. Use them to find your own customer record, and map the subscription `name` or your own subscription records to a `licenseTemplateNumber`.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Authorize.Net               Your receiver                 NetLicensing
|                           |                             |
| authcapture.created ----->|                             |
|                           | verify signature            |
|< get transaction (API) ---|                             |
|                           | POST /licensee ------------>|
|                           |  number=customer id         |
|                           | POST /license ------------->|
|                           |  number=trans id            |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Authorize.Net calls your receiver

```http
POST /webhooks/authorize-net HTTP/1.1
Content-Type: application/json
X-ANET-Signature: <HMAC-SHA512 of the body>

{
  "notificationId": "...",
  "eventType": "net.authorize.payment.authcapture.created",
  "eventDate": "2017-03-29T20:48:02.0080095Z",
  "webhookId": "63d6fea2-aa13-4b1d-a204-f5fbc15942b7",
  "payload": {
    "responseCode": 1,
    "merchantReferenceId": "19102146534003137356",
    "authAmount": 45.00,
    "entityName": "transaction",
    "id": "60020981676"
  }
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

def verify_authorize_net(raw_body: bytes, header: str, signature_key: str) -> bool:
    expected = hmac.new(signature_key.encode(), raw_body, hashlib.sha512).hexdigest()
    received = header.split("=", 1)[-1]          # tolerate an "algorithm=" prefix
    return hmac.compare_digest(expected.lower(), received.lower())
```

The example payload is Authorize.Net's own. Its page states the algorithm (HMAC-SHA512 of the body with your Signature Key) but not the header's exact format; open-source integrations such as Odoo's read it as `<algorithm>=<hex>` and use the Signature Key as text, as the code above does. Confirm with one sandbox delivery. The payload has only the transaction `id`; read the transaction through the Authorize.Net API to see which subscription it belongs to.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# net.authorize.customer.created: your merchantCustomerId becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=M-1001&name=Jane%20Doe" \
  $NLIC/licensee

# authcapture.created for a subscription payment: one license per transaction
curl --user $AUTH --header "Accept: application/json" \
  --data "number=60020981676&licenseeNumber=M-1001&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Refund, or a subscription cancelled with paid time left
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/60020981676
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Authorize.Net: webhooks](https://developer.authorize.net/api/reference/features/webhooks.html){:target="_blank"}{:rel="noopener nofollow"}
- [Authorize.Net: recurring billing](https://developer.authorize.net/api/reference/features/recurring_billing.html){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host an Authorize.Net connector. The Authorize.Net details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
