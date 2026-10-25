---
layout: post
title: "How can customers see their licenses?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Give customers access to the white-label NetLicensing Customer Portal with an action token, to view licenses, transactions and account data."
permalink: faq-customer-portal-access
faq_category: Licenses and customers
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Can my customers log in somewhere to see which licenses they have?

## Answer

Yes, through the [Customer Portal](customer-portal). It's a hosted, white-label page where customers can see their
licenses, past transactions and account details. To let a customer in, create an action token for them:

```text
POST /core/v2/rest/token
tokenType=ACTION&action=licenseeLogin&licenseeNumber=<licenseeNumber>
```

Then send them to the `customerPortalURL` in the response. The logo, accent colour and legal links come from your
Management Console settings, and you can hide the header, footer or payment buttons with URL parameters. The Customer
Portal has to be enabled for your account first.
