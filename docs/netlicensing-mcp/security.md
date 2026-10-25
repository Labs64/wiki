---
layout: default
title: "Secure AI-Agent Access to Software Licensing with NetLicensing MCP"
nav_title: Security
parent: "AI-Powered Software License Management with NetLicensing MCP"
nav_order: 30
description: "How to give AI agents safe access to NetLicensing: scoped API keys and roles, secret redaction, two-step delete confirmation, one-time credentials, stdio versus HTTP transport, per-request keys, image pinning and human approval for changes."
permalink: netlicensing-mcp-security
last_modified_at: 2026-10-25
---

Secure AI-Agent Access to Software Licensing with NetLicensing MCP
==================================================================

An AI agent connected to the [NetLicensing MCP server](netlicensing-mcp) can do whatever its API key allows. Language
models sometimes misread a request, and they can be swayed by text they come across, so treat the agent the way you'd
treat a new colleague on their first day. Give it only the access it needs, keep secrets out of its reach, and have it
ask before doing anything that's hard to undo. The server handles part of this by default; the rest is up to your
configuration.

## Built-in safeguards

| Safeguard | What it does |
|-----------|--------------|
| No silent demo fallback | Without `NETLICENSING_API_KEY` the server refuses to start (stdio) or returns `503` (HTTP), unless `NETLICENSING_ALLOW_DEMO=true` is set explicitly |
| Demo tagging | In demo mode every response contains `"demo_mode": true` and a periodic warning is logged |
| Secret redaction | Fields such as `apiKey`, `licenseeSecret`, `nodeSecret`, `password` and `secret` are masked in every tool response and in logs, for example `s3c****ecret`; extend the list with `MCP_REDACT_FIELDS` |
| One-time credentials | Tools that create API keys or shop tokens mark the response with `"shown_once": true`; later `get` and `list` calls return masked values |
| Delete confirmation | Destructive operations use a two-step confirmation token; related entities are only deleted with `force_cascade` |

## Scope the API key

NetLicensing API keys have [roles](security#api-key-identification). Create a separate key for each agent and use case:

| Agent purpose | Role |
|---------------|------|
| Answer questions, reports, audits | `ROLE_APIKEY_ANALYTICS` (read-only plus validation) |
| Create customers and licenses, generate shop links | `ROLE_APIKEY_OPERATION` |
| Change products, modules and license templates | `ROLE_APIKEY_MAINTENANCE` |
| Full administration | `ROLE_APIKEY_ADMIN`; avoid for agents |

Name each key in the Management Console after the agent that uses it, and delete keys nobody needs any more. See [How to rotate NetLicensing API keys](faq-authentication-httpbasic-apikey#how-to-rotate-netlicensing-api-keys).

## Choose the transport

For one person on their own machine, use stdio. It doesn't open a network port, so only local processes can reach the
server.

Switch to HTTP only when several users or remote agents need the server. Bind it to `127.0.0.1` or a private network,
put a TLS-terminating reverse proxy in front of it, and add authentication at the proxy. On a shared HTTP server, leave
`NETLICENSING_API_KEY` unset and let each client send its own key with each request. Send it in the
`X-NetLicensing-API-Key` or `Authorization: Bearer` header rather than the `?apikey=` query parameter, because query
strings tend to end up in proxy and access logs.

## Human approval

Most MCP clients can ask you before they run a tool. Leave that switched on for anything that creates, updates or
deletes entities, transfers licenses or creates tokens. Only let read-only tools run on their own, and only with a key
that couldn't change data even if it tried.

## Untrusted content

Licensee names, custom properties and other fields can contain text your customers typed in, and an agent reading them
might take that text as instructions. So don't let one agent session both read untrusted data and make changes without
you checking first.

## Operations

In production, pin the image or package version, for example `ghcr.io/labs64/netlicensing-mcp:<version>` rather
than `latest`. Keep verbose logging off unless you're debugging, because even with redaction the request logs contain
customer IDs. After an automated run, look over what changed in the Management Console or in the
[transactions](transaction-services). And try any new workflow in the sandbox (`NETLICENSING_ALLOW_DEMO=true`) before
you point it at your real account.

## Related

- [API Security](security)
- [Workflows](netlicensing-mcp-workflows)
- [Privacy Center](privacy-center)
