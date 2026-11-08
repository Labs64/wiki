---
layout: default
title: "Zuora Licensing Integration"
nav_title: "Zuora"
parent: Billing and Commerce Platforms
grand_parent: Integrations
nav_order: 290
description: "Connect Zuora to NetLicensing: callout notifications for new subscriptions, renewals and cancellations create and deactivate licenses. HMAC, Basic or OAuth."
permalink: zuora
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Zuora's callout notifications are webhooks whose body you design yourself, with Basic, OAuth 2.0 or HMAC authentication. Your receiver creates a license for a new subscription and for each renewal amendment, and deactivates it on cancellation.

Zuora's *Events and Notifications* feature sends **callout notifications**: HTTP requests to external web services, also known as webhooks. You set them up in Zuora under *Extension Studio > Events & Notifications*:

- A **notification definition** ties together an event, filtering logic, a callout template and a communication profile.
- A **callout template** holds the HTTP method, request URL, request body, authentication and retry settings.

Because you write the request body in the template, **the payload is yours to design**: you decide which fields NetLicensing receives. Managing these settings needs the Zuora permission *Events & Notifications Manage Access*.

## What Zuora sends

You choose the HTTP method (`POST` is the default; `GET`, `PUT`, `PATCH` and `DELETE` are also available). The URL must use `https://` and Zuora sends to port 443 by default (other ports on request through Zuora Global Support). The URL, the body and custom headers can contain **merge fields**, placeholders that Zuora replaces with values from the event's base object when it fires. Advanced merge fields start with the base object, for example `{% raw %}{{Invoice.Account.AccountNumber}}{% endraw %}`; data source merge fields look like `{% raw %}{{DataSource.Account.AccountNumber}}{% endraw %}`. Put the account number, the subscription number and the product or rate plan identifier into the body, and use the template preview to check the result. The available fields depend on the event; see Zuora's merge field documentation.

## Map Zuora events to NetLicensing

| Zuora event | What to do in NetLicensing |
|----------------|---------------------|
| Standard event *New Subscription Created* (*Active* or *Pending Acceptance*) | Create a licensee from the account, then create a license from the plan's template |
| Standard event *Renewal* (AmendmentProcessed) | Create an additional license for the next period |
| Standard events *NewProduct*, *RemoveProduct*, *UpdateProduct* | Create, deactivate or replace the license for the changed product |
| Standard event *Cancellation* (AmendmentProcessed) | Deactivate the license (`active=false`) |
| Standard events *Suspend Subscription* and *Resume Subscription* (limited availability) | Deactivate on suspend; reactivate on resume |
| Standard event *Day(s) Before/After Invoice Due Date* (Invoice Due) | Your choice: keep access during the platform's retry period, or deactivate |
| Standard event *First Attempt Payment Declined* | Your choice: keep access during the platform's retry period, or deactivate. The setting *Sequence of failed attempt* chooses which failed attempt triggers the notification (default 1) |
| *Account Created* (a custom event on the Account object) | Create a licensee |

Payment notifications (processed and declined) are for **electronic payments only**; external payments do not trigger them. Events for Zuora Orders are Zuora custom events. You can also define your own custom events (a base object plus a trigger condition) and custom scheduled events.

## Check that the request comes from Zuora

In the callout template, choose the authentication type: *None*, *Username/Password* (Basic and NTLM, with optional preemptive authentication) or *OAuth 2.0*. You can **add HMAC** on top of Basic or OAuth: select the algorithm (MD5, SHA-1, SHA-224, SHA-256, SHA-384 or SHA-512), the output format (BASE64 or HEX), a shared secret key, the *Data* to sign (for example `{% raw %}{{Request.Body}}{% endraw %}`), the *Header Key* and the *Header Value* (for example `{% raw %}{{Request.HMAC.Signed}}{% endraw %}`). Your receiver computes the same HMAC over the same data with the same secret and compares it with the header. You can also add custom callout headers, and pin your receiver's SSL certificate (PEM format) to avoid certificate errors (HTTP status 495).

## Retries and duplicates

