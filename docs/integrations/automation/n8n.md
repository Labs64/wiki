---
layout: default
title: "n8n Integration"
nav_title: n8n
parent: Automation and Alerts
grand_parent: Integrations
nav_order: 20
description: "Use n8n with NetLicensing: a Webhook node receives NetLicensing notifications, the HTTP Request node creates customers and licenses via the REST API."
permalink: n8n
last_modified_at: 2026-11-08
---

{{ page.title }}
================

[n8n](https://n8n.io){:target="_blank"}{:rel="noopener nofollow"} is a workflow automation tool that you can use as a service or self-host. NetLicensing does not provide a dedicated n8n node. The generic **Webhook** and **HTTP Request** nodes cover both directions.

## React to NetLicensing events: Webhook node

The *Webhook* node starts a workflow when a request arrives. It supports the methods `DELETE`, `GET`, `HEAD`, `PATCH`, `POST` and `PUT`.

1. Add a *Webhook* node with the method `POST`. n8n shows a *Test URL* and a *Production URL*: the production webhook is registered when you publish the workflow.
2. In the Management Console, open *Settings / Notifications* and [create a notification](notifications#creating-a-new-notification) of type `WEBHOOK`. Use the *Production URL* as the endpoint, and select the events you need. NetLicensing requires an HTTPS endpoint with a public certificate, so your n8n instance must be reachable that way.
3. Continue the workflow after the *Webhook* node. The event name is in the payload at `entities.Event[0].name`: `LICENSEE_CREATED`, `LICENSE_CREATED`, `PAYMENT_TRANSACTION_PROCESSED` or `WARNING_LEVEL_CHANGED`. See [Notifications](notifications#payload-structure) for each payload.

Notes on the *Webhook* node:

- **Respond quickly.** The option *Respond: Immediately* returns the response code and the message "Workflow got started" at once; *When Last Node Finishes* returns the data of the last node. Use the first so NetLicensing gets its answer without waiting for the workflow.
- **Protect the URL.** By default the node uses a randomly generated path. The node supports Basic auth, Header auth, JWT auth and n8n User Auth, but the notification settings in NetLicensing have no field for authentication headers (a notification has a name, number, events, type, endpoint and payload). Keep the random path secret, and check the event data in the workflow before you act on it.
- **Size.** The maximum payload is 16 MB, far above a notification.

## Act in NetLicensing: HTTP Request node

The *HTTP Request* node calls any [REST API](restful-api) endpoint. Create a credential of the type *Basic Auth* with the user name `apiKey` and your [API key](security#api-key-identification) as the password (n8n lists Basic auth and Header auth among its generic credential types).

Create a license:

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `https://go.netlicensing.io/core/v2/rest/license` |
| Authentication | *Generic credential type*, *Basic Auth* |
| Send Body | On, content type *Form URLencoded* |
| Body parameters | `licenseeNumber`, `licenseTemplateNumber` |
| Header | `Accept: application/json` |

The same node creates a customer ([`POST /licensee`](licensee-services#create-licensee) with `productNumber`) and deactivates a license (`POST /license/{licenseNumber}` with `active=false`, see [License Services](license-services#update-license)). The API expects form-encoded bodies, which is why *Form URLencoded* is the content type to choose.

## Example: tell your team when a warning level changes

1. *Webhook* node, with a NetLicensing notification on `WARNING_LEVEL_CHANGED`.
2. Any n8n node that sends a message, such as *Send Email*, using the customer `name` and `number` from the payload.

## Example: create a license when a payment succeeds elsewhere

1. A trigger node for the payment platform.
2. *HTTP Request*: create the licensee.
3. *HTTP Request*: create the license for that licensee.

Platforms differ in how they sign their webhooks. Check the platform's method in the [billing platform guides](billing-platforms) before you rely on an unsigned receiver.

## Example: the calls

```text
NetLicensing             Automation tool                Other apps / NetLicensing
|                        |                              |
| notification (POST) -->| trigger: webhook             |
|                        | steps: filter, map           |
|                        | action: HTTP request ------->| e.g. POST /license
|                        |                              |
```

### 1. Test the Webhook node

```bash
curl --request POST "https://n8n.example.com/webhook/<path>" \
  --header "Content-Type: application/json" \
  --data '{
    "timestamp": "2024-09-19T04:30:26.006Z",
    "origin": "Notification",
    "entities": {
      "Event": [ { "name": "LICENSE_CREATED" } ],
      "License": [ { "number": "LN2TD47QY", "active": true, "licensee": "IKWUYQ9GR", "licenseTemplate": "E27NV3IQD" } ]
    }
  }'
```

Use the *Test URL* that n8n shows while you build the workflow, and the *Production URL* (`/webhook/<path>`) in the NetLicensing notification.

### 2. The call behind the HTTP Request node

The node settings above send this request; with the event from step 1, `licenseeNumber` comes from `{% raw %}{{ $json.body.entities.License[0].licensee }}{% endraw %}` or from your own data:

```bash
curl --user "apiKey:$NETLICENSING_API_KEY" --header "Accept: application/json" \
  --data "licenseeNumber=IKWUYQ9GR&licenseTemplateNumber=EUJK1BXQ52" \
  https://go.netlicensing.io/core/v2/rest/license
```

## Sources

- [n8n: Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/){:target="_blank"}{:rel="noopener nofollow"}
- [n8n: HTTP Request node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/){:target="_blank"}{:rel="noopener nofollow"}
