---
layout: default
title: "Node-Locked vs Floating Licenses: Differences and When to Use Each"
nav_title: Node-Locked vs Floating
parent: Guides
nav_order: 31
description: "Node-locked licenses bind software to specific devices; floating licenses limit how many users or hosts run it at the same time. Differences in enforcement, user experience, offline behaviour and implementation with NetLicensing."
permalink: node-locked-vs-floating-licenses
last_modified_at: 2026-10-25
---

Node-Locked vs Floating Licenses
================================

A node-locked license lets the software run only on particular devices (nodes), for example "up to 2 workstations". A
floating license, also called a concurrent license, lets it run anywhere but caps how many copies run at the same time,
for example "10 users at once". In short, node-locked counts where the software is installed, and floating counts how
many people are using it right now.

## How they differ

| | Node-Locked | Floating |
|---|---|---|
| What's counted | Distinct devices or users ever bound to the license | Sessions running at the same moment |
| What your app sends | A stable node secret, such as a hardware fingerprint | A session ID plus `checkOut` or `checkIn` |
| Freeing a slot | The vendor removes the stored node secret | Check-in, or automatic expiry after `maxCheckoutValidity` |
| Usual customers | Individuals and small teams with fixed machines | Teams sharing a pool of licenses, shift work, labs |
| What users notice | It works on their bound devices; a new device needs a free slot | It works on any machine while a seat is free, and blocks them when all seats are taken |
| Needs a connection | To bind a new device the first time | For every check-out and every session renewal |
| How it gets abused | Faked or shared fingerprints | Sessions that are never checked in (a short checkout validity helps) |

## How each works in NetLicensing

With [Node-Locked](node-locked), the license stores the bound devices as `nodeSecret0`, `nodeSecret1` and so on, up to
the license's `quota`. In client mode, a new secret sent on validation is stored automatically as long as the quota
isn't used up. In predefined mode, you store the secrets yourself in advance, which is how hardware dongles are usually
handled. A validation with `productModuleNumber0=M-NODE&nodeSecret0=<fingerprint>` returns `valid=true` if the secret
is already known or can still be added. You generate the fingerprint, not NetLicensing; see
[How to Generate a Machine ID or Fingerprint](faq-how-to-generate-machine-fingerprint).

With [Floating](floating), the available seats are the sum of `maxSessions` over the licensee's active licenses. A
validation with `action0=checkOut` and a `sessionId0` reserves a seat until the `expirationTimestamp` in the response,
and checking out again extends it. `action0=checkIn` gives the seat back. Each checked-out session shows up as a
`sessionId` property on the license, and deleting that property forces a check-in. Keep `maxCheckoutValidity` short so
seats held by crashed clients come back quickly.

## Which one to choose

Go with node-locked when customers work on fixed machines, when you price per device, or when the software has to keep
working offline after it's been activated once.

Go with floating when a customer has more users than people working at the same time (shift teams and classrooms are
the classic cases) and the software can reach NetLicensing or a local [NetLicensing Agent](netlicensing-agent).

You can also use both, for example floating seats that only registered machines may take, by adding one product module
of each model.

## Related

- [Software Licensing Models Compared](software-licensing-models-compared)
- [FAQ: How do I limit the number of devices per license?](faq-limit-devices-per-license)
- [FAQ: How do I limit the number of concurrent users?](faq-limit-concurrent-users)
- [FAQ: How do I move a license to a new computer?](faq-move-license-to-new-computer)
