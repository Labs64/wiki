---
layout: default
title: "AI-Powered Software License Management with NetLicensing MCP"
nav_title: NetLicensing MCP
nav_order: 60
has_children: true
has_toc: false
description: "The NetLicensing MCP server is the official Model Context Protocol integration for Labs64 NetLicensing. It lets AI agents such as Claude, GitHub Copilot, VS Code and JetBrains assistants manage products, customers, licenses, validation and shop links in natural language, with redaction and delete confirmation built in."
permalink: netlicensing-mcp
last_modified_at: 2026-10-25
redirect_from:
  - /mcp
---

AI-Powered Software License Management with NetLicensing MCP
=============================================================

The NetLicensing MCP server is the official [Model Context Protocol (MCP)](https://modelcontextprotocol.io){:target="_blank"}{:rel="noopener nofollow"}
server for [Labs64 NetLicensing](https://netlicensing.io). It turns the NetLicensing [REST API](restful-api) into MCP
tools and adds a handful of audit prompts. Hook it up to Claude Desktop, GitHub Copilot agent mode in VS Code, a
JetBrains IDE or any other MCP client, and you can manage licensing by just asking: create products and customers, issue
or deactivate licenses, check what a customer is entitled to, get a shop link for a renewal, or find the licenses that
expire next month.

- Source code: [github.com/Labs64/NetLicensing-MCP](https://github.com/Labs64/NetLicensing-MCP){:target="_blank"}{:rel="noopener"}
- Package (PyPI): [pypi.org/project/netlicensing-mcp](https://pypi.org/project/netlicensing-mcp/){:target="_blank"}{:rel="noopener"}
- Container images:
  - [ghcr.io/labs64/netlicensing-mcp](https://github.com/Labs64/NetLicensing-MCP/pkgs/container/netlicensing-mcp){:target="_blank"}{:rel="noopener"}
  - [hub.docker.com/r/labs64/netlicensing-mcp](https://hub.docker.com/r/labs64/netlicensing-mcp){:target="_blank"}{:rel="noopener"}
- MCP Registry: [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/?q=netlicensing-mcp){:target="_blank"}{:rel="noopener"}

In this section:

- [Connect NetLicensing MCP to Claude, VS Code, GitHub Copilot and JetBrains](netlicensing-mcp-client-setup)
- [Automate License Audits, Customer Provisioning and Entitlement Checks with AI Agents](netlicensing-mcp-workflows)
- [Secure AI-Agent Access to Software Licensing](netlicensing-mcp-security)

## What is MCP?

The Model Context Protocol is an open standard for connecting AI assistants to outside tools and data. An MCP *server*
offers a set of named tools and prompt templates. An MCP *client*, such as an AI agent or an IDE extension, finds those
tools at runtime and calls them for the user. Since the language model decides which tool to call, the user just
describes what they want in plain language, with no UI or SDK in between.

## Architecture

```text
 AI client (Claude Desktop, VS Code / Copilot, JetBrains, custom agent)
        │  MCP over stdio (local) or Streamable HTTP (remote)
        ▼
 NetLicensing MCP server  ── redaction · delete confirmation · demo-mode guard
        │  HTTPS, API key authentication
        ▼
 NetLicensing REST API (go.netlicensing.io, or your own base URL)
```

The server doesn't store any licensing data itself. Each tool call turns into one or more REST API calls made with the
API key you give it, so the agent can do exactly what that key's [role](security#api-key-identification) allows, and
nothing more.

## Features

|Domain               |Available Tools                                                        |
|---------------------|-----------------------------------------------------------------------|
|**Products**         |list, get, create, update, delete                                      |
|**Product Modules**  |list, get, create, update, delete                                      |
|**License Templates**|list, get, create, update, delete                                      |
|**Licensees**        |list, get, create, update, delete, validate, transfer                  |
|**Licenses**         |list, get, create, update (activate / deactivate), delete              |
|**Bundles**          |list, get, create, update, delete, obtain                              |
|**Tokens**           |list, get, create shop URL, create API key token, revoke               |
|**Transactions**     |list, get, create, update                                              |
|**Payment Methods**  |list, get, update                                                      |
|**Utilities**        |list licensing models, list license types                              |
|**Audit Prompts**    |full account, single customer, expiry sweep, cleanup, anomaly detection|

A few safety features are on by default. Secrets such as `apiKey`, `licenseeSecret` and `nodeSecret` are masked in
every tool response and in the logs. Anything destructive needs a two-step confirmation, and related entities are only
deleted when you pass `force_cascade`. New API keys and shop tokens are shown once and masked after that. And without an
API key the server won't start at all unless you switch demo mode on yourself. [Security](netlicensing-mcp-security)
has the details.

## Prerequisites

You need a NetLicensing vendor account (sign up for free at
[ui.netlicensing.io/#/register](https://ui.netlicensing.io/#/register)) and an API key, which you create in the
Management Console under *Settings → API Keys*. No account yet? Set `NETLICENSING_ALLOW_DEMO=true` and the server uses the
built-in sandbox with demo credentials.

You also need Python 3.12 or later, `uv` / `uvx`, or Docker.

## Quick start

### Option A: uvx (nothing to install)

`uvx` downloads the package from PyPI and runs it in its own isolated environment:

```bash
NETLICENSING_API_KEY=your_key uvx netlicensing-mcp
```

### Option B: pip

```bash
pip install netlicensing-mcp
NETLICENSING_API_KEY=your_key netlicensing-mcp
```

### Option C: Docker

Use the default `stdio` mode for local clients such as Claude Desktop and VS Code, and `http` mode for remote or shared
setups.

```bash
# stdio, local client use
docker run -i --rm -e NETLICENSING_API_KEY=your_key ghcr.io/labs64/netlicensing-mcp:latest

# HTTP, remote or shared deployment
docker run -d -p 8000:8000 -e NETLICENSING_API_KEY=your_key ghcr.io/labs64/netlicensing-mcp:latest http

# demo / sandbox mode, no account required
docker run -i --rm -e NETLICENSING_ALLOW_DEMO=true ghcr.io/labs64/netlicensing-mcp:latest
```

In demo mode every response carries `"demo_mode": true` and the server logs a warning every so often, so you can't
mistake the sandbox for your real account.

Configuration files for Claude Desktop, VS Code and JetBrains are on the [Client Setup](netlicensing-mcp-client-setup) page.

## Configuration

Everything is configured through environment variables.

|Variable                 |Default                                  |Description                                                                                                                                |
|-------------------------|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
|`NETLICENSING_API_KEY`   |*(none)*                                 |NetLicensing API key. Required unless demo mode is enabled or, in HTTP mode, the key is supplied per request.                              |
|`NETLICENSING_ALLOW_DEMO`|`false`                                  |Set to `true` to run against the NetLicensing sandbox with demo credentials when no API key is set.                                       |
|`NETLICENSING_BASE_URL`  |`https://go.netlicensing.io/core/v2/rest`|Override the REST API base URL, for example to point to another NetLicensing instance.                                                     |
|`MCP_TRANSPORT`          |`stdio`                                  |Transport mode: `stdio` (local clients) or `http` (remote clients). Can also be passed as a positional CLI argument.                       |
|`MCP_HOST`               |`127.0.0.1`                              |Bind address for the HTTP server (HTTP mode only).                                                                                         |
|`MCP_PORT`               |`8000`                                   |Port for the HTTP server (HTTP mode only).                                                                                                 |
|`MCP_VERBOSE`            |`false`                                  |Enable verbose debug logging of API requests and responses. Also toggled by the `-v` CLI flag. Accepted values: `true`, `1`, `yes`.       |
|`MCP_REDACT_FIELDS`      |*(built-in list)*                        |Additional field names to mask in responses and logs.                                                                                      |

In HTTP mode you can leave `NETLICENSING_API_KEY` out of the server environment altogether. The server then reads the
key from each request instead: from the `X-NetLicensing-API-Key` header, the `Authorization: Bearer <key>` header or the
`?apikey=<key>` query parameter. That way several callers can share one server, each with their own key.

## Transport modes

### stdio (default)

The server reads MCP messages from standard input and writes its answers to standard output. Use this for desktop
clients such as Claude Desktop and VS Code, which start the server as a child process. No network port is opened.

### HTTP (Streamable HTTP / SSE)

The server listens on a TCP port and takes MCP requests over HTTP. You'll want this for remote agents, several users
or a cloud deployment. Put a TLS-terminating reverse proxy (Nginx, Traefik, AWS ALB) in front of it to get an HTTPS
endpoint. The repository has deployment helpers for AWS ECS Fargate and App Runner.

## Example requests

```
"List all products in my NetLicensing account."
"Create a new licensee for customer@example.com under product PTEST."
"Validate the license for licensee L001. Does it pass?"
"Generate a shop URL for licensee L001 so they can self-serve their renewal."
"Which licenses are expiring in the next 30 days?"
"Transfer all licenses from licensee L001 to L002."
"Create an API key token scoped to read-only access."
"Show me all transactions from the last month."
"Find licensees with no active licenses and flag them for cleanup."
```

The agent works out what you mean, picks the tool, fills in the API parameters, makes the call and sums up the result.
The built-in audit prompts and some longer workflows are on the [Workflows](netlicensing-mcp-workflows) page.

## Troubleshooting

### Server logs

```bash
# macOS (Claude Desktop)
tail -f ~/Library/Logs/Claude/mcp-server-netlicensing.log

# Windows (Claude Desktop)
Get-Content "$env:APPDATA\Claude\Logs\mcp-server-netlicensing.log" -Wait
```

Turn on verbose mode (`MCP_VERBOSE=true` or the `-v` flag) to log the API requests and responses. Secrets stay masked.

### Common problems

|Symptom                                 |Likely cause                                  |Resolution                                                                                         |
|----------------------------------------|----------------------------------------------|---------------------------------------------------------------------------------------------------|
|`401 Unauthorized` responses            |Invalid or deleted API key                    |Create a new key at [ui.netlicensing.io](https://ui.netlicensing.io) under *Settings → API Keys*|
|Server does not start (stdio) or returns `503` (HTTP)|No API key and demo mode not enabled |Set `NETLICENSING_API_KEY`, or `NETLICENSING_ALLOW_DEMO=true` for the sandbox                       |
|Server not listed in Claude Desktop     |Syntax error in `claude_desktop_config.json`  |Validate the file: `python -m json.tool claude_desktop_config.json`                                |
|`uvx: command not found`                |`uv` toolchain not installed                  |Install via `pip install uv` or follow [docs.astral.sh/uv](https://docs.astral.sh/uv){:target="_blank"}{:rel="noopener nofollow"}              |
|Demo / sandbox data instead of live data|Demo mode enabled, or the key is not exported to the client process|Unset `NETLICENSING_ALLOW_DEMO` and make sure the client environment contains the API key |
|Tools not appearing in Copilot Agent    |`mcp.json` not loaded                         |Click **Start** in the editor banner above `mcp.json`; check the Copilot extension version     |

## Related

- [FAQ: Can AI agents manage NetLicensing?](faq-ai-agents-mcp)
- [Software Licensing API: Architecture and Examples](software-licensing-api)
- [API Security: API key roles](security#api-key-identification)
