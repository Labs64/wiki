---
layout: post
title: "Can NetLicensing run on premises or in an air-gapped network?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "The NetLicensing Agent runs on a local server and answers validation requests in isolated networks, using assets exported from the cloud."
permalink: faq-air-gapped-on-premises
faq_category: Offline and on-premises
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Our customer's network has no internet access at all. Can NetLicensing still validate licenses there?

## Answer

Yes, with the [NetLicensing Agent](netlicensing-agent), which is part of selected pricing plans. It's a Java
command-line server that runs inside the customer's network and answers validation requests in place of the cloud.

You export the licensing data for the relevant licensees from the cloud (`export-assets`), optionally tied to a smart
card that guards against cloning and snapshot rollback. On the isolated server you import it (`import-assets`) and start
the Agent with `run-agent-offline`. Your application then uses the Agent's address as its API base URL, for example
`http://agent-host:8080/rest/...`. To bring changes over, repeat the export and import.

Put the Agent behind an HTTPS reverse proxy ([Securing the Agent with SSL/TLS](securing-the-agent-with-ssl-tls)) and read
the [known limitations](netlicensing-agent#known-limitations) for your licensing models first. The Management Console
and the Shop stay in the cloud.
