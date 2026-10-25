---
layout: default
title: "Offline Software License Validation: Architecture and Trade-offs"
nav_title: Offline License Validation
parent: Guides
nav_order: 20
description: "Three ways to validate software licenses without a permanent internet connection: cached responses with TTL, signed offline validation files, and the on-premises NetLicensing Agent. What works offline, what needs the server, security and re-synchronisation."
permalink: offline-license-validation
last_modified_at: 2026-10-25
redirect_from:
  - /offline-validation
  - /offline-licensing
---

Offline Software License Validation: Architecture and Trade-offs
================================================================

Offline validation means your application can tell whether it's licensed without talking to the license server at
that moment. NetLicensing gives you three ways to do this:

1. Reuse the last online validation result until its `ttl` timestamp. This covers short or occasional outages.
2. Give the customer a signed offline validation file. It's signed with your RSA private key, and your application
   checks it with the public key it carries. This suits machines that stay offline for a long time and have no local
   server to ask.
3. Run the NetLicensing Agent, a Java server inside the customer's network that answers validation requests in place of
   the NetLicensing cloud. This is the option for air-gapped sites and enterprise networks with many clients.

We still recommend online validation wherever it's possible. Your licensing data stays in the cloud, usage figures are
current, and renewals or revocations take effect straight away.

## Which approach fits

| Situation | Approach |
|-----------|----------|
| Laptop or desktop that's usually online, sometimes offline for hours or days | Cached validation with TTL |
| Single machine that's offline for weeks or for good, no local server | Signed offline validation file |
| Isolated network (air gap, OT, defence, labs) with several clients | NetLicensing Agent in offline mode |
| Floating (concurrent) licenses or metered usage without internet | NetLicensing Agent, with the limitations below |
| Customer won't allow any outbound connection from the application | Signed offline validation file, or the Agent |

## Option 1: Cached validation with TTL

Every validation response has a `ttl` attribute that says how long you may reuse the result. Store a successful
response and use it instead of calling the API until the `ttl` passes. You set the TTL interval in the Management Console
settings, anywhere from a few minutes to several days.

While the machine is offline, your application works from the cached result. Once the `ttl` has passed, it needs a rule
of its own, such as a grace period, read-only mode or a prompt to connect. When the connection comes back, the next
validation picks up whatever changed in the meantime, including renewals, upgrades and revocations.

Caching is your application's job; the API doesn't do it for you. If you keep the cached response on the client, store
the signed XML exactly as you received it and check the signature again each time you load it (see
[Signing the Response](signing-the-response)). Otherwise a user can simply edit the file and push the expiry date out.

[How to use offline validation using TTL and cached response](faq-offline-validation-ttl) has a timeline diagram.

## Option 2: Signed offline validation file

An offline validation file is a NetLicensing validation response for one licensee, signed with the private key that
belongs to one of your API keys. Your application loads the file and checks the signature with the matching public key.
If the signature is good, the client library returns an ordinary validation result, the same as you'd get online.

To set it up:

1. Generate an RSA key pair and create an API key with the private key attached, as described in
   [Signing the Response](signing-the-response).
2. Configure the product and the customer (licensee) in NetLicensing as usual.
3. Download the offline validation file for that licensee in the Management Console, or fetch it through the API with
   a client library.
4. Send the file to the customer, with your application or on its own.
5. In the application, check and evaluate the file with the public key.

Java:

```java
Context context = new Context();
context.setPublicKey(publicKeyPem);            // ship the public key securely inside your application

Netlicensing validationFile = (Netlicensing) JAXBContext.newInstance(Netlicensing.class)
        .createUnmarshaller()
        .unmarshal(new StringReader(offlineFileXml));

ValidationResult result = ValidationService.validateOffline(context, validationFile, new MetaInfo());
```

C#:

```csharp
Context context = new Context();
context.publicKey = publicKeyPem;
ValidationResult result = ValidationService.validateOffline(context, offlineFileXml);
```

PHP:

```php
$context = (new \NetLicensing\Context())->setPublicKey($publicKeyPem);
$meta = [];
$result = \NetLicensing\ValidationService::validateOffline($context, $offlineFileXml, $meta);
```

