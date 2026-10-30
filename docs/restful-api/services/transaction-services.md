---
layout: default
title: Transaction Services API
nav_title: Transaction Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 60
description: "REST API reference for transactions: list, get, create and update the transactions that record how licensees obtained licenses."
permalink: transaction-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Transaction Services
====================

Transactions record purchases and automatic license changes.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/transaction`](#transactions-list) | List transactions | Analytics+ |
| <span class="http-method get">GET</span> [`/transaction/{transactionNumber}`](#get-transaction) | Get transaction | Analytics+ |
| <span class="http-method post">POST</span> [`/transaction`](#create-transaction) | Create transaction | Admin |
| <span class="http-method post">POST</span> [`/transaction/{transactionNumber}`](#update-transaction) | Update transaction | Admin |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Transactions list
-----------------

<span class="http-method get">GET</span> `/transaction`

**Required role:** Analytics+

Return a list of all transactions for the current vendor.

Extra filter keys: `licenseeNumber=<number>` returns only that licensee's transactions.
`shopOnly=true` returns only transactions with source `SHOP`. Results are always sorted newest
first: `sortorder` and `sortdirection` are ignored.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `filter` | query | string |  | `;`-separated `key=value` pairs, e.g. `page=0;items=50;sortorder=number;sortdirection=DESC`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/transaction
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Transaction">
            <property name="number">T001</property>
            <property name="active">true</property>
            <property name="status">PENDING</property>
            <property name="source">SHOP</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Transaction/listTransactions)

---

Get transaction
---------------

<span class="http-method get">GET</span> `/transaction/{transactionNumber}`

**Required role:** Analytics+

Return a transaction by transactionNumber.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `transactionNumber` | path | string | yes | Number of the transaction. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/transaction/T001
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Transaction">
            <property name="number">T001</property>
            <property name="active">true</property>
            <property name="status">PENDING</property>
            <property name="source">SHOP</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Transaction/getTransaction)

---

Create transaction
------------------

<span class="http-method post">POST</span> `/transaction`

**Required role:** Admin

Creates a new transaction. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `status` | body | string |  | Values: `PENDING`, `CLOSED`. |
| `source` | body | string |  | Use `SHOP` for transactions you create. The other values are set by NetLicensing for automatic transactions. |
| `grandTotal` | body | string |  | Decimal grand total. |
| `discount` | body | string |  | Decimal discount. |
| `currency` | body | string |  | Values: `EUR`, `USD`. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "licenseeNumber=IP53OX9PF&number=TFMEIR1B9&active=true&status=PENDING&source=SHOP" \
  https://go.netlicensing.io/core/v2/rest/transaction
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Transaction">
            <property name="number">TFMEIR1B9</property>
            <property name="active">true</property>
            <property name="status">PENDING</property>
            <property name="source">SHOP</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Transaction/createTransaction)

---

Update transaction
------------------

<span class="http-method post">POST</span> `/transaction/{transactionNumber}`

**Required role:** Admin

Sets the provided properties to a transaction. Return an updated transaction. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `transactionNumber` | path | string | yes | Number of the transaction. |
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `status` | body | string |  | Values: `PENDING`, `CLOSED`. |
| `source` | body | string |  | Use `SHOP` for transactions you create. The other values are set by NetLicensing for automatic transactions. |
| `grandTotal` | body | string |  | Decimal grand total. |
| `discount` | body | string |  | Decimal discount. |
| `currency` | body | string |  | Values: `EUR`, `USD`. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "number=TGG8UTJS8&active=false&status=CANCELLED" \
  https://go.netlicensing.io/core/v2/rest/transaction/TGG8UTJS8
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Transaction">
            <property name="number">TGG8UTJS8</property>
            <property name="active">false</property>
            <property name="status">CANCELLED</property>
            <property name="source">SHOP</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Transaction/updateTransaction)

