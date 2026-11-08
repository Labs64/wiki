---
layout: default
title: "Microsoft Entra ID Integration: License Claims in Tokens"
nav_title: "Microsoft Entra ID"
parent: Identity Providers
grand_parent: Integrations
nav_order: 20
description: "Add NetLicensing entitlements to Microsoft Entra ID tokens: a custom claims provider calls your API, which validates the user and returns claims."
permalink: entra-id
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: a Microsoft Entra ID custom claims provider calls your API when a token is about to be issued. Your API validates the user in NetLicensing and returns the result as a claim, which a claims mapping policy adds to the token.

A **custom claims provider** is made of a **custom authentication extension** that calls your API to fetch claims from external systems.

## What Entra ID sends and expects

The event is `OnTokenIssuanceStart`, triggered when a token is about to be issued. Entra ID makes an HTTP call to your REST API with a JSON payload of the type `microsoft.graph.authenticationEvent.tokenIssuanceStart`, containing `data` and `authenticationContext` (user and service principal details). Your API must be **publicly accessible**. It answers with HTTP `200` and a body with `data.actions[]`, where the action `microsoft.graph.tokenIssuanceStart.provideClaimsForToken` has a `claims` object.

## What your API does

| Entra ID event | What your API does |
|----------------|---------------------|
| `OnTokenIssuanceStart` | Your API reads the user from `authenticationContext`, calls [validate licensee](licensee-services#validate-licensee) (`POST /licensee/{licenseeNumber}/validate`), and returns claims with the validation result |

## Secure the call

Entra ID sends an HTTP `Authorization` header with a bearer token issued by Entra ID. Validate it: the token contains an `appid` claim (for V1 applications) or an `azp` claim (for V2 applications) that must have the value `99045fe1-7639-4a75-9d4a-577b6ca3810f`, which shows that Entra ID is the caller; also validate the audience and issuer. On the NetLicensing side use an [API key](security#api-key-identification) with the role `ROLE_APIKEY_LICENSEE`.

## Limits

Limits stated by Microsoft: the claims you return can be **strings or string arrays only** (Boolean and JSON are not supported), and the total size of all keys and values is limited to **3 KB**. Returned attributes are **not added to the token automatically**: you must configure a **claims mapping policy** for the application. The pages we read give no time limit or retry behavior for the call, so keep the API fast and [cache validation results](faq-validation-frequency).

## Choose the licensee number and the claims

Use the user's email or another stable identifier from `authenticationContext` as the NetLicensing licensee `number`, or as an [alias](aliases). Return explicit, small claims, for example a string such as `licensed` or `unlicensed`. Entra ID offers this event for workforce tenants and external tenants.

## Example: the calls

```text
User        Entra ID                   Your API                     NetLicensing
|           |                          |                            |
|- sign in->|                          |                            |
|           |-- OnTokenIssuanceStart ->|                            |
|           |                          |-- POST .../validate ------>|
|           |                          |<-- valid, expires ---------|
|           |<-- provideClaimsForToken |                            |
|<- token --|   (claims mapping policy)|                            |
```

### 1. Entra ID calls your API

```http
POST /hooks/entra-claims HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token issued by Microsoft Entra ID>

{
  "type": "microsoft.graph.authenticationEvent.tokenIssuanceStart",
  "data": {
    "authenticationContext": {
      "user": { "id": "90847c2a-e29d-4d2f-9f54-c5b4d3f26471", "mail": "casey@contoso.com", "userPrincipalName": "casey@contoso.com" }
    }
  }
}
```

The user fields come from Microsoft's custom claims provider reference.

### 2. Your API validates the user in NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
curl --user "apiKey:$NETLICENSING_LICENSEE_KEY" --header "Accept: application/json" --request POST \
  $NLIC/licensee/casey%40contoso.com/validate
```

Use an API key with `ROLE_APIKEY_LICENSEE` here: it can validate but cannot create or change anything (a create returned `403 Forbidden` in our test). The response lists each product module with `valid` and, for time-based models, `expires`.

### 3. Your API answers Entra ID

```json
{
  "data": {
    "@odata.type": "microsoft.graph.onTokenIssuanceStartResponseData",
    "actions": [
      {
        "@odata.type": "microsoft.graph.tokenIssuanceStart.provideClaimsForToken",
        "claims": { "LicenseStatus": "licensed" }
      }
    ]
  }
}
```

Claims must be strings or string arrays. A claims mapping policy decides whether `LicenseStatus` appears in the token.

## Sources

- [Microsoft Entra: custom claims provider overview](https://learn.microsoft.com/en-us/entra/identity-platform/custom-claims-provider-overview){:target="_blank"}{:rel="noopener nofollow"}
- [Microsoft Entra: custom authentication extensions](https://learn.microsoft.com/en-us/entra/identity-platform/custom-extension-overview){:target="_blank"}{:rel="noopener nofollow"}
- [Microsoft Entra: custom claims provider reference](https://learn.microsoft.com/en-us/entra/identity-platform/custom-claims-provider-reference){:target="_blank"}{:rel="noopener nofollow"}
- [Microsoft Entra: token issuance start setup](https://learn.microsoft.com/en-us/entra/identity-platform/custom-extension-tokenissuancestart-setup){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host an Entra ID connector. The Microsoft details on this page are based on the sources above. Microsoft changes its APIs, so verify the details against the linked pages before you go live. Back to [Identity Providers](identity-providers).
