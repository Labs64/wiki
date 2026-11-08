---
layout: default
title: "FastSpring Integration: Receiver Script"
nav_exclude: true
description: "Copy-paste Python receiver for FastSpring webhooks that creates and deactivates NetLicensing licenses, plus a backfill script for missed events."
permalink: fastspring-receiver
last_modified_at: 2026-11-08
---

{{ page.title }}
================

Two files, Python 3.8 or later, standard library only. They implement the
[FastSpring Licensing Integration](fastspring-licensing); the [setup page](fastspring-setup) shows where they run.

| File | Purpose |
|------|---------|
| [`fastspring_netlicensing.py`](#the-receiver) | HTTP receiver for FastSpring webhooks |
| [`fastspring_backfill.py`](#backfill-missed-events) | Processes events that FastSpring still lists as unprocessed, then marks them processed |
| `products.json` | Your map from FastSpring product paths to NetLicensing license template numbers ([example](fastspring-setup#3-write-the-product-map)) |

## Configuration

| Variable | Required | Meaning |
|----------|----------|---------|
| `NETLICENSING_API_KEY` | yes | API key with `ROLE_APIKEY_OPERATION` |
| `NETLICENSING_PRODUCT` | yes | NetLicensing product number |
| `FASTSPRING_WEBHOOK_SECRET` | yes | The *HMAC SHA256 Secret* of the FastSpring webhook URL endpoint |
| `PRODUCT_MAP` | yes | Path of `products.json` |
| `ACCEPT_TEST_EVENTS` | no | `true` processes test orders; default: acknowledged and ignored |
| `LISTEN_ADDRESS`, `LISTEN_PORT` | no | Default `127.0.0.1` and `8080` |
| `WEBHOOK_PATH` | no | Default `/fastspring` |
| `FASTSPRING_API_USER`, `FASTSPRING_API_PASSWORD` | backfill only | FastSpring API credentials |
| `BACKFILL_DAYS` | backfill only | Days to look back, 1 to 30; default 3 |

## The receiver

```python
#!/usr/bin/env python3
"""FastSpring -> NetLicensing webhook receiver (foundation script, Python 3.9+, standard library only).

Receives FastSpring server webhooks, verifies the X-FS-Signature header and creates or deactivates
licenses through the NetLicensing REST API. See https://netlicensing.io/wiki/fastspring-licensing

Configuration (environment variables):
  NETLICENSING_API_KEY        API key with role ROLE_APIKEY_OPERATION
  NETLICENSING_PRODUCT        NetLicensing product number
  FASTSPRING_WEBHOOK_SECRET   the "HMAC SHA256 Secret" of the FastSpring webhook URL endpoint
  PRODUCT_MAP                 path to a JSON file: {"<FastSpring product path>": "<licenseTemplateNumber>", ...}
  ACCEPT_TEST_EVENTS          "true" to process test orders (live=false); default: acknowledge and ignore them
  LISTEN_ADDRESS, LISTEN_PORT where to listen (default 127.0.0.1:8080; put an HTTPS reverse proxy in front)
  WEBHOOK_PATH                URL path of the receiver (default /fastspring)
"""
import base64
import hashlib
import hmac
import json
import logging
import os
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

NLIC_BASE = "https://go.netlicensing.io/core/v2/rest"
log = logging.getLogger("fastspring-netlicensing")


def env(name, default=None):
    value = os.environ.get(name, default)
    if value is None:
        raise SystemExit(f"Missing environment variable {name}")
    return value


# ---------------------------------------------------------------------------- NetLicensing API

class NetLicensingError(Exception):
    def __init__(self, status, code, message):
        super().__init__(f"HTTP {status} {code}: {message}")
        self.status, self.code = status, code


def nlic_call(method, path, fields=None):
    """Call the NetLicensing REST API; return the parsed JSON or raise NetLicensingError."""
    data = urllib.parse.urlencode(fields).encode() if fields is not None else None
    request = urllib.request.Request(NLIC_BASE + path, data=data, method=method)
    token = base64.b64encode(f"apiKey:{os.environ['NETLICENSING_API_KEY']}".encode()).decode()
    request.add_header("Authorization", "Basic " + token)
    request.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", "replace")
        try:
            info = json.loads(body)["infos"]["info"][0]
            raise NetLicensingError(error.code, info["id"], info["value"]) from None
        except (ValueError, KeyError, IndexError, TypeError):
            raise NetLicensingError(error.code, "HTTPError", body[:200]) from None


def quote(number):
    return urllib.parse.quote(number, safe="")


def ensure_licensee(number, name=None, email=None):
    """Create the licensee; an existing number (or alias) is fine."""
    fields = {"productNumber": os.environ["NETLICENSING_PRODUCT"], "number": number}
    if name:
        fields["name"] = name
    if email:
        fields["aliases"] = json.dumps([email])
    try:
        nlic_call("POST", "/licensee", fields)
        log.info("licensee %s created", number)
    except NetLicensingError as error:
        if error.code != "DuplicateEntityException":
            raise


def create_license(number, licensee, template):
    """Create one license; a repeated number means it was already done."""
    try:
        nlic_call("POST", "/license",
                {"number": number, "licenseeNumber": licensee, "licenseTemplateNumber": template})
        log.info("license %s created for %s", number, licensee)
    except NetLicensingError as error:
        if error.code != "DuplicateEntityException":
            raise
        log.info("license %s already exists", number)


def deactivate_license(number):
    """Deactivate one license; a license that does not exist is ignored."""
    try:
        nlic_call("POST", "/license/" + quote(number), {"active": "false"})
        log.info("license %s deactivated", number)
    except NetLicensingError as error:
        if error.code != "NotFoundException":
            raise


def licensed_sequence(licensee, subscription_id):
    """Last billing period (FastSpring 'sequence') licensed for a subscription, stored on the licensee."""
    result = nlic_call("GET", "/licensee/" + quote(licensee))
    props = {p["name"]: p["value"] for p in result["items"]["item"][0]["property"]}
    value = props.get("fsSeq_" + subscription_id)
    return int(value) if value else None


def remember_sequence(licensee, subscription_id, sequence):
    nlic_call("POST", "/licensee/" + quote(licensee), {"fsSeq_" + subscription_id: str(sequence)})


# ---------------------------------------------------------------------------- FastSpring events

def account_id(account):
    """'account' is an id string, or an object when webhook expansion is enabled."""
    return account.get("id") if isinstance(account, dict) else account


def require_expanded(value, what):
    if not isinstance(value, dict):
        raise ValueError(f"{what} is not expanded: enable Webhook Expansion for this webhook")
    return value


def on_order_completed(data, product_map):
    """First purchase: one license per mapped item, numbered <order id>-<product path>."""
    order_id = data["id"]
    account = account_id(data["account"])
    contact = data["account"].get("contact", {}) if isinstance(data["account"], dict) else {}
    customer = data.get("customer") or {}
    email = contact.get("email") or customer.get("email")
    name = " ".join(x for x in (customer.get("first"), customer.get("last")) if x) or None
    ensure_licensee(account, name, email)
    for item in data.get("items", []):
        product = item["product"]
        template = product_map.get(product)
        if not template:
            log.warning("order %s: product %s is not in PRODUCT_MAP, skipped", order_id, product)
            continue
        subscription = item.get("subscription")
        if subscription is not None:
            subscription = require_expanded(subscription, "items[].subscription")
            if subscription.get("state") == "trial":
                log.info("order %s: %s starts with a trial, no paid license yet", order_id, product)
                continue
            create_license(f"{order_id}-{product}", account, template)
            if "sequence" in subscription:
                remember_sequence(account, subscription["id"], subscription["sequence"])
            else:
                log.warning("order %s: subscription %s has no sequence", order_id, subscription["id"])
        else:
            create_license(f"{order_id}-{product}", account, template)


def on_charge_completed(data, product_map):
    """Rebill: one license per new billing period; a charge in an already licensed period
    (FastSpring also sends this event for prorated charges) adds nothing."""
    order = require_expanded(data["order"], "order")
    subscription = require_expanded(data["subscription"], "subscription")
    account = account_id(data["account"])
    sequence = int(data["sequence"])
    sub_id = subscription["id"]
    product = next((i["product"] for i in order.get("items", []) if account_id(i.get("subscription")) == sub_id),
                   subscription.get("product"))
    template = product_map.get(product)
    if not template:
        log.warning("charge %s: product %s is not in PRODUCT_MAP, skipped", order["id"], product)
        return
    ensure_licensee(account)
    last = licensed_sequence(account, sub_id)
    if last is not None and sequence <= last:
        log.info("charge %s: period %s of %s is already licensed, nothing to add", order["id"], sequence, sub_id)
        return
    create_license(f"{order['id']}-{product}", account, template)
    remember_sequence(account, sub_id, sequence)


def on_return_created(data, product_map):
    """Refund or return: deactivate the licenses of the returned items."""
    original = data["original"]
    order_id = original.get("id") or original.get("order")
    for item in data.get("items", []):
        deactivate_license(f"{order_id}-{item['product']}")


def on_chargeback_created(data, product_map):
    """Chargeback: the event names only the order, so try every mapped product."""
    for product in product_map:
        deactivate_license(f"{data['order']}-{product}")


HANDLERS = {
    "order.completed": on_order_completed,
    "subscription.charge.completed": on_charge_completed,
    "return.created": on_return_created,
    "chargeback.created": on_chargeback_created,
}


def handle_event(event, product_map, accept_test=False):
    """Process one FastSpring event. Return True if it is done (processed or deliberately ignored)."""
    kind = event.get("type")
    handler = HANDLERS.get(kind)
    if handler is None:
        return True
    if not event.get("live", False) and not accept_test:
        log.info("event %s (%s) is a test event, ignored", event.get("id"), kind)
        return True
    try:
        handler(event.get("data") or {}, product_map)
        return True
    except Exception:
        log.exception("event %s (%s) failed", event.get("id"), kind)
        return False


# ---------------------------------------------------------------------------- HTTP receiver

def signature_ok(raw_body, header, secret):
    expected = base64.b64encode(hmac.new(secret.encode(), raw_body, hashlib.sha256).digest()).decode()
    return hmac.compare_digest(expected, header or "")


class Receiver(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != os.environ.get("WEBHOOK_PATH", "/fastspring"):
            return self.answer(404, "not found")
        raw = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        if not signature_ok(raw, self.headers.get("X-FS-Signature"), os.environ["FASTSPRING_WEBHOOK_SECRET"]):
            log.warning("rejected a request with a missing or wrong X-FS-Signature")
            return self.answer(401, "invalid signature")
        events = json.loads(raw).get("events", [])
        done = [e["id"] for e in events if handle_event(e, self.server.product_map, self.server.accept_test)]
        if len(done) == len(events):
            return self.answer(200, "OK")            # all events processed
        if done:
            return self.answer(202, "\n".join(done))  # only these ids are processed; FastSpring retries the rest
        return self.answer(500, "failed")             # nothing processed; FastSpring retries

    def answer(self, status, text):
        body = text.encode()
        self.send_response(status)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        log.info("%s %s", self.address_string(), fmt % args)


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    for name in ("NETLICENSING_API_KEY", "NETLICENSING_PRODUCT", "FASTSPRING_WEBHOOK_SECRET"):
        env(name)
    with open(env("PRODUCT_MAP")) as f:
        product_map = json.load(f)
    server = ThreadingHTTPServer((os.environ.get("LISTEN_ADDRESS", "127.0.0.1"),
                                  int(os.environ.get("LISTEN_PORT", "8080"))), Receiver)
    server.product_map = product_map
    server.accept_test = os.environ.get("ACCEPT_TEST_EVENTS", "false").lower() == "true"
    log.info("listening on %s:%s%s", *server.server_address, os.environ.get("WEBHOOK_PATH", "/fastspring"))
    server.serve_forever()


if __name__ == "__main__":
    main()
```

## How the receiver handles each event

| Function | Event | NetLicensing calls |
|----------|-------|--------------------|
| `on_order_completed` | `order.completed` | `POST /licensee` (number = account id, alias = email); `POST /license` per mapped item, number `<order id>-<product path>`; for a paid subscription item `POST /licensee/{account}` with `fsSeq_<subscription id>=<sequence>` |
| `on_charge_completed` | `subscription.charge.completed` | `GET /licensee/{account}` to read `fsSeq_<subscription id>`; if `sequence` is higher: `POST /license` and update `fsSeq_...` |
| `on_return_created` | `return.created` | `POST /license/<original.id>-<product path>` with `active=false` per returned item |
| `on_chargeback_created` | `chargeback.created` | `POST /license/<order>-<product path>` with `active=false` for every mapped product |

NetLicensing answers a create with an existing number with HTTP `400` and `DuplicateEntityException`, and a deactivation of a
license that does not exist with `400` and `NotFoundException`. The receiver treats both as done, which makes every handler
safe to repeat. Any other error fails the event, so FastSpring retries it.

## Backfill missed events

Run it on a schedule (see [Go live](fastspring-setup#7-go-live)). It reads `GET https://api.fastspring.com/events/unprocessed`,
passes each event to the same handlers, and marks the successful ones with `POST /events/{id}` and `{"processed": true}`.
FastSpring requires Basic authentication, a `User-Agent` header and `Content-Type: application/json` on its API; the script sends
all three. `FASTSPRING_API_BASE` can point the script at a test server.

```python
#!/usr/bin/env python3
"""Process FastSpring events that the receiver missed, then mark them processed (run it on a schedule).

Uses the same configuration as fastspring_netlicensing.py, plus:
  FASTSPRING_API_USER, FASTSPRING_API_PASSWORD   FastSpring API credentials
  BACKFILL_DAYS                                    how many days back to look (1-30, default 3)

FastSpring's /events endpoint only covers events posted to the first webhook on the Webhooks page.
"""
import base64
import json
import logging
import os
import urllib.request

import fastspring_netlicensing as receiver

FS_API = os.environ.get("FASTSPRING_API_BASE", "https://api.fastspring.com")
log = logging.getLogger("fastspring-backfill")


def fs_call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(FS_API + path, data=data, method=method)
    creds = f"{os.environ['FASTSPRING_API_USER']}:{os.environ['FASTSPRING_API_PASSWORD']}"
    request.add_header("Authorization", "Basic " + base64.b64encode(creds.encode()).decode())
    request.add_header("User-Agent", "netlicensing-fastspring-backfill/1.0")  # FastSpring requires a User-Agent
    request.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    with open(receiver.env("PRODUCT_MAP")) as f:
        product_map = json.load(f)
    accept_test = os.environ.get("ACCEPT_TEST_EVENTS", "false").lower() == "true"
    days = int(os.environ.get("BACKFILL_DAYS", "3"))
    seen = set()
    while True:
        events = fs_call("GET", f"/events/unprocessed?days={days}").get("events", [])
        new = [e for e in events if e["id"] not in seen]
        if not new:
            break
        for event in new:
            seen.add(event["id"])
            if receiver.handle_event(event, product_map, accept_test):
                fs_call("POST", f"/events/{event['id']}", {"processed": True})
                log.info("event %s (%s) processed", event["id"], event.get("type"))
            else:
                log.warning("event %s (%s) failed; it stays unprocessed", event["id"], event.get("type"))
    log.info("done: %d events looked at", len(seen))


if __name__ == "__main__":
    main()
```

## How we tested it

We ran the receiver locally against the live NetLicensing API (a test product, deleted afterwards) and posted signed events built
from FastSpring's documented payloads:

| Scenario | Answer | Result in NetLicensing |
|----------|--------|------------------------|
| Wrong `X-FS-Signature` | `401` | Nothing |
| `order.completed` with a subscription item and a one-time item | `200` | Licensee with email alias, two licenses; validation by email is valid |
| The same event again | `200` | Nothing new |
| `subscription.charge.completed`, `sequence` 2 | `200` | One more license; `expires` one month later |
| A second charge with `sequence` 2 (proration) | `200` | Nothing new; `expires` unchanged |
| `return.created` for the rebill order | `200` | That license `active=false`; `expires` one month earlier |
| `chargeback.created` for the first order | `200` | Both licenses of that order `active=false` |
| A test-mode event (`live: false`) | `200` | Ignored |
| One good event and one without webhook expansion | `202` with the good event's id | One license; the other event stays unprocessed |
| An event type the receiver does not use | `200` | Nothing |

The backfill script was run against a local server that answers like FastSpring's `/events` API; it processed the event and
marked it processed. It was not run against FastSpring itself.

---

Back to [FastSpring Licensing Integration](fastspring-licensing).
