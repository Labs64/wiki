---
layout: post
title: "Can I try the NetLicensing API without an account?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Use the public demo account (demo/demo) and the API Test Center to try the NetLicensing REST API before registering."
permalink: faq-try-api-without-account
faq_category: Getting started
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

I'd like to test the API before signing up. Is there a sandbox?

## Answer

Yes. The public demo account (user `demo`, password `demo`) works with every API endpoint:

```bash
curl --header "Accept: application/json" --user demo:demo \
  https://go.netlicensing.io/core/v2/rest/licensee
```

Everyone shares this account, so its products and licensees change all the time. Don't put anything confidential in
it. You can also click through the API in the
[API Test Center](https://netlicensing.io/NetLicensing-API/){:target="_blank"}{:rel="noopener"}, or run the
[MCP server](netlicensing-mcp) against the sandbox with `NETLICENSING_ALLOW_DEMO=true`.

When you're ready for your own setup, [register a free vendor account](https://ui.netlicensing.io/#/register){:target="_blank"}{:rel="noopener"}.
