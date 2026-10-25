---
layout: default
title: "Software Licensing API: Architecture, Integration and Examples"
nav_title: Software Licensing API
parent: Guides
nav_order: 10
description: "How a software licensing API works: the components, the validation data flow, authentication, caching with TTL, response signing and error handling, with NetLicensing REST examples in cURL and links to SDKs."
permalink: software-licensing-api
last_modified_at: 2026-10-25
---

Software Licensing API: Architecture, Integration and Examples
==============================================================

A software licensing API keeps track of what each customer has paid for and answers one question for your
application: what may this customer use right now? Your application sends an ID for the customer or installation, the
service checks that customer's licenses against your licensing rules, and it sends back the result.

With Labs64 NetLicensing that is one HTTPS request:
`POST https://go.netlicensing.io/core/v2/rest/licensee/{licenseeNumber}/validate`. The response has one entry per
product module, telling you for example whether use is allowed, when the subscription runs out or how many credits are
left.

## When a licensing API is worth it

A hosted API pays off when your product is sold in more than one way (trial, subscription, editions, usage), or when you
expect that to change. It also helps when licenses change after delivery: renewals, upgrades, refunds, a customer moving
to a new account. And it gives you a record of who uses what and whose licenses are about to expire, without you running
a license server and database yourself.

If you sell a product once, it never changes and it has no online part, a locally checked key (a signed file, or a key
with the expiry date built in) may be all you need. Just keep in mind that such a key can't be revoked or extended
without sending the customer a new one.

## Architecture

| Component | What it does | In NetLicensing |
|-----------|--------------|-----------------|
| Configuration | Products, licensing rules, prices | [Product, product module, license template](object-model), set up in the Management Console or via API |
| Entitlement store | Which licenses each customer holds | [Licensee](object-model#licensee) and [license](object-model#license) entities |
| Licensing engine | Applies the rules to the licenses at request time | [Licensing models](licensing-models), run on every validation |
| Validation endpoint | Answers the application | [Validate licensee](licensee-services#validate-licensee) |
| Commerce | Purchase, renewal, payment | [NetLicensing Shop](netlicensing-shop), or your own shop via [integrations](integrations) |
| Events | Tells other systems about changes | [Webhook notifications](notifications) |

At runtime it works like this:

1. Your application works out the **licensee number** of the current customer, installation or account. End customers
   don't need a NetLicensing account. Any unique, stable ID will do.
2. The application calls **validate** with that number. Some licensing models need extra parameters: a device
   fingerprint for [Node-Locked](node-locked) (`nodeSecret`), a session to check out for [Floating](floating), or the
   credits used for [Pay-per-Use](pay-per-use).
3. NetLicensing goes through the licensee's active licenses, module by module, and returns the results together with a
   `ttl` (time-to-live) timestamp.
4. The application stores the result, turns features on or off, and keeps using that result until the `ttl` has passed.
5. When the customer needs a new or renewed license, the application creates a [shop token](token-services#create-token)
   and opens the `shopURL` it gets back. Once the purchase is done, the next validation shows the new license.

## Implementation

### Authenticate

Use an **API key** in your application, never your account password. The key goes into HTTP Basic authentication
with `apiKey` as the user name. For keys that ship inside client software, pick the role `ROLE_APIKEY_LICENSEE`: it
can validate, transfer licenses and create shop tokens, and nothing else. See [API Security](security#api-key-identification).

### Validate

```bash
curl --request POST \
  --header "Accept: application/json" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --user apiKey:YOUR_API_KEY \
  --data "productNumber=YOUR_PRODUCT_NUMBER" \
  https://go.netlicensing.io/core/v2/rest/licensee/CUSTOMER-123/validate
```

You only need `productNumber` if the product has *licensee auto-create* switched on and the licensee doesn't exist
yet. In that case NetLicensing creates it on this first call.

Here is a shortened JSON response:

```json
{
  "ttl": "2026-10-26T09:00:00.000Z",
  "items": {
    "item": [
      {
        "type": "ProductModuleValidation",
        "property": [
          { "name": "productModuleNumber", "value": "M001" },
          { "name": "licensingModel", "value": "Subscription" },
          { "name": "valid", "value": "true" },
          { "name": "expires", "value": "2027-01-31T00:00:00.000Z" },
          { "name": "warningLevel", "value": "GREEN" }
        ]
      }
    ]
  }
}
```

Pick out the entry for your `productModuleNumber`. Which properties it contains depends on the licensing model, and each
[licensing model page](licensing-models) lists them.

### Pass model-specific parameters

Parameters are numbered per product module, starting at 0, so a single request can carry parameters for several
modules:

```text
productModuleNumber0=M-NODE&nodeSecret0=3f9a...c21
productModuleNumber1=M-FLOAT&sessionId1=host-42&action1=checkOut
```

### Cache the result

There's no need to validate on every function call. Keep the last result and use it until its `ttl`. Your application
stays fast, the API sees less traffic, and short network outages go unnoticed. You set the TTL interval in the
Management Console settings, see [offline validation using TTL](faq-offline-validation-ttl).

### Handle errors and outages

A `4xx` response means the request was rejected. Common causes are an unknown licensee without `productNumber` (400),
wrong credentials or an API key role that doesn't allow the call, and a feature your plan doesn't include (402). The
details are in the `infos` element of the response.

If `go.netlicensing.io` can't be resolved, send the same request to the backup host `netlicensing.labs64.com`
(see [Structure of the RESTful URIs](restful-api#structure-of-the-restful-uris)). If the service can't be reached at
all, carry on with the cached result while its `ttl` is still valid. After that it's your call: a short grace period,
read-only mode, or a prompt to go online.

### Protect the result

Someone with full control over the client machine could point the API host name at a fake server. To catch that, turn
on [response signing](signing-the-response). NetLicensing then signs each validation response with your RSA private
key, and the Java and C# client libraries check the signature with the public key built into your application.

## Limitations and trade-offs

Validation needs the NetLicensing cloud at least once per TTL. Sites that are offline for longer need signed offline
validation files or the [NetLicensing Agent](netlicensing-agent), see
[Offline License Validation](offline-license-validation).

The API decides what is licensed; your application has to act on that decision. If someone patches your code to skip the
check, no licensing API can stop them, and protecting the binary itself is outside what NetLicensing does.

NetLicensing also doesn't create machine fingerprints or session IDs for you. See
[How to Generate a Machine ID or Fingerprint](faq-how-to-generate-machine-fingerprint) for options. Prices are sent as
an amount plus an ISO 4217 currency code; [Data Types](restful-api#data-types) has the details.

## References

- [NetLicensing REST API reference](restful-api) and the [OpenAPI specification](restful-api#openapi-specification-and-api-test-center)
- [Licensee services: validate](licensee-services#validate-licensee)
- [Client libraries](client-libraries), plus quick starts for [Java](java-software-licensing), [C# / .NET](dotnet-software-licensing), [PHP](php-software-licensing), [JavaScript](javascript-software-licensing) and [Python](python-software-licensing)
- [API Security](security) and [Signing the Response](signing-the-response)
- [Object Model](object-model) and [Licensing Models](licensing-models)
