---
layout: default
title: "FastSpring Integration: Step-by-Step Setup"
nav_exclude: true
description: "Set up the FastSpring to NetLicensing integration step by step: license templates, API key, FastSpring webhook with expansion and HMAC secret, receiver, tests."
permalink: fastspring-setup
last_modified_at: 2026-11-08
---

{{ page.title }}
================

This page sets up the [FastSpring Licensing Integration](fastspring-licensing). Plan about an hour. You need a NetLicensing
account, a FastSpring store with your products, and a server that can run Python 3.8 or later behind HTTPS.

| Step | Where | Result |
|------|-------|--------|
| [1](#1-model-your-plans-in-netlicensing) | NetLicensing | Product, Subscription module, one license template per FastSpring product |
| [2](#2-create-the-api-key) | NetLicensing | API key with `ROLE_APIKEY_OPERATION` |
| [3](#3-write-the-product-map) | Your server | `products.json` from FastSpring product paths to template numbers |
| [4](#4-run-the-receiver) | Your server | Receiver running behind HTTPS |
| [5](#5-add-the-webhook-in-fastspring) | FastSpring | Webhook with expansion, HMAC secret and four events |
| [6](#6-test-with-a-test-order) | Both | A test order creates a license |
| [7](#7-go-live) | Both | Live events, backfill scheduled |
| [8](#8-validate-in-your-application) | Your application | Validation by the customer's email |

## 1. Model your plans in NetLicensing

Create one product with a module of the [Subscription](subscription) licensing model, and one license template per FastSpring
product. Give each template the period of the FastSpring product's billing interval, for example 1 month for a monthly
subscription. Mark the templates as hidden, so that they are not offered in NetLicensing Shop.

You can do this in the [Management Console](https://ui.netlicensing.io){:target="_blank"}{:rel="noopener"}, or with this
script, which uses your NetLicensing username and password. Change the numbers, names and periods first.

```bash
#!/usr/bin/env bash
# One-time NetLicensing setup for the FastSpring integration.
# Usage: NLIC_USER=<NetLicensing username> NLIC_PASSWORD=<password> ./netlicensing_setup.sh
set -euo pipefail

NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="$NLIC_USER:$NLIC_PASSWORD"
PRODUCT=FS-APP            # your NetLicensing product number
MODULE=FS-APP-SUB         # Subscription module

post() { # post <path> <form fields...>
  local path=$1; shift
  local args=()
  for field in "$@"; do args+=(--data-urlencode "$field"); done
  curl --fail-with-body --silent --show-error --user "$AUTH" --header "Accept: application/json" \
    "${args[@]}" "$NLIC$path"
  echo
}

post /product name="My App" number="$PRODUCT" licenseeAutoCreate=false

post /productmodule productNumber="$PRODUCT" number="$MODULE" name="My App subscription" \
  licensingModel=Subscription

# One template per FastSpring subscription product; the time volume matches the FastSpring billing interval.
post /licensetemplate productModuleNumber="$MODULE" number=FS-APP-MONTHLY name="1 month" \
  licenseType=TIMEVOLUME timeVolume=1 timeVolumePeriod=MONTH price=0 currency=EUR hidden=true
post /licensetemplate productModuleNumber="$MODULE" number=FS-APP-YEARLY name="1 year" \
  licenseType=TIMEVOLUME timeVolume=1 timeVolumePeriod=YEAR price=0 currency=EUR hidden=true

# Optional free evaluation: every new licensee gets it automatically at its first validation.
post /licensetemplate productModuleNumber="$MODULE" number=FS-APP-TRIAL name="14-day evaluation" \
  licenseType=TIMEVOLUME timeVolume=14 timeVolumePeriod=DAY price=0 currency=EUR automatic=true hidden=true

# API key for the receiver: may create and change licensees and licenses, nothing else.
post /token tokenType=APIKEY apiKeyRole=ROLE_APIKEY_OPERATION
```

The parameters are those of [Product](product-services), [Product Module](product-module-services),
[License Template](license-template-services) and [Token](token-services) services. We ran the module, template and API key
calls of this script against the live API; the product call follows the Product Services reference (our test account had
reached its product limit). `curl --fail-with-body` needs curl 7.76 or later.

The prices stay 0 because FastSpring takes the payment. The evaluation template is optional: a FastSpring trial creates no
license (see [Events used](fastspring-licensing#events-used-and-what-they-do)), so the automatic evaluation is what lets a
customer use the product during the trial.

## 2. Create the API key

The last line of the script creates the key and prints it as the `number` of the returned `Token`. In the Management Console,
the same is available under [API Access](https://ui.netlicensing.io/#/settings){:target="_blank"}{:rel="noopener"}. Use the role
`ROLE_APIKEY_OPERATION`: it may create, change and delete licensees and licenses, and nothing else. A key with
`ROLE_APIKEY_LICENSEE` is refused (`403`) when it tries to create a licensee.

## 3. Write the product map

In FastSpring, the product path of each product is in the **Path** column of *Catalog > Products*, and the API lists them with
`GET https://api.fastspring.com/products`. Map every product that should create a license to its template number:

```json
{
  "my-app-monthly": "FS-APP-MONTHLY",
  "my-app-yearly": "FS-APP-YEARLY"
}
```

Products that are not in the map are ignored and logged.

## 4. Run the receiver

Copy `fastspring_netlicensing.py` and `fastspring_backfill.py` from the [Receiver script](fastspring-receiver) page to your
server, next to `products.json`. Create an environment file, for example `/etc/fastspring-netlicensing.env`:

```bash
NETLICENSING_API_KEY=<API key from step 2>
NETLICENSING_PRODUCT=FS-APP
FASTSPRING_WEBHOOK_SECRET=<a long random string; you enter the same value in FastSpring in step 5>
PRODUCT_MAP=/opt/fastspring-netlicensing/products.json
ACCEPT_TEST_EVENTS=true
LISTEN_ADDRESS=127.0.0.1
LISTEN_PORT=8080
WEBHOOK_PATH=/fastspring
```

Start it:

```bash
set -a; . /etc/fastspring-netlicensing.env; set +a
python3 /opt/fastspring-netlicensing/fastspring_netlicensing.py
```

On a Linux server with systemd, a unit keeps it running:

```ini
# /etc/systemd/system/fastspring-netlicensing.service
[Unit]
Description=FastSpring to NetLicensing receiver
After=network-online.target

[Service]
EnvironmentFile=/etc/fastspring-netlicensing.env
ExecStart=/usr/bin/python3 /opt/fastspring-netlicensing/fastspring_netlicensing.py
Restart=always
User=nobody

[Install]
WantedBy=multi-user.target
```

The receiver listens on plain HTTP on `127.0.0.1`. Put an HTTPS reverse proxy in front of it that forwards
`https://<your host>/fastspring` to `http://127.0.0.1:8080/fastspring` and passes the request headers unchanged, because the
receiver needs `X-FS-Signature`. FastSpring posts to port 443 by default; the other ports it allows are 3443, 8282, 9191, 9000
and 9999.

## 5. Add the webhook in FastSpring

1. In the FastSpring app, open **Developer Tools > Webhooks > Configuration**.
2. Click **Add Webhook**. Enter a title, set **Get webhooks from** to **test** for now, and select **Enable Webhook Expansion**.
   Click **Add**, then save.
3. On the webhook, click **Add URL Endpoint**:
   - **URL**: `https://<your host>/fastspring`
   - **HMAC SHA256 Secret**: the value of `FASTSPRING_WEBHOOK_SECRET`
   - **Events**: `order.completed`, `subscription.charge.completed`, `return.created`, `chargeback.created`
4. Click **Add**.

If you have several webhooks, make this the first one on the page: FastSpring's `/events` API, which the backfill script uses,
only covers events posted to the first webhook.

## 6. Test with a test order

1. Place a test order for a mapped product in your FastSpring store.
2. In FastSpring, open **Developer Tools > Webhooks > Log**: the `order.completed` event should show *Success*. **View** shows the
   payload and the response.
3. The receiver log shows `licensee ... created` and `license <order id>-<product path> created`.
4. Check the license in NetLicensing, for example with
   `curl --user "apiKey:$NETLICENSING_API_KEY" --header "Accept: application/json" https://go.netlicensing.io/core/v2/rest/license/<order id>-<product path>`.
5. Validate as your application will: `POST /licensee/<buyer email>/validate` (see step 8).
6. Refund the test order in FastSpring, if your store allows it, and check that the license is now `active=false`.

Test events reach NetLicensing only because `ACCEPT_TEST_EVENTS=true`. Use a separate NetLicensing product, or delete the test
licensees afterwards, so that test data does not mix with live customers.

## 7. Go live

1. Set `ACCEPT_TEST_EVENTS=false` and restart the receiver.
2. In FastSpring, set **Get webhooks from** to **live** (or create a separate live webhook as the first one on the page).
3. Create FastSpring API credentials under **Developer Tools > APIs > API Credentials** and schedule the backfill script, for
   example every hour with cron:

   ```bash
   0 * * * * set -a; . /etc/fastspring-netlicensing.env; FASTSPRING_API_USER=<user>; FASTSPRING_API_PASSWORD=<password>; set +a; python3 /opt/fastspring-netlicensing/fastspring_backfill.py >> /var/log/fastspring-backfill.log 2>&1
   ```

   FastSpring limits its API to 250 calls per IP per minute; the script makes two calls per missed event.
4. Watch **Developer Tools > Webhooks > Log** for *Failed but will be retried*. From there you can also resend events.

## 8. Validate in your application

Your application asks the customer for the email address used at checkout and validates it:

```bash
curl --user "apiKey:$NETLICENSING_VALIDATION_KEY" --header "Accept: application/json" --request POST \
  https://go.netlicensing.io/core/v2/rest/licensee/jane.doe%40company.com/validate
```

Use a separate key with `ROLE_APIKEY_LICENSEE` in the application: it can validate but cannot change anything. The response lists
the module with `valid` and `expires`; the [client libraries](client-libraries) wrap this call. During a FastSpring trial, the
automatic evaluation template from step 1 makes `valid` true; it starts at the first validation, so give it the length of your
FastSpring trial. After the first paid charge, the purchased periods follow.

---

Back to [FastSpring Licensing Integration](fastspring-licensing).
