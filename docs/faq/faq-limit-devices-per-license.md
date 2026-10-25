---
layout: post
title: "How do I limit the number of devices per license?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Use the Node-Locked licensing model with a quota: each validation sends a device fingerprint as nodeSecret, and NetLicensing binds up to the quota."
permalink: faq-limit-devices-per-license
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

A customer should be able to use my software on at most two computers. How do I enforce that?

## Answer

Use the [Node-Locked](node-locked) model in client mode. Create a QUANTITY license template with `quota=2`. In your
application, work out a stable fingerprint for the device (there are some suggestions in
[How to Generate a Machine ID or Fingerprint](faq-how-to-generate-machine-fingerprint)) and send it on every
validation:

```text
productModuleNumber0=<module>&nodeSecret0=<fingerprint>
```

The first two different fingerprints are stored with the license and get `valid=true`. A third device gets
`valid=false`. If the customer buys more licenses, the quotas add up.

When a customer replaces a computer, see [How do I move a license to a new computer?](faq-move-license-to-new-computer)
