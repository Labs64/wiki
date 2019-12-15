---
layout: default
title: How to license dockerized applications or virtual machine environments
parent: FAQ & Troubleshooting
nav_order: 0
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

Use [Node-Locked]( node-locked) licensing model configured to be used with N nodes.
The VMs will be identified by the UUID and paired with the issues Node-Locked license max. N times.

#### Option 2: Floating

Use [Floating](floating) licensing model configured to be used with N seats.

*TBD*

---

### Machine ID & Fingerprint libraries
- Java: <a href="https://github.com/oshi/oshi" target="_blank" class="external-link">oshi/oshi</a>
- Java: <a href="https://github.com/f4b6a3/uuid-creator" target="_blank" class="external-link">f4b6a3/uuid-creator</a>
- Golang: <a href="https://github.com/denisbrodbeck/machineid" target="_blank" class="external-link">denisbrodbeck/machineid</a>
