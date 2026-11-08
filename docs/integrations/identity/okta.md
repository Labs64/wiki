---
layout: default
title: "Okta Integration: License Claims in Tokens"
nav_title: "Okta"
parent: Identity Providers
grand_parent: Integrations
nav_order: 10
description: "Add NetLicensing entitlements to Okta tokens: a token inline hook calls your service, which validates the user's licenses and returns a claim."
permalink: okta
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: an Okta token inline hook calls your service while Okta builds a token. Your service validates the user in NetLicensing and returns the result as a claim, so your application sees the user's entitlements right after sign-in.

This guide uses the Okta **token inline hook**, which works only with an Okta **custom authorization server**.

## What Okta sends and expects

The hook type is `com.okta.oauth2.tokens.transform`. Okta sends an HTTPS `POST` with a JSON payload: `eventId`, `eventTime`, `eventType` and `data` (with `context`, `identity`, `access` and `refresh_token`). Your service answers with a `commands` array of `type` and `value` pairs, where `value` is an object with an operation, a path and a value, for example to add a custom claim to the token. You register the hook in the Admin Console under *Workflow > Inline Hooks*, or with `POST /api/v1/inlineHooks`. An organization can have up to 100 inline hooks, and the response must stay below 256 KB.

## What your service does

| Okta call | What your service does |
|----------------|---------------------|
| Okta calls the hook while issuing a token | Your service reads the user's identifier from `data.identity`, calls [validate licensee](licensee-services#validate-licensee) (`POST /licensee/{licenseeNumber}/validate`), and returns claims such as the validation result |

## Secure the call

Protect the call with the authentication you choose when you register the hook: a custom `Authorization` header with a key, or OAuth 2.0 (`client_secret_post` or `private_key_jwt`). On the NetLicensing side use an [API key](security#api-key-identification) with the role `ROLE_APIKEY_LICENSEE`, the lowest role that may validate (the Labs64 [Auth0 sample](https://github.com/Labs64/NetLicensing-Auth0){:target="_blank"}{:rel="noopener"} recommends the same).

## Timeouts and failures

**Time and failure behavior are strict.** Okta enforces a default timeout of **3 seconds**; the token inline hook does **not** support retries. If your service times out, the flow proceeds with the original token, without your claims. If your service returns an error object, the entire token flow fails and no token is generated. Keep the hook fast: [cache the validation result](faq-validation-frequency) in your service instead of calling NetLicensing on every token.

## Choose the licensee number and the claims

Use the user's email (as the Labs64 Auth0 sample does) or another stable identifier as the NetLicensing licensee `number`, or add it as an [alias](aliases) so you can validate by it. Return small, explicit claims, for example whether the customer is licensed and until when. Keep the entitlement logic in your product: a token claim is a snapshot at sign-in time.

## Example: the calls

```text
User        Okta                       Your service                 NetLicensing
|           |                          |                            |
|- sign in->|                          |                            |
|           |-- token inline hook ---->|                            |
|           |                          |-- POST .../validate ------>|
|           |                          |<-- valid, expires ---------|
|           |<-- commands (claim) -----|   (within 3 seconds)       |
|<- token --|                          |                            |
```

### 1. Okta calls your service

```http
POST /hooks/okta-token HTTP/1.1
Content-Type: application/json
Authorization: <the key you configured for the hook>

{
  "eventType": "com.okta.oauth2.tokens.transform",
  "data": {
    "identity": { "claims": { "preferred_username": "jane@example.com" } }
  }
}
```

Okta's own example reads the user from `data.identity.claims["preferred_username"]`.

### 2. Your service validates the user in NetLicensing

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
curl --user "apiKey:$NETLICENSING_LICENSEE_KEY" --header "Accept: application/json" --request POST \
  $NLIC/licensee/jane%40example.com/validate
```

Use an API key with `ROLE_APIKEY_LICENSEE` here: it can validate but cannot create or change anything (a create returned `403 Forbidden` in our test). The response lists each product module with `valid` and, for time-based models, `expires`.

### 3. Your service answers Okta

```json
{
  "commands": [
    {
      "type": "com.okta.identity.patch",
      "value": [ { "op": "add", "path": "/claims/licensed", "value": "true" } ]
    }
  ]
}
```

The command format follows Okta's token inline hook guide, which adds a claim to the ID token this way. Answer within the 3-second timeout.

## Sources

- [Okta: inline hooks](https://developer.okta.com/docs/concepts/inline-hooks/){:target="_blank"}{:rel="noopener nofollow"}
- [Okta: create a token inline hook (API)](https://developer.okta.com/docs/api/openapi/okta-management/management/tags/inlinehook/webhooks/createtokeninlinehook){:target="_blank"}{:rel="noopener nofollow"}

---

You run this integration yourself; NetLicensing does not host an Okta connector. The Okta details on this page are based on the sources above. Okta changes its APIs, so verify the details against the linked pages before you go live. Back to [Identity Providers](identity-providers).
