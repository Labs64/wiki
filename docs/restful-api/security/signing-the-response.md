---
layout: default
title: Signing The Response
parent: Security
grand_parent: NetLicensing API (RESTful)
nav_order: 10
description: "Signing The Response"
permalink: signing-the-response
---

Signing The Response
====================

NetLicensing response spoofing by man-in-the-middle (MITM) is prevented by using SSL for encryption between NetLicensing server and the client.
This however does not guarantee against response spoofing by the malicious user directly at the client, for example by substituting the
NetLicensing server with a host in the local network. Therefore NetLicensing adds an additional security layer, namely signing the response
of a call to licensee validate method.

-   [Signature](#signature)
-   [Preconditions](#preconditions)
-   [Setting-up](#setting-up)

Signature
---------

Response signature is implemented according to [XML Signature](https://www.w3.org/TR/xmldsig-core/) spec (also known as XMLDSIG), and is currently
only implemented in the [Java NetLicensing Client library](client-libraries). Your contribution for adding the response signature verification
functionality to other NetLicensing clients is highly welcomed!

Preconditions
-------------

Response signature only works when the following preconditions are fulfilled:
* It is a response to the [validate method](licensee-services#validate-licensee)
* API is called using [API Key Identification](security#api-key-identification)
* [XML response format](restful-api#response) is used

Setting-up
----------
Currently response signing setup is only possible via direct call to the NetLicensing API. The following description uses
[Java NetLicensing Client library](client-libraries) in code examples and [OpenSSL](https://www.openssl.org/) for the key manipulation.

### 1. Create public/private RSA key pair
NetLicensing currently only supports RSA algorithm for the keys, we recommend to use at least 2048 bits key length.
Other algorithms may be added in the future.

<div>Generating key pair</div>
{: .code-example .ml-5 .code-header }
```sh
$ openssl genpkey -algorithm RSA -out rsa_private.pem -pkeyopt rsa_keygen_bits:2048
$ openssl rsa -in rsa_private.pem -pubout -out rsa_public.pem
```
{: .ml-5 }

### 2. Create an API Key with the attached RSA private key

Create a token with the type `APIKEY`, setting the property `privateKey` to the content of your private key. Since this API Key
will only be used for the licensee validate call, also limit its access by assigning the 'ROLE_APIKEY_LICENSEE' role, although it is
not required for the signature.

<div>Create API Key</div>
{: .code-example .ml-5 .code-header }
```java
final Context context = new Context();
context.setBaseUrl("https://go.netlicensing.io/core/v2/rest");
context.setSecurityMode(SecurityMode.BASIC_AUTHENTICATION);
context.setUsername("<username>");
context.setPassword("<password>");
final Token newToken = new TokenImpl();
newToken.setTokenType(TokenType.APIKEY);
newToken.addProperty("apiKeyRole", "ROLE_APIKEY_LICENSEE");
newToken.addProperty(Constants.Token.TOKEN_PROP_PRIVATE_KEY,
        "MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAhleNJf9h+aZ9KlkLLIUiqt4p3O8kAijzvEUSG4CuS95"
                + "VsUC6iVnpTlepyLB4ZImyWBjcNme4DLufbwCKi0iPzQIDAQABAkBSv7sBnL0MubB/VTm8woUIGrBOlj7n1bHMVf9"
                + "BUZIKyI/2qOVmFKtlxXXe8i5XHcg0pZukICTSWB4htxXqs8ABAiEA4JUTuq9yl2jy4aAyyrOQyPJ9s2a449tsiw3"
                + "VNIcS8wECIQCZIrcE1FxNKZLgE4mrMnfZwXJ4MqO2WH6QGznMHLP4zQIgCxwUz8ViG89bRIISQSjE3svwH/HS76K"
                + "pKe/TPjf4XgECIQCRE5pgMO/hCmnjb58VWZLB8csIpLEEp4H/9EslXGwEYQIgVw4LJk0EINngF2qSv0z12Q29WMr"
                + "aaNNcwvc3k5g5kqc=");
final Token apiKeyToken = TokenService.create(context, newToken);
final String apiKey = apiKeyToken.getNumber();
```
{: .ml-5 }

This has to be done in a secure environment, where you can be sure the key will not be compromised. Never expose your private
key within the client environment!

### 3. Execute licensee validation

Once the API Key is setup, use it in your software on the client side along with the public part of the generated key pair to
call the `validate` method (see [Integration](integration) step of [Getting Started](getting-started) guide). Store public key
securely in your software along with the API Key, make sure malicious user has no easy access to the stored public key and can't
replace it with his own - this is very sensitive aspect of this security mechanism. Provide the public key using the `setPublicKey`
method in the validation parameters. This will enable the signature verification logic in the client library. The public key is
only used locally for the verification, it is not sent anywhere.

<div>Validate licensee</div>
{: .code-example .ml-5 .code-header }
```java
final Context context = new Context();
context.setBaseUrl("https://go.netlicensing.io/core/v2/rest");
context.setSecurityMode(SecurityMode.APIKEY_IDENTIFICATION);
context.setApiKey(apiKey);
final ValidationParameters validationParameters = new ValidationParameters();
validationParameters.setPublicKey("MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIZXjSX/YfmmfSpZCyyFIqreKdzvJAIo87xFEhuA"
        + "rkveVbFAuolZ6U5XqciweGSJslgY3DZnuAy7n28AiotIj80CAwEAAQ==");
ValidationResult validationResult = LicenseeService.validate(context, licenseeNumber, validationParameters);
```
{: .ml-5 }

If signature verification fails, `WrongResponseFormatException` exception is thrown with the message providing details.

<div>Exception on signature verification failure</div>
{: .code-example .ml-5 .code-header }
```text
com.labs64.netlicensing.exception.WrongResponseFormatException: Response has no signature.
```
{: .ml-5 }
