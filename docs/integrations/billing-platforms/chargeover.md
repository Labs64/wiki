---
layout: default
title: "ChargeOver Licensing Integration"
nav_title: "ChargeOver"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 60
description: "Connect ChargeOver recurring billing to NetLicensing: package webhooks create licenses, cancel and suspend deactivate them. Shared-secret check."
permalink: chargeover
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: ChargeOver posts a webhook when a customer, subscription (a *package*) or transaction changes, protected by a shared secret token. Your receiver looks up the package, creates licenses for paid periods and deactivates them on cancel or suspend.

[ChargeOver](https://chargeover.com){:target="_blank"}{:rel="noopener nofollow"} sends a webhook when a customer, subscription (called a *package*) or transaction changes. In ChargeOver, a subscription is a "package": its id is the `package_id`.

## What ChargeOver sends

ChargeOver sends an HTTP `POST` with `Content-Type: application/json`. The body has `context_str` (the kind of object), `context_id` (its id), `event`, `data` and `security_token`. Only `https://` URLs are allowed, only ports 80 and 443, and you cannot use a bare IP address.

## Map ChargeOver events to NetLicensing

| ChargeOver event | What to do in NetLicensing |
|----------------|---------------------|
| `customer` / `insert` | Create a licensee |
| `package` / `insert` | Create a license from the plan's template |
| `package` / `generate` | The subscription generated an invoice: the next period starts; create an additional license. The pages we read do not say whether the first invoice also sends `generate`; check with a test subscription, and if it does, create licenses on `generate` only |
| `package` / `cancel` | Deactivate the license (`active=false`) |
| `package` / `suspend`, `package` / `unsuspend` | Deactivate on suspend; reactivate on unsuspend |
| `transaction` / `insert`, `transaction` / `status` | Your choice: keep access during the platform's retry period, or deactivate (use these for payment results) |

ChargeOver documents no named events for "payment succeeded" or "payment failed"; the `transaction` events carry the payment result.

## Check that the request comes from ChargeOver

ChargeOver does not document a signature. When you create a webhook you receive a *shared secret token*, which is sent as the header `X-ChargeOver-Key` and as the JSON attribute `security_token`. Compare it with the value shown in ChargeOver and reject the request if it differs.

## Retries and duplicates

Return `200 OK` when you have received the data; return a non-200 header if ChargeOver should retry. The timeout is 14 seconds. Non-200 deliveries are logged in the *Webhook Log* report in the Report Center. The retry count and schedule are not documented on the pages we checked.

## Match the customer and the plan

For `package` events, `context_id` is the `package_id`. The customer id, the customer email and the plan are not shown in the package examples we could read, and custom fields are not documented there. Look up the package through the ChargeOver API to find its customer and plan, then map the plan to your `licenseTemplateNumber`.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
ChargeOver                  Your receiver                 NetLicensing
|                           |                             |
| package generate -------->|                             |
|                           | compare shared token        |
|< GET package (API) -------|                             |
|                           | POST /licensee ------------>|
|                           |  number=customer id         |
|                           | POST /license ------------->|
|                           |  number=pkg-period          |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. ChargeOver calls your receiver

```http
POST /webhooks/chargeover HTTP/1.1
Content-Type: application/json
X-ChargeOver-Key: <shared secret token>

{
  "context_str": "package",
  "context_id": 1234,
  "event": "generate",
  "data": { },
  "security_token": "<shared secret token>"
}
```

### 2. Your receiver checks the request

```python
import hmac

def verify_chargeover(header_value: str, body: dict, shared_token: str) -> bool:
    return (hmac.compare_digest(header_value or "", shared_token)
            and hmac.compare_digest(str(body.get("security_token", "")), shared_token))
```

ChargeOver does not sign requests; compare the shared token. `context_id` is the `package_id`: read the package through the ChargeOver API to find its customer and plan.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# customer insert: the ChargeOver customer id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=co-cust-77&name=Jane%20Doe" \
  $NLIC/licensee

# package generate: one license per generated invoice period
curl --user $AUTH --header "Accept: application/json" \
  --data "number=co-pkg-1234-2026-11&licenseeNumber=co-cust-77&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# package cancel or suspend
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/co-pkg-1234-2026-11
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [ChargeOver: webhooks](https://developer.chargeover.com/docs/webhooks/webhooks-documentation){:target="_blank"}{:rel="noopener nofollow"}
- [ChargeOver: event reference list](https://developer.chargeover.com/docs/webhooks-bottom/quick-reference-list/reference-list){:target="_blank"}{:rel="noopener nofollow"}
- [ChargeOver: verifying webhooks](https://developer.chargeover.com/docs/webhooks-bottom/best-practices/verifying-and-validating-webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [ChargeOver: network errors and timeouts](https://developer.chargeover.com/docs/webhooks-bottom/best-practices/network-errors-and-timeouts){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a ChargeOver connector. The ChargeOver details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
