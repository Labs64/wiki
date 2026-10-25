---
layout: post
title: "What is the difference between node-locked and floating licenses?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Node-locked licenses bind software to specific devices; floating licenses limit the number of simultaneous users or sessions."
permalink: faq-node-locked-vs-floating
faq_category: Licensing models
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Should I sell node-locked or floating licenses?

## Answer

A [node-locked](node-locked) license works only on specific devices or for specific users, up to a number you set (the
quota). Your application sends a node secret, such as a hardware fingerprint, each time it validates.

A [floating](floating) (concurrent) license works on any device, but only so many people can use it at the same time.
Your application checks out a seat when someone starts working and checks it back in when they're done.

Node-locked is a good fit for fixed workstations and per-device pricing, and it keeps working offline once the device is
bound. Floating suits teams that have more users than people working at any one time, but every check-out needs a
connection.

There's a longer comparison in [Node-Locked vs Floating Licenses](node-locked-vs-floating-licenses).
