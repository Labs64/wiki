---
layout: default
title: How to offer multiple VM licenses to one customer?
parent: FAQ & Troubleshooting
nav_order: 10
description: "How to offer multiple VM licenses to one customer?"
permalink: faq-multiple-vm-licenses
---

How to offer multiple VM licenses to one customer?
=============

## Question
>We need a module that will allow us to provide XY number of VM Based licenses valid for the specified time (1y, 3y, 5y, or some specific date in future) to one single customer.

## Answer

**Option 1: Subscription + Node-Locked**

You can add 2 modules to your product:
- Subscription: with the configured packages for 1, 3, 5 years
- Node-Locked: configured to be used with 50 nodes.
The VMs will be identified by the UUID and paired with the issues Node-Locked license max. 50 times.

**Option 2: Subscription + Quota**

You can add 2 modules to your product:
- Subscription: with the configured packages for 1, 3, 5 years
- Quota: volume = 50
In this scenario, you'd need to compare available quota (e.g. 50) with the number of started VMs.
