---
layout: default
title: "Slack Alerts for Licensing Events"
nav_title: "Slack"
parent: Automation and Alerts
grand_parent: Integrations
nav_order: 40
description: "Post NetLicensing events to Slack without code: a webhook notification sends new customers, licenses, payments and warning levels to a channel."
permalink: slack
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: create a Slack incoming webhook, then a NetLicensing webhook notification that posts to it. New customers, new licenses, Shop payments and warning level changes then appear in a Slack channel, and no server of your own is involved.

This works because Slack's **incoming webhooks** accept an HTTP `POST` with a small JSON body, and a NetLicensing [notification](notifications) lets you define that body.

## Set it up

**Slack side.** Create a Slack app with an incoming webhook for a channel. Slack gives you a URL of the form `https://hooks.slack.com/services/<workspace-id>/<app-id>/<secret>`. To post, send a `POST` with `Content-type: application/json` and a JSON body that contains at least `text`, for example `{ "text": "Hello, world." }`. Slack answers `no_text` if the `text` attribute is missing.

**NetLicensing side.** In the Management Console open *Settings / Notifications* and [create a notification](notifications#creating-a-new-notification) of type `WEBHOOK`. Use the Slack URL as the **Endpoint** (it is HTTPS with a public certificate, as NetLicensing requires), select the events, and define the **Payload** so that it is the JSON body Slack expects. The [payload placeholders](notifications#payload-structure) are `{$.timestamp}` and `{$.entities.Event[0].name}`, for example a payload such as `{ "text": "NetLicensing event {$.entities.Event[0].name} at {$.timestamp}" }`. Create a test customer and check the message in Slack, because the way NetLicensing substitutes placeholders is described only in the [Notifications](notifications) page.

## Which events to post

| NetLicensing event | Use it to |
|----------------|---------------------|
| `LICENSEE_CREATED` | Tell the sales or support channel about a new customer |
| `LICENSE_CREATED` | Announce a new license |
| `PAYMENT_TRANSACTION_PROCESSED` | Follow Shop payments in real time |
| `WARNING_LEVEL_CHANGED` | Warn the account team when a customer's license moves from `GREEN` to `YELLOW` or `RED` |

## Keep the webhook URL secret

The Slack URL contains a secret: Slack says not to share it online, including in public version control repositories. Anyone who has the URL can post to the channel. The NetLicensing notification settings have no separate authentication field, so keep the URL private and rotate it in Slack if it leaks.

## When a message does not arrive

Slack's incoming webhooks answer with an HTTP status and an error code on failure (for example `action_prohibited` when an admin restricted incoming webhooks, which Slack says should not be retried, and `channel_is_archived`). Incoming webhooks cannot delete a message after it is posted. Slack's page we read does not state rate limits or a plan requirement. NetLicensing's [notification best practices](notifications#considerations-and-best-practices-for-receiving-notifications) apply: delivery is not guaranteed, so do not use Slack as the only record.

## What a message can contain

A notification shows what the payload placeholders give you: the event name, the timestamp and the entities (customer number, license number, transaction). For richer messages, send the event to an [automation platform](automation-platforms) or your own receiver that formats the Slack message.

## Example: the calls

```text
NetLicensing                         Slack
|                                    |
| LICENSEE_CREATED happens           |
|-- POST {"text": "..."} ----------->| incoming webhook URL
|                                    |-- message in #channel
```

### 1. Test the Slack webhook

```bash
curl --request POST --header "Content-type: application/json" \
  --data '{"text": "Hello, world."}' \
  https://hooks.slack.com/services/<workspace-id>/<app-id>/<secret>
```

### 2. Configure the NetLicensing notification

In the Management Console, *Settings / Notifications*, create a notification with these values:

| Field | Value |
|-------|-------|
| Type | `WEBHOOK` |
| Endpoint | Your Slack incoming webhook URL |
| Events | For example `LICENSEE_CREATED`, `WARNING_LEVEL_CHANGED` |
| Payload | `{ "text": "NetLicensing event {$.entities.Event[0].name} at {$.timestamp}" }` |

### 3. What NetLicensing would send without a custom payload

The full notification (`{$}`) for a new customer looks like this; the [Notifications](notifications#payload-structure) page shows the other events.

```json
{
  "timestamp": "2024-09-19T04:29:47.445Z",
  "origin": "Notification",
  "entities": {
    "Event": [ { "name": "LICENSEE_CREATED" } ],
    "Licensee": [ { "number": "IKWUYQ9GR", "active": true, "name": "Customer Uno", "products": [ "PEP4ZQ6MV" ] } ]
  }
}
```

Slack needs a `text` attribute, so send this full form to an automation platform or your own receiver if you want richer messages.

## Sources

- [Slack: sending messages using incoming webhooks](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/){:target="_blank"}{:rel="noopener nofollow"}

---

This integration needs no code. The Slack details on this page are based on the sources above. Slack changes its APIs, so verify the details against the linked page before you go live. Back to [Automation and Alerts](automation-platforms).
