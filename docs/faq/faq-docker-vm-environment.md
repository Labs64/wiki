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

### Option 1: Node-Locked

<a href="assets/images/faq-docker-vm-environment-node-locked.png" class="imagelink" data-lightbox="faq-docker-vm-environment" data-title="Node-Locked model configuration" data-alt="Node-Locked model configuration">
  <img src="assets/images/faq-docker-vm-environment-node-locked.png" />
</a>

Use [Node-Locked]( node-locked) licensing model configured to be used with N nodes.
The VMs will be identified by the UUID and paired with the issues Node-Locked license max. N times.
Every N+1 pairing won't be possible and will result in negative validation result.

**Advantages:**
- This option guarantees, that only entitled number of the VM instances  (1..N) can be used by the customer.

**Use Cases:**
- Long-living instances identified by permanent UUID; e.g. Hardware USB Dongle.


### Option 2: Floating

<a href="assets/images/faq-docker-vm-environment-floating.png" class="imagelink" data-lightbox="faq-docker-vm-environment" data-title="Floating model configuration" data-alt="Floating model configuration">
  <img src="assets/images/faq-docker-vm-environment-floating.png" />
</a>

Use [Floating](floating) licensing model configured to be used with N seats.
The VMs will be identified by the UUID and will check-out a free seat to be able to run. Max. N VMs can be used simultaneously.

**Advantages:**
- The borrowed seat can be checked in, so the free seats can be checked out by other VMs. This option is useful if the new VMs are being created frequently, so the new UUIDs will be generated every time.

**Use Cases:**
- Start of the new AWS EC2 instances from the prepared AMI.
- Short-living instances; e.g. AWS Lambda.
- Autoscaling instances being created/destroyed based on the system load and capacity.

---

### Machine ID & Fingerprint libraries

In this [FAQ article](faq-how-to-generate-machine-fingerprint#machine-id--fingerprint-libraries), you can find some third-party libraries that simplify the generation of a unique fingerprint or hardware ID.
