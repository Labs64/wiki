---
layout: default
title: "How to Implement Software Licensing in Java"
nav_title: Java Quick Start
parent: Guides
nav_order: 50
description: "Add license validation to a Java application with the NetLicensing Java client: Maven and Gradle setup, API key authentication, validating a customer, reading subscription, feature and floating results, caching with TTL, signed responses and offline validation files."
permalink: java-software-licensing
last_modified_at: 2026-10-25
---

How to Implement Software Licensing in Java
===========================================

You need three things to add licensing to a Java application: the open-source
[NetLicensing Java client](https://github.com/Labs64/NetLicensingClient-java){:target="_blank"}{:rel="noopener"}
(`com.labs64.netlicensing:netlicensing-client`) in your build, a `Context` with your API key, and a call to
`LicenseeService.validate(...)` with the customer's licensee number. The result tells you for each product module
whether use is allowed, along with details such as when the subscription ends.

- [Prerequisites](#prerequisites)
- [Add the dependency](#add-the-dependency)
- [Validate a customer](#validate-a-customer)
- [Licensing-model parameters](#licensing-model-parameters)
- [Cache the result](#cache-the-result)
- [Verify signed responses](#verify-signed-responses)
- [Validate offline](#validate-offline)
- [Error handling](#error-handling)

## Prerequisites

- A NetLicensing vendor account with a product, at least one product module and license templates
  (see [Getting Started](getting-started)).
- An API key with role `ROLE_APIKEY_LICENSEE`, created in the Management Console or with the
  [token service](token-services).
- The licensee number you assign to each customer, installation or account.

## Add the dependency

Use the latest version from [Maven Central](https://central.sonatype.com/artifact/com.labs64.netlicensing/netlicensing-client){:target="_blank"}{:rel="noopener"}.

Maven:

```xml
<dependency>
  <groupId>com.labs64.netlicensing</groupId>
  <artifactId>netlicensing-client</artifactId>
  <version>X.Y.Z</version>
</dependency>
```

Gradle:

```groovy
dependencies {
    implementation 'com.labs64.netlicensing:netlicensing-client:X.Y.Z'
}
```

## Validate a customer

```java
import com.labs64.netlicensing.domain.vo.Composition;
import com.labs64.netlicensing.domain.vo.Context;
import com.labs64.netlicensing.domain.vo.SecurityMode;
import com.labs64.netlicensing.domain.vo.ValidationParameters;
import com.labs64.netlicensing.domain.vo.ValidationResult;
import com.labs64.netlicensing.exception.NetLicensingException;
import com.labs64.netlicensing.service.LicenseeService;

public class LicenseCheck {

    public static boolean isLicensed(String licenseeNumber) throws NetLicensingException {
        Context context = new Context();
        context.setBaseUrl("https://go.netlicensing.io/core/v2/rest");
        context.setSecurityMode(SecurityMode.APIKEY_IDENTIFICATION);
        context.setApiKey("YOUR_API_KEY");

        ValidationParameters parameters = new ValidationParameters();
        parameters.setProductNumber("YOUR_PRODUCT_NUMBER"); // needed only for licensee auto-create

        ValidationResult result = LicenseeService.validate(context, licenseeNumber, parameters);

        Composition module = result.getProductModuleValidation("YOUR_PRODUCT_MODULE_NUMBER");
        return module != null && Boolean.parseBoolean(module.getProperties().get("valid").getValue());
    }
}
```

`getProperties()` gives you everything the licensing model returns. A
[Subscription](subscription) module also returns `expires`, a [Try & Buy](try-n-buy) module returns `evaluation` and
`evaluationExpires`, and a [Quota](quota) module returns `quota`. [Multi-Feature](multi-feature) and
[Pricing Table](pricing-table) modules return one nested entry per feature, keyed by the license template number.

## Licensing-model parameters

Some models need extra input when you validate. Add it per product module with `put(productModuleNumber, key, value)`:

```java
// Node-Locked: bind to or check a device fingerprint you generate
parameters.put("M-NODE", "nodeSecret", deviceFingerprint);

// Floating: check out a session for this user or host
parameters.put("M-FLOAT", "sessionId", sessionId);
parameters.put("M-FLOAT", "action", "checkOut");

// Pay-per-Use: report credits used since the last validation
parameters.put("M-PPU", "usedQuantity", "5");
```

The client numbers the parameters for you (`productModuleNumber0`, `nodeSecret0`, ...). NetLicensing does not
generate fingerprints or session IDs, see
[How to Generate a Machine ID or Fingerprint](faq-how-to-generate-machine-fingerprint).

## Cache the result

`ValidationResult.getTtl()` tells you how long you may keep using the result. Hold on to it and validate again only
after that time, or right after the user does something that changes their license, such as buying one:

```java
if (cached == null || Calendar.getInstance().after(cached.getTtl())) {
    cached = LicenseeService.validate(context, licenseeNumber, parameters);
}
```

## Verify signed responses

A fake server could answer `valid=true` to anything. To rule that out, create an API key with an RSA private key
attached and put the matching public key in the context. The client then checks the XML signature of every validation
response and throws an exception if it's missing or doesn't match. Setup steps: [Signing the Response](signing-the-response).

```java
context.setSecurityMode(SecurityMode.APIKEY_IDENTIFICATION);
context.setApiKey(apiKeyWithPrivateKey);
context.setPublicKey(publicKeyPem);
ValidationResult result = LicenseeService.validate(context, licenseeNumber, parameters);
```

## Validate offline

On machines without a connection, load a signed offline validation file and check it with the public key:

```java
Context context = new Context();
context.setPublicKey(publicKeyPem);
Netlicensing file = (Netlicensing) JAXBContext.newInstance(Netlicensing.class)
        .createUnmarshaller().unmarshal(new StringReader(offlineFileXml));
ValidationResult result = ValidationService.validateOffline(context, file, new MetaInfo());
```

See [Offline License Validation](offline-license-validation) for how to create the file and which licensing models are
suitable.

## Error handling

`NetLicensingException` and its subclasses tell you a request was rejected (an unknown licensee without a product
number, an API key role that's too weak, a feature your plan doesn't include) or that a signature check failed.

If `go.netlicensing.io` can't be resolved, retry with the backup base URL `https://netlicensing.labs64.com/core/v2/rest`.
If the service can't be reached at all, keep using the cached result until its TTL and then fall back on your own grace
rules. Behind a corporate proxy, see [How to use the Java client library behind a proxy](faq-use-java-client-behind-proxy).

## See also

- [Software Licensing API: Architecture and Examples](software-licensing-api)
- [Client Libraries](client-libraries) and the
  [Java client demo](https://github.com/Labs64/NetLicensingClient-java/tree/master/NetLicensingClient-demo){:target="_blank"}{:rel="noopener"}
- [JavaDoc](https://go.netlicensing.io/javadoc/v2/index.html){:target="_blank"}{:rel="noopener"}
- [How to use NetLicensing with Java and Spring Security](https://netlicensing.io/blog/2020/11/13/netlicensing-spring-security/)