You'll find complete, runnable examples in `OfflineValidation` in the
[Java client demo](https://github.com/Labs64/NetLicensingClient-java/tree/master/NetLicensingClient-demo){:target="_blank"}{:rel="noopener"}
and in `examples/OfflineValidation.php` in the
[PHP client](https://github.com/Labs64/NetLicensingClient-php/tree/master/examples){:target="_blank"}{:rel="noopener"}.
If the signature is missing or wrong, the libraries throw an exception rather than return a result.

Keep in mind that the file is a snapshot of the licensing state on the day it was created. If the customer renews,
upgrades or gets revoked afterwards, they won't see it until you send a new file.

Nothing is written back to NetLicensing either. Floating sessions aren't checked out, pay-per-use credits aren't used
up, and new devices aren't bound on first use. So this option works best with models whose result doesn't depend on
those steps: [Subscription](subscription), [Multi-Feature](multi-feature), [Pricing Table](pricing-table) or
[Quota](quota). For Node-Locked, bind the node secrets before you create the file.

Dates are your application's responsibility. A subscription's `expires` value is in the result, but your code compares
it with the local clock, and you decide how much to trust that clock.

## Option 3: NetLicensing Agent on premises

The [NetLicensing Agent](netlicensing-agent) is a Java command-line server (it needs a Java 8 runtime) that runs inside
the customer's network. You point your clients' API base URL at the Agent, for example `http://agent-host:8080/rest/...`,
and they send exactly the same validation requests they'd send to the cloud. The Agent is part of selected pricing
plans.

Setting it up for offline use:

1. On a machine with internet access, run `export-assets` for the licensees the site needs. The Agent writes transfer
   files and ties them to a smart card serial number, unless you run it with `--without-card`.
2. Copy the transfer files and the Agent JAR into the isolated network.
3. Run `import-assets`, then `run-agent-offline`. From now on the Agent answers validation requests from its local
   database.
4. When something changes in the cloud (new licenses, renewals), repeat the export and import. The Agent merges the
   changes into its database.

There's also a caching proxy mode (`run-agent`) for sites with a flaky connection. It has limited support at the moment,
so don't use it in production.

A few licensing models behave differently after you import the assets again. This is a summary of the
[Agent limitations](netlicensing-agent#known-limitations):

| Licensing model | What happens after a repeated import |
|-----------------|--------------------------------------|
| Try & Buy | The trial may start over, unless you set the trial license `startDate` before exporting |
| Subscription, Rental | Licenses without an explicit `startDate` lose the start date set while the Agent was running; set it before exporting |
| Floating | Every session counts as checked in for up to `maxCheckoutValidity` after the import |
| Pay-per-Use | Used quantities are lost, so avoid this model with the current Agent release |
| Multi-Feature, Quota | No difference |

The Agent doesn't support licensee auto-create, and the numbers of exported entities can't contain commas or
semicolons.

## What works offline, and what doesn't

| Capability | Cached TTL | Signed offline file | Agent offline |
|------------|-----------|---------------------|---------------|
| Check whether use is allowed | Yes, until `ttl` | Yes | Yes |
| Read subscription expiry, features, quota | Yes | Yes | Yes |
| Notice a renewal or revocation made in the cloud | At the next online validation | Only with a new file | Only after a new export and import |
| Check out a floating session | No | No | Yes, with the limitation above |
| Use up pay-per-use credits | No | No | Not recommended |
| Bind a new device (Node-Locked, client mode) | No | No | Test it with your configuration |
| Create a new licensee automatically | No | No | No |
| Buy or renew in NetLicensing Shop | No | No | No, the Shop is a cloud service |
| Usage data in the cloud reports | Only from online validations | No | No |

## Security

Signatures protect the licensing data, not your code. A signed response or file can't be forged, but a modified copy of
your application can still skip the check, so combine licensing with whatever code protection your platform offers.

The public key matters more than it looks. If an attacker can swap it for their own, they can sign their own files, so
build it into the application instead of leaving it as a separate file. The private key never leaves your own secure
environment, which is where you create keys and files.

The Agent has its own risks. Anyone with the export file and the JAR can start extra Agent instances, and virtual
machines are easy to clone. Install the Agent somewhere you control and use the smart card, which also stops people from
rolling counters back by restoring an old snapshot. The Agent doesn't encrypt traffic to its clients either, so put it
behind an HTTPS reverse proxy as described in [Securing the Agent with SSL/TLS](securing-the-agent-with-ssl-tls).

Finally, every offline decision based on a date trusts the local clock. Remember the latest time your application has
seen and treat a big jump backwards as suspicious. [How do I handle system clock changes?](faq-clock-tampering) has more.

## References

- [NetLicensing Agent](netlicensing-agent)
- [How to use offline validation using TTL and cached response](faq-offline-validation-ttl)
- [Signing the Response](signing-the-response)
- [Validate licensee](licensee-services#validate-licensee)
- [FAQ: Can I validate licenses offline with a signed file?](faq-offline-validation-file)
- [FAQ: Can NetLicensing run on premises or in an air-gapped network?](faq-air-gapped-on-premises)
