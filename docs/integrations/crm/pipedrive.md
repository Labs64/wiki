---
layout: default
title: "Pipedrive Licensing Integration"
nav_title: "Pipedrive"
parent: CRM and Sales
grand_parent: Integrations
nav_order: 20
description: "Connect Pipedrive to NetLicensing: when a deal reaches your sale stage, a webhook creates the customer and the license. Basic auth, retries, ID matching."
permalink: pipedrive
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: Pipedrive sends a webhook when a deal changes. When the deal reaches the stage you treat as a sale, your receiver creates the NetLicensing licensee and license, and deactivates the license if the deal is reopened or deleted.

Use [Pipedrive](https://www.pipedrive.com){:target="_blank"}{:rel="noopener nofollow"} as the sales front end: when a deal reaches the stage you treat as a sale, a webhook tells your receiver to create the customer and license in NetLicensing. This guide covers the direction **Pipedrive to NetLicensing**. For NetLicensing's own CRM extension, see [Zoho CRM](zoho-crm).

## What Pipedrive sends

Pipedrive webhooks v2 send an HTTP `POST` with a JSON body for create, change and delete events on objects such as `deal`, `person`, `organization`, `lead`, `product` and `deal_product`. You create a webhook in the Pipedrive web app under *Settings > Tools and apps > Webhooks*, or through the API, by choosing an event action (`create`, `change`, `delete` or `*`) and an object. The body has a `meta` block (`action`, `entity`, `entity_id`, `id` of the event, `timestamp`, `attempt`, `company_id`, `webhook_id` and more), the current object in `data` and the changed fields in `previous`.

## Map Pipedrive events to NetLicensing

| Pipedrive event | What to do in NetLicensing |
|----------------|---------------------|
| `create` on `person` or `organization` | Create a licensee from the contact's name |
| `change` on `deal` (compare `data` with `previous`) | When the deal reaches the stage you treat as a sale: create a licensee and create a license from the plan's template |
| `change` on `deal` back from the sale stage, or `delete` | Deactivate the license (`active=false`) |
| `create` on `deal_product` | A product was added to a deal: map it to a license template and add the license when the deal is won |

For `delete`, `data` is empty (`null`) and `previous` holds the last state; for `create`, `previous` is `null`. The exact deal fields that mark a sale depend on your pipeline; inspect a real payload.

## Check that the request comes from Pipedrive

Pipedrive does not sign webhooks. You can protect the endpoint with **HTTP Basic authentication**: when you create the webhook you can set `http_auth_user` and `http_auth_password` for the subscription URL. The URL must be public, must not redirect, and cannot be a Pipedrive API endpoint.

## Retries and duplicates

Any `2xx` status is a success; anything else, or a timeout of 10 seconds, is a failure. After a failed first attempt Pipedrive retries 3 times: after 3, 30 and 150 seconds. The `attempt` field in `meta` tells you which attempt this is. When a webhook fails repeatedly, a ban counter increases; at 10 it is **banned for 30 minutes**. If there is no successful delivery on 3 consecutive days, Pipedrive **deletes the webhook**. A user can have at most 40 webhooks. Deduplicate on the event `id` in `meta`.

## Match the customer and the plan

The webhook carries the object's id and its current fields; contacts and linked objects appear as ids, so read the person or organization (email, name) from the Pipedrive API when you need it. Store the Pipedrive deal id and person id on the NetLicensing licensee as custom properties, and map the deal's products to your `licenseTemplateNumber` with a lookup table.

Whatever ids you pick, use them as the NetLicensing numbers so later events can address the licensee and license directly and retries cannot create duplicates; see [Use the platform's IDs as NetLicensing numbers](billing-platforms#platform-ids).

## Example: the calls

```text
Pipedrive                   Your receiver                 NetLicensing
|                           |                             |
| deal change (won) ------->|                             |
|                           | check Basic auth            |
|                           | POST /licensee ------------>|
|                           |  number=person id           |
|                           | POST /license ------------->|
|                           |  number=deal id             |
|< 2xx ---------------------|                             |
|                           |                             |
```

The values below are illustrative; field names follow the vendor documentation listed under *Sources*. Form-encoded bodies are shown decoded for readability. Code samples are Python, using only the standard library unless noted.

### 1. Pipedrive calls your receiver

```http
POST /webhooks/pipedrive HTTP/1.1
Content-Type: application/json
Authorization: Basic <base64 of http_auth_user:http_auth_password>

{
  "meta": { "action": "change", "entity": "deal", "entity_id": "123", "id": "<event id>", "attempt": 1, "webhook_id": "<id>" },
  "data": { "id": 123, "status": "won", "person_id": 456 },
  "previous": { "status": "open" }
}
```

### 2. Your receiver checks the request

```python
import base64, hmac

def basic_auth_ok(authorization_header: str, user: str, password: str) -> bool:
    expected = "Basic " + base64.b64encode(f"{user}:{password}".encode()).decode()
    return hmac.compare_digest(authorization_header or "", expected)
```

Pipedrive does not sign webhooks; Basic auth on the URL is the check. Which fields mark a sale depends on your pipeline; inspect a real payload. Contacts arrive as ids: read the person through the Pipedrive API for the name and email.

### 3. Your receiver calls Pipedrive

```bash
# Create the webhook once, with Basic auth for your receiver
curl --request POST "https://companydomain.pipedrive.com/api/v1/webhooks" \
  --header "x-api-token: $PIPEDRIVE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "subscription_url": "https://licensing.example.com/webhooks/pipedrive",
    "event_action": "change",
    "event_object": "deal",
    "http_auth_user": "pipedrive",
    "http_auth_password": "<long random value>"
  }'
```

### 4. Your receiver calls NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"    # API key with ROLE_APIKEY_OPERATION

# Deal won: the Pipedrive person id becomes the licensee number
curl --user $AUTH --header "Accept: application/json" \
  --data "productNumber=PQVJQ5F7H&number=pd-person-456&name=Jane%20Doe" \
  $NLIC/licensee

# Deal won: one license per deal (or per deal product)
curl --user $AUTH --header "Accept: application/json" \
  --data "number=pd-deal-123&licenseeNumber=pd-person-456&licenseTemplateNumber=EUJK1BXQ52" \
  $NLIC/license

# Deal reopened or deleted
curl --user $AUTH --header "Accept: application/json" \
  --data "active=false" \
  $NLIC/license/pd-deal-123
```

`PQVJQ5F7H` and `EUJK1BXQ52` stand for your product and license template numbers. A create with a number that already exists returns HTTP `400` with `DuplicateEntityException`. That makes both calls safe to repeat: send the licensee create with every paid event and continue when it reports a duplicate, and treat a duplicate license as "already done" and answer the platform with `2xx` (see [IDs as numbers](billing-platforms#platform-ids)).

## Sources

- [Pipedrive: webhooks v2 guide](https://pipedrive.readme.io/docs/guide-for-webhooks-v2){:target="_blank"}{:rel="noopener nofollow"}
- [Pipedrive: Webhooks API reference](https://developers.pipedrive.com/docs/api/v1/Webhooks){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Pipedrive connector. The Pipedrive details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [CRM and Sales](crm-and-sales).
