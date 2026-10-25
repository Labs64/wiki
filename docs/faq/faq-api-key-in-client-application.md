---
layout: post
title: "Is it safe to embed a NetLicensing API key in my application?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Embed only API keys with the role ROLE_APIKEY_LICENSEE, which allows validation, transfer and shop token creation but no access to your account data."
permalink: faq-api-key-in-client-application
faq_category: Security
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

My desktop application needs credentials to validate. What should I put in the code?

## Answer

Never your account user name and password. Create an API key with the role `ROLE_APIKEY_LICENSEE` instead. That key can
validate licensees, transfer licenses and create shop tokens, and that's it. If someone digs it out of your
application, they still can't read or change your products, customers or licenses.

It's worth using separate keys per product or customer group, so you can revoke one without affecting the rest. Rotate
a key if you think it has leaked; [How to rotate NetLicensing API keys](faq-authentication-httpbasic-apikey#how-to-rotate-netlicensing-api-keys)
explains how. And turn on [response signing](signing-the-response) so a fake server can't hand your application a
made-up result.

Keys with more rights (Analytics, Operation, Maintenance, Admin) belong on your servers only. See
[API Security](security#api-key-identification).