The receiver must answer with HTTP status `200`, or Zuora counts the callout as failed. With the option *Confirm success by parsing response content*, Zuora also requires `Content-Type: application/json` and a body with the field `success` set to `true`. Select *Retriable* on the template to apply the retry rules: the default is 3 attempts at 30-minute intervals; you can configure up to 5 attempts and an interval of up to 1440 minutes under *Settings* (callout settings). If authentication fails on a retriable template, Zuora retries as well. Zuora processes events in the order they were triggered, but delivery time can vary with retries and load. Notification histories can be resent in the UI or through the API (permission *Events & Notifications Resend Access*).

## Match the customer and the plan

Your body decides what you get: include the Zuora account number (to use as the NetLicensing licensee `number`), the subscription number, and the product or rate plan identifier, which you map to your `licenseTemplateNumber` with a lookup table. Build the license `number` from the subscription number and the term or amendment, so a retried callout cannot create a second license; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids). Use Zuora's callout template preview with a real object to see the exact body before you activate the template.

## Example: the calls

```text
Zuora                       Your receiver                 NetLicensing
|                           |                             |
| callout: Renewal -------->|                             |
|                           | verify signature            |
|                           | POST /licensee ------------>|
|                           |  number=account no.         |
|                           | POST /license ------------->|
|                           |  number=sub-term            |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Zuora calls your receiver

```http
POST /webhooks/zuora HTTP/1.1
Content-Type: application/json
X-Zuora-Signature: <HMAC, as configured in the callout template>

{
  "accountNumber": "{% raw %}{{DataSource.Account.AccountNumber}}{% endraw %}",
  "subscriptionNumber": "<subscription number merge field>",
  "ratePlan": "<product or rate plan merge field>"
}
```

### 2. Your receiver checks the request

```python
import hashlib, hmac

# Callout template: HMAC on, algorithm SHA-256, output HEX,
# Data {% raw %}{{Request.Body}}{% endraw %}, Header Key X-Zuora-Signature, Header Value {% raw %}{{Request.HMAC.Signed}}{% endraw %}
def verify_zuora(raw_body: bytes, signature_header: str, shared_secret: str) -> bool:
    expected = hmac.new(shared_secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected.lower(), signature_header.lower())
```

You design both the body (with merge fields) and the HMAC settings in the callout template; the header name `X-Zuora-Signature` is your choice, not a Zuora default. Check the exact body with the template preview, and test that your code produces the same value for a real callout.

### 3. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# New subscription: the Zuora account number becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=A00000123&name=Jane%20Doe" \
  $NLIC/licensee

# New subscription or renewal amendment: one license per term
curl --user $AUTH --header "Accept: application/json" \
  --data "number=A-S00000456-T2&licenseeNumber=A00000123&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Cancellation amendment
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/A-S00000456-T2
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Zuora: Events and Notifications overview](https://docs.zuora.com/en/zuora-platform/extensibility/events-and-notifications/events-and-notifications-overview){:target="_blank"}{:rel="noopener nofollow"}
- [Zuora: callout template overview](https://docs.zuora.com/en/zuora-platform/extensibility/events-and-notifications/callout-templates/callout-template-overview){:target="_blank"}{:rel="noopener nofollow"}
- [Zuora: create a callout template](https://docs.zuora.com/en/zuora-platform/extensibility/events-and-notifications/callout-templates/create-a-callout-template){:target="_blank"}{:rel="noopener nofollow"}
- [Zuora: configure callout settings](https://docs.zuora.com/en/zuora-platform/extensibility/events-and-notifications/configure-callout-settings){:target="_blank"}{:rel="noopener nofollow"}
- [Zuora: merge field syntax](https://docs.zuora.com/en/zuora-platform/extensibility/events-and-notifications/merge-fields-for-email-and-callout-templates/merge-field-syntax){:target="_blank"}{:rel="noopener nofollow"}
- [Zuora: standard events for Zuora Billing](https://docs.zuora.com/en/zuora-platform/extensibility/events-and-notifications/standard-events/standard-events-for-zuora-billing){:target="_blank"}{:rel="noopener nofollow"}
- [Zuora: standard events for Zuora Payments](https://docs.zuora.com/en/zuora-platform/extensibility/events-and-notifications/standard-events/standard-events-for-zuora-payments){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Zuora connector. The Zuora details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Billing and Commerce Platforms](billing-platforms).
