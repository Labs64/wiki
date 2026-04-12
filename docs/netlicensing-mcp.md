---
layout: default
title: NetLicensing MCP
nav_order: 60
description: "The NetLicensing MCP Server is the official Model Context Protocol integration for Labs64 NetLicensing, enabling AI agents to manage software licensing through natural language."
permalink: netlicensing-mcp
---

NetLicensing MCP
================

The **NetLicensing MCP Server** is the official [Model Context Protocol (MCP)](https://modelcontextprotocol.io){:target="_blank"}{:rel="noopener nofollow"}
integration for [Labs64 NetLicensing](https://netlicensing.io). It exposes the full
NetLicensing [REST API](restful-api) as a set of *MCP tools* and built-in *audit prompts*, enabling
AI agents and MCP-compatible clients — such as Claude Desktop, GitHub Copilot Agent
mode, VS Code, and JetBrains IDEA — to manage the complete software licensing
lifecycle through natural language, without writing a single API call.

- **Package (PyPI):** [pypi.org/project/netlicensing-mcp](https://pypi.org/project/netlicensing-mcp/){:target="_blank"}{:rel="noopener nofollow"}
- **Images:**
  - [ghcr.io/labs64/netlicensing-mcp](https://github.com/Labs64/NetLicensing-MCP/pkgs/container/netlicensing-mcp){:target="_blank"}{:rel="noopener nofollow"}
  - [dockerhub.com/r/labs64/netlicensing-mcp](https://hub.docker.com/r/labs64/netlicensing-mcp){:target="_blank"}{:rel="noopener nofollow"}
- **MCP Registry:** [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/?q=netlicensing-mcp){:target="_blank"}{:rel="noopener nofollow"}

## What is MCP?

The **Model Context Protocol (MCP)** is an open standard that defines how AI assistants
connect to external tools and data sources. An MCP *server* exposes a set of named
tools and prompt templates; an MCP *client* (an AI agent or IDE extension) discovers
these tools at runtime and invokes them on behalf of the user. Because tool invocation
is driven by the language model, the user interacts in plain language rather than
through a UI or an SDK.

## Features

The server provides comprehensive coverage across all NetLicensing entities:

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

Delete safety is enforced on all delete tools via a `force_cascade` option — nothing
is silently removed by cascade.

## Prerequisites

- A **NetLicensing vendor account** — sign up for free at
  [ui.netlicensing.io/#/register](https://ui.netlicensing.io/#/register)
- A **NetLicensing API key** — generate one from the Management Console under
  *Settings → API Keys*; leave it empty to use the built-in sandbox with demo
  credentials (no account required)
- One of the following runtimes: Python 3.12+, `uv` / `uvx`, or Docker

## Quick Start

Three installation paths are supported. Choose the one that fits your environment.

### Option A — uvx (no local install required)

The fastest path for trying the server. `uvx` downloads and runs the package from
PyPI in an isolated environment without polluting your system Python:

```bash
NETLICENSING_API_KEY=your_key uvx netlicensing-mcp
```

### Option B — pip

Install the package into your active Python environment:

```bash
pip install netlicensing-mcp
NETLICENSING_API_KEY=your_key netlicensing-mcp
```

### Option C — Docker

Use the official container image. The `stdio` mode (default) suits local clients
such as Claude Desktop and VS Code; `http` mode is for remote or shared deployments.

**stdio — local client use:**

```bash
docker run -i --rm \
  -e NETLICENSING_API_KEY=your_key \
  ghcr.io/labs64/netlicensing-mcp:latest
```

**HTTP — remote / shared deployment:**

```bash
docker run -d -p 8000:8000 \
  -e NETLICENSING_API_KEY=your_key \
  ghcr.io/labs64/netlicensing-mcp:latest http
```

**Verbose / debug logging:**

```bash
# Via CLI flag
docker run -i --rm \
  -e NETLICENSING_API_KEY=your_key \
  ghcr.io/labs64/netlicensing-mcp:latest -v

# Via environment variable
docker run -i --rm \
  -e NETLICENSING_API_KEY=your_key \
  -e MCP_VERBOSE=true \
  ghcr.io/labs64/netlicensing-mcp:latest
```


## Configuration

All configuration is supplied through environment variables.

|Variable               |Required|Default                                  |Description                                                                                                                                |
|-----------------------|--------|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
|`NETLICENSING_API_KEY` |No      |*(demo mode)*                            |NetLicensing API key. Leave empty to run in sandbox mode with demo credentials.                                                            |
|`NETLICENSING_BASE_URL`|No      |`https://go.netlicensing.io/core/v2/rest`|Override the REST API base URL — for example, pointing to an on-premises or self-hosted NetLicensing instance.                             |
|`MCP_TRANSPORT`        |No      |`stdio`                                  |Transport mode: `stdio` (local clients) or `http` (remote clients). Can also be passed as a positional CLI argument.                       |
|`MCP_HOST`             |No      |`127.0.0.1`                              |Bind address for the HTTP server (HTTP mode only).                                                                                         |
|`MCP_PORT`             |No      |`8000`                                   |Port for the HTTP server (HTTP mode only).                                                                                                 |
|`MCP_VERBOSE`          |No      |`false`                                  |Enable verbose debug logging — logs raw API requests and responses. Also toggled by the `-v` CLI flag. Accepted values: `true`, `1`, `yes`.|

**Per-request API key injection (HTTP mode only):** When running in HTTP mode over a
network, `NETLICENSING_API_KEY` can be omitted from the server environment. The server
will extract the key per-request from the connecting client via the
`X-NetLicensing-API-Key` header, the `Authorization: Bearer <key>` header, or the
`?apikey=<key>` query parameter. This enables multi-tenant deployments where different
callers authenticate with their own keys against a shared server instance.


## Client Setup

Edit the client's MCP configuration file:

**Using uvx:**

```json
{
  "mcpServers": {
    "netlicensing": {
      "command": "uvx",
      "args": ["netlicensing-mcp"],
      "env": {
        "NETLICENSING_API_KEY": "your_key_here"
      }
    }
  }
}
```

**Using Docker (stdio):**

```json
{
  "mcpServers": {
    "netlicensing": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "NETLICENSING_API_KEY=your_key_here",
        "ghcr.io/labs64/netlicensing-mcp:latest"
      ]
    }
  }
}
```

## Transport Modes

The server supports two MCP transport mechanisms. Choosing the right one depends
on whether the AI client is running on the same machine or connecting remotely.

### stdio (default)

The server reads MCP messages from standard input and writes responses to standard
output. This is the correct choice for local desktop clients such as Claude Desktop
and VS Code Copilot, where the client process spawns the server as a child process.
No network binding is required and no port needs to be opened.

### HTTP (Streamable HTTP / SSE)

The server binds to a TCP port and accepts MCP requests over HTTP. This enables
remote AI agents, multi-user deployments, and cloud-hosted scenarios where the
server needs to be shared across multiple clients. Combine with a TLS-terminating
reverse proxy (Nginx, Traefik, AWS ALB) to expose a secure HTTPS endpoint.


## Audit Prompt Templates

The MCP server ships five built-in prompt templates that surface directly in
Copilot Agent mode and Claude Desktop’s prompt picker. Each template chains
multiple tool calls behind a single conversational entry point:

|Prompt          |Trigger phrase                               |Purpose                                                                                                                               |
|----------------|---------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
|`audit_full`    |*“Run a full account audit for product P001”*|End-to-end account health check: all licensees, license states, expiry dates, and anomalies for a given product.                      |
|`audit_customer`|*“Audit licensee L001”*                      |Deep-dive on a single customer — all licenses, validation state, transaction history, and renewal readiness.                          |
|`audit_expiry`  |*“Which licenses expire in 30 days?”*        |Finds all licenses expiring within N days and generates shop renewal URLs for each affected licensee.                                 |
|`audit_cleanup` |*“Find inactive licensees for cleanup”*      |Identifies licensees with no active licenses, orphaned license records, and expired subscriptions that have not been renewed.         |
|`audit_anomaly` |*“Detect usage anomalies”*                   |Scans usage patterns across all customers to surface outliers — unusually high or low validation rates, sudden drops in activity, etc.|


## Example Conversations

The following shows the kinds of natural-language requests the MCP server handles
once connected to a compatible client:

```
"List all products in my NetLicensing account."
"Create a new licensee for customer@example.com under product PTEST."
"Validate the license for licensee L001 — does it pass?"
"Generate a shop URL for licensee L001 so they can self-serve their renewal."
"Which licenses are expiring in the next 30 days?"
"Transfer all licenses from licensee L001 to L002."
"Create an API key token scoped to read-only access."
"Show me all transactions from the last month."
"Find licensees with no active licenses — flag them for cleanup."
```

No API knowledge is needed on the user’s side. The AI agent resolves the intent,
selects the appropriate tool, constructs the API parameters, executes the call
against the NetLicensing REST API, and returns a human-readable summary.

## Troubleshooting

### Inspecting Server Logs

```bash
# macOS (Claude Desktop)
tail -f ~/Library/Logs/Claude/mcp-server-netlicensing.log

# Windows (Claude Desktop)
Get-Content "$env:APPDATA\Claude\Logs\mcp-server-netlicensing.log" -Wait
```

Enable verbose mode (`MCP_VERBOSE=true` or the `-v` flag) to log raw API requests
and responses, which is the fastest way to diagnose unexpected tool behaviour.

### Common Issues

|Symptom                                 |Likely cause                                  |Resolution                                                                                         |
|----------------------------------------|----------------------------------------------|---------------------------------------------------------------------------------------------------|
|`401 Unauthorized` responses            |Invalid or expired API key                    |Regenerate your key at [ui.netlicensing.io](https://ui.netlicensing.io) under *Settings → API Keys*|
|Server not listed in Claude Desktop     |Syntax error in `claude_desktop_config.json`  |Validate the file: `python -m json.tool claude_desktop_config.json`                                |
|`uvx: command not found`                |`uv` toolchain not installed                  |Install via `pip install uv` or follow [docs.astral.sh/uv](https://docs.astral.sh/uv){:target="_blank"}{:rel="noopener nofollow"}              |
|Demo / sandbox data instead of live data|`NETLICENSING_API_KEY` not set or not exported|Ensure the variable is exported in the shell that launches the client                              |
|Tools not appearing in Copilot Agent    |`mcp.json` not loaded                         |Click **Start** in the editor banner above `mcp.json`; check IDE Copilot extension version     |


## Security Considerations

When operating the NetLicensing MCP Server in production, apply the following
hardening measures to contain the blast radius of any agent misbehaviour.

**Scope the API key.** Generate a dedicated API key for the MCP server with the
minimum privilege needed. A monitoring-only deployment does not need write access;
restrict accordingly using NetLicensing’s role-based API key scoping.

**Use stdio for local deployments.** The stdio transport never opens a network
port — the attack surface is limited to the processes running on the same machine.
Only switch to HTTP mode when you genuinely need remote access.

**Pin the container image version.** Use a specific release tag (e.g.
`ghcr.io/labs64/netlicensing-mcp:1.0.0`) rather than `latest` in production to
prevent unintended updates.
