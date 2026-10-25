---
layout: default
title: "Automate License Audits, Customer Provisioning and Entitlement Checks with AI Agents"
nav_title: Workflows
parent: "AI-Powered Software License Management with NetLicensing MCP"
nav_order: 20
description: "Practical AI-agent workflows with the NetLicensing MCP server: license expiry audits with renewal links, customer provisioning, entitlement checks for support, cleanup of inactive customers and anomaly detection, with the built-in audit prompts and the safeguards to apply."
permalink: netlicensing-mcp-workflows
last_modified_at: 2026-10-25
---

Automate License Audits, Customer Provisioning and Entitlement Checks with AI Agents
====================================================================================

Once the [NetLicensing MCP server](netlicensing-mcp) is connected, an AI agent can handle licensing chores that would
otherwise mean clicking through several screens in the Management Console or writing a script against the REST API.
Below are the built-in prompts, a few workflows that build on them, and the safeguards we'd keep in place.

## Built-in audit prompts

The server comes with five prompt templates. They show up in the prompt picker of clients such as Claude Desktop and
Copilot agent mode, and each one runs several tool calls from a single request.

|Prompt          |Example request                              |What it does                                                                                                         |
|----------------|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
|`audit_full`    |*"Run a full account audit for product P001"*|Account health check for a product: all licensees, license states, expiry dates and anomalies                        |
|`audit_customer`|*"Audit licensee L001"*                      |One customer in depth: licenses, validation state, transaction history and renewal readiness                        |
|`audit_expiry`  |*"Which licenses expire in 30 days?"*        |Finds licenses expiring within N days and generates shop renewal URLs for each affected licensee                    |
|`audit_cleanup` |*"Find inactive licensees for cleanup"*      |Finds licensees without active licenses, orphaned license records and expired subscriptions that were not renewed  |
|`audit_anomaly` |*"Detect usage anomalies"*                   |Looks for outliers across customers, such as unusually high or low validation rates or sudden drops in activity    |

## Workflow: monthly expiry review with renewal links

1. *"Which licenses expire in the next 30 days? Group them by product."* (`audit_expiry`)
2. *"Create shop URLs for these licensees."* The agent creates a [shop token](token-services#create-token) per licensee.
3. *"Draft a renewal email for each customer with their expiry date and shop link."*

These are read-only steps plus shop token creation, so an API key with role `ROLE_APIKEY_ANALYTICS` is enough: it
includes the Licensee role's permission to create shop tokens (see [API key roles](security#api-key-identification)).
Review the drafts before sending. To run this without an agent, use [webhook notifications](notifications) on warning level changes.

## Workflow: provision a new customer

*"Create a licensee for acme-corp under product P001, add a 365-day subscription license and give me the shop URL."*

The agent creates the [licensee](licensee-services#create-licensee), creates a [license](license-services) from the
right license template and returns a shop link. This needs an API key with the Operation role. Ask the agent to show the
planned calls first when you want to confirm the license template it selected.

## Workflow: entitlement check for support

*"Validate licensee L001. Is the customer allowed to use the reporting feature, and when does their subscription end?"*

The agent calls [validate](licensee-services#validate-licensee) and explains the result for each product module, so
support staff get an answer without needing access to the Management Console. One catch: for some models, validating
changes something. A floating validation can check out a seat, and a pay-per-use validation can use up credits. Keep
these questions to models where validation only reads, or pass explicit parameters such as `usedQuantity=0`.

## Workflow: cleanup of inactive customers

1. *"Find licensees with no active licenses."* (`audit_cleanup`)
2. Review the list. Decide which ones to deactivate instead of deleting.
3. *"Deactivate licensee X."* or *"Delete licensee X."*

The server asks for a two-step confirmation before deleting anything, and it only cascades with `force_cascade`. Even so,
deactivating (`active=false`) is usually the better choice because you can undo it. Deleting also removes data you
might still need for invoices or support questions, see the [Privacy Center](privacy-center).

## Workflow: investigate unusual usage

*"Detect usage anomalies for product P001 over the last month."* (`audit_anomaly`)

Treat the output as a reason to talk to the customer, not as proof that something is wrong. Validation patterns also
change because of new caching settings, network trouble or simply a quiet season.

## Safeguards

Give each agent, and each job, its own API key with the lowest role that does the job (see
[Security](netlicensing-mcp-security)). Have a person approve anything that changes licenses, deletes data or sends
links to customers. Try new workflows against the sandbox first (`NETLICENSING_ALLOW_DEMO=true`). And pin the server
version in production so the tools don't change behaviour under you.
