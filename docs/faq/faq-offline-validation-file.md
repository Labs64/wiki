---
layout: post
title: "Can I validate licenses offline with a signed file?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Download a signed offline validation file for a licensee and verify it in your application with the public key, using the Java, C# or PHP client."
permalink: faq-offline-validation-file
faq_category: Offline and on-premises
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Some of our customers never connect to the internet. Can I give them a license file?

## Answer

Yes. An offline validation file is the validation result for one licensee, signed with the private key attached to one
of your API keys. You download it in the Management Console (or fetch it through the API), send it to the customer, and
your application checks it with the matching public key:

```text
Java:  ValidationService.validateOffline(context, file, meta)
C#:    ValidationService.validateOffline(context, fileXml)
PHP:   ValidationService::validateOffline($context, $fileXml, $meta)
```

You get the same result as from an online validation, or an exception if the signature doesn't match.

The file is a snapshot, though. Renewals and revocations need a new file, and things that change state, like floating
check-outs or pay-per-use credits, don't happen offline. [Offline License Validation](offline-license-validation) goes
into the details.
