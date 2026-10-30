---
layout: default
title: "Token Services API: Shop Tokens and API Keys"
nav_title: Token Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 70
description: "REST API reference for tokens: create shop tokens to open NetLicensing Shop, create and revoke API keys, and create action tokens such as Customer Portal login."
permalink: token-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Token Services
==============

Tokens grant temporary or API-key access, and create shop links for licensees.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/token`](#tokens-list) | List active tokens | Admin |
| <span class="http-method get">GET</span> [`/token/{tokenNumber}`](#get-token) | Get token | Admin |
| <span class="http-method post">POST</span> [`/token`](#create-token) | Create token | Licensee+ |
| <span class="http-method delete">DELETE</span> [`/token/{tokenNumber}`](#delete-token) | Delete token | Admin |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Tokens list
-----------

<span class="http-method get">GET</span> `/token`

**Required role:** Admin

Return a list of all tokens for the current vendor.

Extra filter key: `tokenType=<TokenType>`. An unknown value adds a WARNING info.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `filter` | query | string |  | `;`-separated `key=value` pairs, e.g. `page=0;items=50;sortorder=number;sortdirection=DESC`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/token
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos />
    <items>
        <item type="Token">
            <property name="number">a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48</property>
            <property name="active">true</property>
            <property name="expirationTime">2014-01-30T13:21:03.071+01:00</property>
            <property name="tokenType">SHOP</property>
            <property name="shopURL">
                https://go.netlicensing.io/shop/v2/?shoptoken=a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
            </property>
            <property name="licenseeNumber">I001-DEMO</property>
            <property name="vendorNumber">VDEMO</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Token/listTokens)

---

Get token
---------

<span class="http-method get">GET</span> `/token/{tokenNumber}`

**Required role:** Admin

Return a token by tokenNumber.

Can be called without credentials. An expired or inactive token fails with `NotFoundException`
("Requested token is expired."), returned as 400.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `tokenNumber` | path | string | yes | Number of the token. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/token/a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos />
    <items>
        <item type="Token">
            <property name="number">a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48</property>
            <property name="active">true</property>
            <property name="expirationTime">2014-01-30T13:21:03.071+01:00</property>
            <property name="tokenType">SHOP</property>
            <property name="shopURL">
                https://go.netlicensing.io/shop/v2/?shoptoken=a6cd4cc9-5a37-4f8f-8c1d-090bd6e4bd48
            </property>
            <property name="licenseeNumber">I001-DEMO</property>
            <property name="vendorNumber">VDEMO</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Token/getToken)

---

Create token
------------

<span class="http-method post">POST</span> `/token`

**Required role:** Licensee+

Create token by tokenType and additional token parameters. The body is form encoded (`application/x-www-form-urlencoded`).

Every role may call this endpoint, but an API key that is not `ROLE_APIKEY_ADMIN` may only
create `SHOP` tokens and `ACTION` tokens with `action=licenseeLogin`. Vendor credentials may
create any type. Otherwise 403.
Lifetimes: DEFAULT 1800 s, APIKEY unlimited, SHOP 1800 s (unlimited without `licenseeNumber`),
ACTION 604800 s.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `number` | body | string |  | Unique number that identifies the entity. Optional on create: when omitted, NetLicensing generates one. On update, a new value renames the entity. |
| `active` | body | boolean |  | `false` disables the entity. Defaults to `true` when omitted on create. On update, an omitted value leaves the current state unchanged. |
| `tokenType` | body | string |  | Defaults to `DEFAULT`. |
| `expirationTime` | body | string |  | Expiration time. When omitted, the default lifetime of the token type applies. |
| `apiKeyRole` | body | string |  | `APIKEY` tokens: role of the API key. Defaults to `ROLE_APIKEY_LICENSEE`. |
| `privateKey` | body | string |  | `APIKEY` tokens: private key (on one line, without spaces) used to sign the XML responses of licensee validation made with this key. |
| `licenseeNumber` | body | string |  | `SHOP` and `ACTION` tokens: target licensee. Must exist and must not be marked for transfer. |
| `productNumber` | body | string |  | `SHOP` tokens: required when it cannot be taken from `licenseeNumber`. |
| `successURL` | body | string |  | `SHOP` tokens: page the customer returns to after checkout. |
| `successURLTitle` | body | string |  | `SHOP` tokens: title of the return link after checkout. |
| `cancelURL` | body | string |  | `SHOP` tokens: page the customer returns to when checkout is cancelled. |
| `cancelURLTitle` | body | string |  | `SHOP` tokens: title of the return link when checkout is cancelled. |
| `bundleNumber` | body | string |  | `SHOP` tokens: sell this bundle. Must exist. |
| `bundlePrice` | body | string |  | `SHOP` tokens: positive bundle price in '0.00' format. |
| `predefinedShoppingItem` | body | string |  | `SHOP` tokens: name of the shopping item shown to the customer. |
| `action` | body | string |  | `ACTION` tokens: `licenseeLogin`. The created token has a `customerPortalURL` that opens the customer portal for the licensee. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "tokenType=SHOP&licenseeNumber=I001-DEMO" \
  https://go.netlicensing.io/core/v2/rest/token
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos />
    <items>
        <item type="Token">
            <property name="number">c6d36895-f2a7-497a-aad1-4290c1d17f40</property>
            <property name="active">true</property>
            <property name="expirationTime">2014-01-30T13:16:09.675+01:00</property>
            <property name="tokenType">SHOP</property>
            <property name="shopURL">
                https://go.netlicensing.io/shop/v2/?shoptoken=c6d36895-f2a7-497a-aad1-4290c1d17f40
            </property>
            <property name="licenseeNumber">I001-DEMO</property>
            <property name="vendorNumber">VDEMO</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Token/createToken)

---

Delete token
------------

<span class="http-method delete">DELETE</span> `/token/{tokenNumber}`

**Required role:** Admin

Delete a token by number.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `tokenNumber` | path | string | yes | Number of the token. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --request DELETE \
  https://go.netlicensing.io/core/v2/rest/token/c6d36895-f2a7-497a-aad1-4290c1d17f40
```

<div>Response</div>
{: .code-example .code-header }
```http
HTTP/1.1 204 No Content
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Token/deleteToken)

