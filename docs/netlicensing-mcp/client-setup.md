---
layout: default
title: "Connect NetLicensing MCP to Claude, VS Code, GitHub Copilot and JetBrains"
nav_title: Client Setup
parent: "AI-Powered Software License Management with NetLicensing MCP"
nav_order: 10
description: "Configuration examples for connecting the NetLicensing MCP server to Claude Desktop, VS Code with GitHub Copilot agent mode, JetBrains IDEs and remote MCP clients, using uvx, Docker or a shared HTTP deployment."
permalink: netlicensing-mcp-client-setup
last_modified_at: 2026-10-25
---

Connect NetLicensing MCP to Claude, VS Code, GitHub Copilot and JetBrains
=========================================================================

Any MCP client can talk to the NetLicensing MCP server. Local clients start it as a child process over stdio, and
remote clients connect to a server running in HTTP mode. Either way you need a NetLicensing API key, or
`NETLICENSING_ALLOW_DEMO=true` to play in the sandbox. Give the agent a key with the
[lowest role](netlicensing-mcp-security#scope-the-api-key) that covers what you want it to do.

## Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or
`%APPDATA%\Claude\claude_desktop_config.json` (Windows), then restart Claude Desktop.

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

**Sandbox without an account:** replace the `env` block with `"NETLICENSING_ALLOW_DEMO": "true"`.

Other clients that use an `mcpServers` block, Claude Code for example, take the same JSON.

## VS Code with GitHub Copilot agent mode

The [repository](https://github.com/Labs64/NetLicensing-MCP){:target="_blank"}{:rel="noopener"} ships a
`.vscode/mcp.json` that sets up Copilot agent mode for you. Put `NETLICENSING_API_KEY` in your shell environment or a
`.env` file, open `mcp.json`, and click **Start** in the banner above it. The NetLicensing tools then show up in the
Copilot Chat tool list in agent mode.

## JetBrains IDEs (IntelliJ IDEA and others)

In Copilot Chat, switch to **Agent** mode, open the tools menu, choose **Add More Tools…** and paste the same JSON block
as for Claude Desktop.

## Remote and shared deployments

Run the server in HTTP mode, behind a TLS-terminating reverse proxy:

```bash
docker run -d -p 8000:8000 ghcr.io/labs64/netlicensing-mcp:latest http
```

Don't put an API key in the shared server's environment. Let each client send its own:

```json
{
  "mcpServers": {
    "netlicensing": {
      "url": "https://mcp.example.com/mcp?apikey=YOUR_API_KEY"
    }
  }
}
```

If your client can send custom HTTP headers, use `X-NetLicensing-API-Key: YOUR_API_KEY` or
`Authorization: Bearer YOUR_API_KEY` instead of the query parameter. That keeps the key out of URLs and access logs.

## Verify the connection

Ask the agent *"List all products in my NetLicensing account."* If you see sample demo products instead of your own,
the server is running in demo mode, and the responses will say `"demo_mode": true`.

## Next

- [Workflows and audit prompts](netlicensing-mcp-workflows)
- [Security and governance](netlicensing-mcp-security)
- [Troubleshooting](netlicensing-mcp#troubleshooting)
