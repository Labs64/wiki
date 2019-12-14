---
layout: default
title: How to license dockerized applications or virtual machine environments
parent: FAQ & Troubleshooting
description: "Licensing options available for the dockerized and VM applications"
permalink: faq-docker-vm-environment
---

How to license dockerized applications or virtual machine environments
=============

## Question

We run several applications in a virtualized environment (also as a Docker and Kubernetes). These containers are usually being run on the AWS or Azure environments.
How we can ensure that our applications are licensed and being used only within available entitlements.

## Answer

Following options can be recommended here:

#### Option 1: Node-Locked

You can add 2 modules to your product:

    Subscription: with the configured packages for 1, 3, 5 years
    Node-Locked: configured to be used with 50 nodes. The VMs will be identified by the UUID and paired with the issues Node-Locked license max. 50 times.

#### Option 2: Floating

You can add 2 modules to your product:

    Subscription: with the configured packages for 1, 3, 5 years
    Floating: seats = 50 In this scenario, you’d need to compare available quota (e.g. 50) with the number of started VMs.

*TBD*

---

### Machine ID & Fingerprint libraries
- Java: <a href="https://github.com/oshi/oshi" target="_blank" class="external-link">oshi/oshi</a>
- Java: <a href="https://github.com/f4b6a3/uuid-creator" target="_blank" class="external-link">f4b6a3/uuid-creator</a>
- Golang: <a href="https://github.com/denisbrodbeck/machineid" target="_blank" class="external-link">denisbrodbeck/machineid</a>
