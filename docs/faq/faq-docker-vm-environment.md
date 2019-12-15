---
layout: default
title: How to license dockerized applications or virtual machine environments
parent: FAQ & Troubleshooting
nav_order: 1
description: "Licensing options available for the dockerized and VM applications"
permalink: faq-docker-vm-environment
---

{{ page.title }}
=============

## Question

We run several applications in a virtualized environment (also as a Docker and Kubernetes). These containers are usually being run on the AWS or Azure environments.
How we can ensure that our applications are licensed and being used only within available entitlements.

## Answer

Following options can be recommended here:

#### Option 1: Node-Locked

<a href="assets/images/faq-docker-vm-environment-node-locked.png" data-lightbox="faq-docker-vm-environment" data-title="Node-Locked model configuration" data-alt="Node-Locked model configuration">
  <img src="assets/images/faq-docker-vm-environment-node-locked.png" />
</a>

Use [Node-Locked]( node-locked) licensing model configured to be used with N nodes.
The VMs will be identified by the UUID and paired with the issues Node-Locked license max. N times.
Every N+1 pairing won't be possible and will result in negative validation result.

*Advantages:*
- TBD
- TBD

#### Option 2: Floating

<a href="assets/images/faq-docker-vm-environment-floating.png" data-lightbox="faq-docker-vm-environment" data-title="Floating model configuration" data-alt="Floating model configuration">
  <img src="assets/images/faq-docker-vm-environment-floating.png" />
</a>

Use [Floating](floating) licensing model configured to be used with N seats.
The VMs will be identified by the UUID and will check-out a free seat to be able to run. Max. N VMs can be used simultaneously.

*Advantages:*
- TBD
- TBD

---

### Machine ID & Fingerprint libraries

Both the options above require a unique instance UUID / Fingerprint.
You can generate UUID based on your needs, chosen programming language and environment specifics.
Below you can find some of the third-party libraries, which ease the generation of a unique fingerprint.

- Java: <a href="https://github.com/oshi/oshi" target="_blank" class="external-link">oshi/oshi</a>
- Java: <a href="https://github.com/f4b6a3/uuid-creator" target="_blank" class="external-link">f4b6a3/uuid-creator</a>
- Golang: <a href="https://github.com/denisbrodbeck/machineid" target="_blank" class="external-link">denisbrodbeck/machineid</a>
