---
layout: default
title: "Azure Logic Apps Integration"
nav_title: "Azure Logic Apps"
parent: Automation and Alerts
grand_parent: Integrations
nav_order: 30
description: "Use Azure Logic Apps with NetLicensing: a Request trigger receives NetLicensing notifications, an HTTP action creates customers and licenses."
permalink: azure-logic-apps
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: a Logic Apps workflow can receive NetLicensing notifications through its Request trigger and call the NetLicensing REST API through an HTTP action, so you connect licensing events to any of the Logic Apps connectors without hosting code.

[Azure Logic Apps](https://learn.microsoft.com/en-us/azure/logic-apps/){:target="_blank"}{:rel="noopener nofollow"} (Consumption and Standard) connects to many systems through connectors. NetLicensing works with it through the generic **Request** trigger and **HTTP** action. This guide covers Logic Apps; Microsoft Power Automate documentation was not part of our check.

## What Logic Apps sends

**Request trigger.** It "creates a manually callable endpoint that handles only inbound requests over HTTPS". The endpoint URL is generated when you save the workflow and contains a Shared Access Signature (SAS) key in its query parameters, which is used for authentication. By default the trigger expects a `POST`; you can set one method. You can add a JSON schema for the request body; *Schema Validation* is off by default and, when on, a body that does not match gets `400 Bad Request`. If the workflow has no *Response* action, the endpoint answers immediately with `202 Accepted`.

## Map Logic Apps events to NetLicensing

| Logic Apps event | What to do in NetLicensing |
|----------------|---------------------|
| NetLicensing notification (any of the four events) arrives at the Request trigger | Create a [notification](notifications#creating-a-new-notification) of type `WEBHOOK` with the Logic Apps endpoint URL as its endpoint; the workflow then runs any connector actions, for example to inform a team or update another system |
| A workflow step needs to change licenses | Add an **HTTP** action that calls the [REST API](restful-api): `POST https://go.netlicensing.io/core/v2/rest/licensee` or `/license` (see [License Services](license-services#create-license)) |

## Check that the request comes from Logic Apps

The Request trigger URL carries the SAS key (`sig=...`): keep it secret, because anyone with the URL can start the workflow. The notification settings in NetLicensing have no field for authentication headers, so the SAS URL is the credential. For the outbound call, the HTTP action supports these authentication types: Basic, client certificate, Active Directory OAuth, raw and managed identity. Use **Basic** with the user name `apiKey` and your [API key](security#api-key-identification) as the password, over HTTPS (Microsoft notes that Basic authentication sends credentials without encryption of their own).

## Retries and duplicates

By default the Request trigger answers `202 Accepted` at once, which is what NetLicensing needs to see. To send form-encoded data in an HTTP action body, specify the `application/x-www-form-urlencoded` content type with a `content-type` header; the NetLicensing API expects form-encoded bodies. Add `Accept: application/json` to get JSON back.

## Match the customer and the plan

The event name is in the payload at `entities.Event[0].name` (`LICENSEE_CREATED`, `LICENSE_CREATED`, `PAYMENT_TRANSACTION_PROCESSED`, `WARNING_LEVEL_CHANGED`); see [Notifications](notifications#payload-structure). Define a request body schema in the trigger to get these fields as named values in later steps. A Logic Apps workflow can also be the receiver for a billing platform: use the [billing platform guides](billing-platforms) and check each platform's signature method, because the Request trigger does not verify third-party signatures for you.

## Example: the calls

```text
NetLicensing             Logic Apps workflow              NetLicensing / other apps
|                        |                                |
|-- notification ------->| Request trigger (SAS URL)      |
|                        | ... connector steps ...        |
|                        | HTTP action (Basic, apiKey) -->| POST /license/{n} active=false
```

### 1. NetLicensing calls the Request trigger

```http
POST https://<region>.logic.azure.com/workflows/<id>/triggers/manual/paths/invoke?api-version=...&sp=...&sv=...&sig=<SAS key> HTTP/1.1
Content-Type: application/json

{
  "timestamp": "2024-09-19T04:30:26.006Z",
  "origin": "Notification",
  "entities": {
    "Event": [ { "name": "LICENSE_CREATED" } ],
    "License": [ { "number": "LN2TD47QY", "active": true, "licensee": "IKWUYQ9GR", "licenseTemplate": "E27NV3IQD" } ]
  }
}
```

The body is a NetLicensing [notification](notifications#payload-structure); the trigger answers `202 Accepted`.

### 2. An HTTP action calls NetLicensing

In the workflow definition (code view), an HTTP action that deactivates a license looks like this:

```json
"Deactivate_license": {
  "type": "Http",
  "inputs": {
    "method": "POST",
    "uri": "https://go.netlicensing.io/core/v2/rest/license/@{first(triggerBody()?['entities']?['License'])?['number']}",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    "body": "active=false",
    "authentication": {
      "type": "Basic",
      "username": "apiKey",
      "password": "@parameters('netlicensingApiKey')"
    }
  },
  "runAfter": {}
}
```

The `authentication` block follows Microsoft's Basic authentication example for HTTP actions; keep the API key in a `securestring` parameter. Microsoft requires the `Content-Type` header for form-encoded bodies. `first()` is the workflow language function that returns the first item of the `License` array.

## Sources

- [Microsoft: Request trigger and Response action](https://learn.microsoft.com/en-us/azure/connectors/connectors-native-reqres){:target="_blank"}{:rel="noopener nofollow"}
- [Microsoft: HTTP endpoints for workflows](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-http-endpoint){:target="_blank"}{:rel="noopener nofollow"}
- [Microsoft: call service endpoints over HTTP or HTTPS](https://learn.microsoft.com/en-us/azure/connectors/connectors-native-http){:target="_blank"}{:rel="noopener nofollow"}
- [Microsoft: secure access and data in Azure Logic Apps](https://learn.microsoft.com/en-us/azure/logic-apps/set-up-security-permissions){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host a Logic Apps connector. The Logic Apps details on this page are based on the sources above, and the NetLicensing calls it relies on were tested against the live API. Vendors change their APIs, so verify the details against the linked pages before you go live. Back to [Automation and Alerts](automation-platforms).
