---
layout: post
title: "How do I protect validation responses against tampering?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Enable signed validation responses: NetLicensing signs the response with your RSA private key and the client library verifies it with the embedded public key."
permalink: faq-prevent-response-spoofing
faq_category: Security
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Could a user fake a positive license response, for example with a local fake server?

## Answer

HTTPS protects the connection, but someone who controls their own machine can point the API host name at a server of
their own. Response signing catches that.

You generate an RSA key pair (2048 bits or more) and create an API key with the private key attached. Your application
ships with that API key and the public key. When it validates with XML responses, the
[Java and C# client libraries](client-libraries) check the XML signature and throw an exception if it's missing or
doesn't match.

Two things to watch: make sure nobody can swap the public key in your application for their own, and never ship the
private key. The full setup is in [Signing the Response](signing-the-response). Keep in mind that signing protects the
licensing data. A modified copy of your application can still skip the check altogether.
