---
layout: default
title: "Zapier Integration"
nav_title: Zapier
parent: Automation and Alerts
grand_parent: Integrations
nav_order: 10
description: "Connect NetLicensing to other apps with Zapier: the NetLicensing app for customers and products, plus Webhooks by Zapier for licenses and events."
permalink: zapier
last_modified_at: 2026-11-08
---

{{ page.title }}
================

[Zapier](https://zapier.com/apps/netlicensing/integrations){:target="_blank"}{:rel="noopener"} connects NetLicensing to other apps. There are two parts: the **NetLicensing app** in Zapier, and the generic **Webhooks by Zapier** app for everything the NetLicensing app does not cover.

## The NetLicensing app

The app on Zapier's [NetLicensing page](https://zapier.com/apps/netlicensing/integrations){:target="_blank"}{:rel="noopener"} offers:

| Type | Name | What it does |
|------|------|--------------|
| Trigger | **New Licensee** | Starts a Zap when a licensee (customer) is created |
| Trigger | **New Product** | Starts a Zap when a product is created |
| Action | **Create Licensee** | Creates a licensee. Fields: `ProductNumber` (required), `Name`, `Number`, `Active`, `Email`, `Address1`, `Zip`, `Country`, `CompanyName`, `FullName` |
| Action | **Create Product** | Creates a product. Fields: `Name` (required), `Number`, `Active`, `Version`, `LicenseeAutoCreate`, `Description`, `LicensingInfo` |
| Search | **Find Licensee**, **Find Product** | Finds one by its number |
| Search or create | **Search or Create Licensee**, **Search or Create Product** | Creates it if it does not exist |

Zapier lists both triggers as *polling*: Zapier checks for new data every 15 minutes on its Free plan.

**Not in the app:** actions for licenses (create, extend or deactivate) and a trigger for new licenses. Use *Webhooks by Zapier* for those, as shown below.

### Connect the app

1. In the Management Console, open *Settings / API Access* and create an [API key](security#api-key-identification). Use `ROLE_APIKEY_OPERATION` if you need to manage customers and licenses, and `ROLE_APIKEY_MAINTENANCE` if you also need to manage products.
2. In Zapier, add NetLicensing to a Zap and connect the account with the API key.

The app's source code is on [GitHub](https://github.com/Labs64/NetLicensing-Zapier){:target="_blank"}{:rel="noopener"}.

## React to NetLicensing events: Catch Hook

Zapier's *Webhooks by Zapier* app has the trigger **Catch Hook**. It gives the Zap a unique URL (of the form `https://hooks.zapier.com/hooks/catch/...`) that accepts `GET`, `PUT` or `POST` requests and parses the request body.

1. In a new Zap, choose *Webhooks by Zapier* and the event *Catch Hook*. Copy the URL.
2. In the Management Console, open *Settings / Notifications* and [create a notification](notifications#creating-a-new-notification) of type `WEBHOOK` with that URL as the endpoint, and select the events you need.
3. Add the steps you want after the trigger. The event name is in the payload at `entities.Event[0].name`: `LICENSEE_CREATED`, `LICENSE_CREATED`, `PAYMENT_TRANSACTION_PROCESSED` or `WARNING_LEVEL_CHANGED`. See [Notifications](notifications#payload-structure) for the payload of each event.

This covers the missing "new license" trigger: select the `LICENSE_CREATED` event.

## Act in NetLicensing: Custom Request

Zapier's *Webhooks by Zapier* app also has the action **Custom Request**, with the fields *Method*, *URL*, *Data*, *Basic Auth* and *Headers*. Use it to call any [REST API](restful-api) endpoint, for example to issue a license after a payment in another app.

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `https://go.netlicensing.io/core/v2/rest/license` |
| Data | `licenseeNumber=CUST-1001&licenseTemplateNumber=EUJK1BXQ52` |
| Headers | `Content-Type: application/x-www-form-urlencoded`, `Accept: application/json`, and `Authorization: Basic <base64 of apiKey:YOUR_API_KEY>` |

The [License Services](license-services#create-license) page lists all parameters. To deactivate a license, `POST` `active=false` to `/license/{licenseNumber}`. Test every step with Zapier's step tester before you turn the Zap on.

## Example: tell your team about a new customer

1. Trigger: *Webhooks by Zapier*, *Catch Hook*, with a NetLicensing notification on `LICENSEE_CREATED`.
2. Action: any Zapier app, such as email or chat, using the customer `name` and `number` from the payload.

## Example: create a license when a payment succeeds elsewhere

1. Trigger: the payment app of your choice.
2. Action: *Create Licensee* from the NetLicensing app.
3. Action: *Webhooks by Zapier*, *Custom Request*, to create the license as shown above, with the licensee number from step 2.

For platforms with their own webhooks and signature checks, see the [billing platform guides](billing-platforms).

## Example: the calls

```text
NetLicensing             Automation tool                Other apps / NetLicensing
|                        |                              |
| notification (POST) -->| trigger: webhook             |
|                        | steps: filter, map           |
|                        | action: HTTP request ------->| e.g. POST /license
|                        |                              |
```

### 1. Test your Catch Hook URL

Send a NetLicensing-shaped event to the hook before you create the notification, so the Zap editor can show you the fields:

```bash
curl --request POST "https://hooks.zapier.com/hooks/catch/<account>/<hook>/" \
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

The body is the `LICENSE_CREATED` notification from the [Notifications](notifications#payload-structure) page.

### 2. The call behind *Custom Request*

The Custom Request settings above send exactly this request. Run it with curl first to check the API key and numbers:

```bash
curl --user "apiKey:$NETLICENSING_API_KEY" --header "Accept: application/json" \
  --data "licenseeNumber=CUST-1001&licenseTemplateNumber=EUJK1BXQ52" \
  https://go.netlicensing.io/core/v2/rest/license
```

`--user` sends the same `Authorization: Basic <base64 of apiKey:YOUR_API_KEY>` header that you enter in Zapier.

## Sources

- [Zapier: NetLicensing integrations](https://zapier.com/apps/netlicensing/integrations){:target="_blank"}{:rel="noopener"}
- [Zapier: Webhooks by Zapier](https://zapier.com/apps/webhook/integrations){:target="_blank"}{:rel="noopener nofollow"}
- [Zapier: Trigger Zap workflows from webhooks](https://help.zapier.com/hc/en-us/articles/8496288690317-Trigger-Zaps-from-webhooks){:target="_blank"}{:rel="noopener nofollow"}
- [NetLicensing-Zapier on GitHub](https://github.com/Labs64/NetLicensing-Zapier){:target="_blank"}{:rel="noopener"}
