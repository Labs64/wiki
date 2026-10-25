---
layout: post
title: "How do I create customers automatically on first use?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Enable licensee auto-create on the product and pass productNumber on validation; NetLicensing creates the licensee and assigns automatic licenses such as trials."
permalink: faq-licensee-auto-create
faq_category: Validation
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

I don't want to create every customer in advance. Can NetLicensing create them when my application starts for the first time?

## Answer

Yes. Switch on licensee auto-create (`licenseeAutoCreate=true`) for the [product](product-services), then validate with
the new licensee number and include `productNumber`:

```text
POST /core/v2/rest/licensee/NEW-INSTALL-1234/validate
productNumber=P001&licenseeName=Jane%20Doe
```

NetLicensing creates the licensee in that product, adds any licenses whose templates are marked *automatic* (a free
trial, for example) and returns the validation result as usual. `licenseeName` is optional and is saved as a property.

Pick a licensee number that stays the same for the installation or account, such as an installation ID your application
generates once and saves. One limitation: the [NetLicensing Agent](netlicensing-agent) doesn't support auto-create.
