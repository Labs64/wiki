---
layout: post
title: "How do I move a node-locked license to a new computer?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Free a device slot of a Node-Locked license by removing the stored nodeSecret property, so the new device can be bound on its next validation."
permalink: faq-move-license-to-new-computer
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

My customer replaced their laptop and the node-locked license doesn't work on the new one. What can I do?

## Answer

The [Node-Locked](node-locked) model stores bound devices as license properties: `nodeSecret0`, `nodeSecret1` and so on.
Once every slot is taken, a new device gets `valid=false`.

To make room, remove the old device's `nodeSecret` property from the license. You can do that in the Management Console
or with the [License Services API](license-services); to remove a property through the API, update it with an empty
value (see [Custom Properties](custom-properties)). The next time the new device validates, it's bound in client mode.

If your customers swap devices a lot, think about a higher quota, a small self-service page on your side that calls the
API, or switching to [Floating](floating).
