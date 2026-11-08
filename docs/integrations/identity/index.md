---
layout: default
title: Identity Providers
parent: Integrations
nav_order: 6
has_children: true
has_toc: false
description: "Put NetLicensing entitlements into sign-in tokens: Okta token inline hooks and Microsoft Entra ID custom claims providers validate the user and add claims."
permalink: identity-providers
last_modified_at: 2026-11-08
---

{{ page.title }}
================

An identity provider can call your service while it builds a token. Your service asks NetLicensing whether the user's customer has a valid license and returns the answer as a claim, so the application receives the entitlement together with the identity.

```
User signs in  -->  Identity provider  --hook-->  Your service  --validate-->  NetLicensing
                    (token being built)           (adds claims)                 (licensee, licenses)
```

| Identity provider | Hook | Guide |
|-------------------|------|-------|
| Okta | Token inline hook (`com.okta.oauth2.tokens.transform`) | [Okta](okta) |
| Microsoft Entra ID | Custom claims provider, event `OnTokenIssuanceStart` | [Microsoft Entra ID](entra-id) |

An older Labs64 sample, [NetLicensing-Auth0](https://github.com/Labs64/NetLicensing-Auth0){:target="_blank"}{:rel="noopener"}, is built on Auth0 *Rules*. [Auth0 states](https://auth0.com/docs/customize/rules){:target="_blank"}{:rel="noopener nofollow"} that Rules are read-only since November 18, 2024 and reach end of life on January 31, 2028, so do not start new work with it.

## What your service does

1. Receive the hook call and read the user's identifier (for example the email).
2. Call [validate licensee](licensee-services#validate-licensee) with an [API key](security#api-key-identification) that has the role `ROLE_APIKEY_LICENSEE`. The licensee `number` can be the identifier itself, or the identifier can be an [alias](aliases).
3. Return a small, explicit claim, such as the validation result.

## Plan for the limits

The identity providers set their own limits for the call. Okta's token inline hook has a default timeout of 3 seconds and no retries, and if your service is too slow Okta continues with the original token. Entra ID restricts the returned claims to strings and string arrays with a total size of 3 KB. Read the limits on each guide, keep the service fast, and [cache validation results](faq-validation-frequency) instead of validating on every token.
