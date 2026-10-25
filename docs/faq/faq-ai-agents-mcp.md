---
layout: post
title: "Can AI agents manage NetLicensing?"
parent: FAQ & Troubleshooting
nav_order: 100
description: "Yes. The official NetLicensing MCP server lets AI assistants such as Claude, GitHub Copilot and JetBrains agents manage licenses through the Model Context Protocol."
permalink: faq-ai-agents-mcp
faq_category: Integrations
last_modified_at: 2026-10-25
---

{{ page.title }}
=============

## Question

Can I manage customers and licenses from an AI assistant like Claude or GitHub Copilot?

## Answer

Yes. The official [NetLicensing MCP server](netlicensing-mcp) speaks the Model Context Protocol and makes the
NetLicensing REST API available as tools. Connect it to Claude Desktop, VS Code with GitHub Copilot agent mode, a
JetBrains IDE or another MCP client, and you can ask it to list or create products, licensees and licenses, validate a
customer, create a shop link, or run one of the built-in audits, such as a sweep for licenses that are about to expire.

You can run it with `uvx netlicensing-mcp`, install it with `pip install netlicensing-mcp`, or use the Docker image
`ghcr.io/labs64/netlicensing-mcp`. It masks secrets in its answers and asks for confirmation before deleting anything.
Give it an API key with the lowest role that does the job (see [Security](netlicensing-mcp-security)), and start with
the [client setup](netlicensing-mcp-client-setup).
