---
layout: default
title: "Licensee Services API: Validate and Transfer"
nav_title: Licensee Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 40
description: "REST API reference for licensees: validate a licensee's licenses, transfer licenses, and list, get, create, update and delete licensees (customers)."
permalink: licensee-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Licensee Services
=================

A **licensee** is your customer, or one installation of your product. Licenses belong to a licensee, and your software [validates](#validate-licensee) the licensee to find out what it may use.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/licensee`](#licensees-list) | List licensees | Analytics+ |
| <span class="http-method get">GET</span> [`/licensee/{licenseeNumber}`](#get-licensee) | Get one licensee | Licensee+ |
| <span class="http-method post">POST</span> [`/licensee`](#create-licensee) | Create a licensee | Operation+ |
| <span class="http-method post">POST</span> [`/licensee/{licenseeNumber}`](#update-licensee) | Update a licensee | Operation+ |
| <span class="http-method delete">DELETE</span> [`/licensee/{licenseeNumber}`](#delete-licensee) | Delete a licensee | Operation+ |
| <span class="http-method post">POST</span> [`/licensee/{licenseeNumber}/validate`](#validate-licensee) | **Validate a licensee** | Licensee+ |
| <span class="http-method post">POST</span> [`/licensee/{licenseeNumber}/transfer`](#transfer-licenses) | Move licenses to another licensee | Licensee+ |

"Analytics+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Licensees list
--------------

<span class="http-method get">GET</span> `/licensee`

**Required role:** Analytics+

Returns the licensees of the current vendor, one page at a time.

**Parameters**

| Name | In | Type | Description |
|------|----|------|-------------|
| `filter` | query | string | Optional. Paging and sorting, see [Conventions](api-conventions#paging-sorting-and-filtering). |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/json" \
  --get --data-urlencode "filter=page=0;items=5" \
  https://go.netlicensing.io/core/v2/rest/licensee
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Licensee/listLicensees)

---

Get licensee
------------

<span class="http-method get">GET</span> `/licensee/{licenseeNumber}`

**Required role:** Licensee+

Returns one licensee.

**Parameters**

| Name | In | Type | Description |
|------|----|------|-------------|
| `licenseeNumber` | path | string | Number of the licensee. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/licensee/I001
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Licensee">
            <property name="number">I001</property>
            <property name="active">true</property>
            <property name="CustomProperty">CustomPropertyValue</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Licensee/getLicensee)

---

Create licensee
---------------

<span class="http-method post">POST</span> `/licensee`

**Required role:** Operation+

Creates a licensee. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | Type | | Description |
|------|------|-|-------------|
| `productNumber` | string | required | Product the new licensee belongs to. |
| `number` | string | | Unique number across all products of the vendor. Generated if omitted. Cannot be changed after the first license is created. |
| `active` | boolean | | If `false`, the licensee is disabled: it cannot obtain new licenses and validation is disabled. |
| `name` | string | | Human-readable name. |
| `aliases` | string | | Alternative identifiers, see [Aliases](aliases). |
| `markedForTransfer` | boolean | | Marks the licensee as the source of a [license transfer](#transfer-licenses). |

Any other field is stored as a [custom property](custom-properties). Status `402` means the operation is not included in your pricing plan.

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "productNumber=PQVJQ5F7H&number=I762LBSSX&active=false" \
  https://go.netlicensing.io/core/v2/rest/licensee
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Licensee">
            <property name="number">I762LBSSX</property>
            <property name="active">false</property>
            <property name="productNumber">PQVJQ5F7H</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Licensee/createLicensee)

---

Update licensee
---------------

<span class="http-method post">POST</span> `/licensee/{licenseeNumber}`

**Required role:** Operation+

Sets the given properties and returns the updated licensee. Fields you leave out stay unchanged. The body is form encoded.

**Parameters**

| Name | In | Type | Description |
|------|----|------|-------------|
| `licenseeNumber` | path | string | Number of the licensee to update. |
| `number`, `active`, `name`, `aliases`, `markedForTransfer` | body | | Optional. Same meaning as in [Create licensee](#create-licensee). |

Any other field is stored as a [custom property](custom-properties). Status `402` means the operation is not included in your pricing plan.

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "active=false&custLcseeProp=custLcseePropValChanged" \
  https://go.netlicensing.io/core/v2/rest/licensee/IUI6MYNIC
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <items>
        <item type="Licensee">
            <property name="number">IUI6MYNIC</property>
            <property name="active">false</property>
            <property name="productNumber">PJIF898SP</property>
            <property name="custLcseeProp">custLcseePropValChanged</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Licensee/updateLicensee)

---

Delete licensee
---------------

<span class="http-method delete">DELETE</span> `/licensee/{licenseeNumber}`

**Required role:** Operation+

Deletes a licensee. Responds with `204` and no body.

**Parameters**

| Name | In | Type | Description |
|------|----|------|-------------|
| `licenseeNumber` | path | string | Number of the licensee to delete. |
| `forceCascade` | query | boolean | Optional. Also deletes everything that belongs to the licensee, such as its licenses. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --request DELETE \
  "https://go.netlicensing.io/core/v2/rest/licensee/I001?forceCascade=true"
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Licensee/deleteLicensee)

---

Validate licensee
-----------------

<span class="http-method post">POST</span> `/licensee/{licenseeNumber}/validate`

**Required role:** Licensee+

Checks the licenses of a licensee and returns, for each product module, whether it is valid. This is the call your product makes to decide what the customer may use. The body is optional and form encoded.

**Parameters**

| Name | In | Type | Description |
|------|----|------|-------------|
| `licenseeNumber` | path | string | Licensee number or an [alias](aliases), up to 1000 characters. |
| `productNumber` | body | string | Required when the licensee does not exist yet and the product has *licensee auto-create* enabled. |
| `licenseeName` | body | string | Name for an auto-created licensee. |
| `dryRun` | body | boolean | If `true`, validation runs without saving any changes. |
| `forOfflineUse` | body | boolean | If `true`, the response is prepared for [offline validation](offline-license-validation). |

Any other field is stored as a licensee [custom property](custom-properties) if this call creates the licensee.

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" --request POST \
  https://go.netlicensing.io/core/v2/rest/licensee/I011/validate
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context" ttl="2026-10-30T15:02:36.137Z">
  <items>
    <item type="ProductModuleValidation">
      <property name="productModuleNumber">M011</property>
      <property name="productModuleName">Terminal Devices</property>
      <property name="licensingModel">Rental</property>
      <list name="L011">
        <property name="valid">false</property>
      </list>
    </item>
  </items>
</netlicensing>
```

### Product module parameters

Some [licensing models](licensing-models) need extra input on validation. Send it together with the number of the product module it applies to.

| Licensing model | Parameters |
|-----------------|------------|
| [Floating](floating) | `sessionId` (required), `action` (`checkOut` or `checkIn`, required), `maxCheckoutValidity` (seconds, overrides the module setting) |
| [Node-locked](node-locked) | `nodeSecret` (required in `CLIENT` secret mode) |
| [Pay-per-use](pay-per-use) | `usedQuantity` (uses to record) or `reserveQuantity` (uses to reserve), never both |

For **one module**, send `productModuleNumber` followed by its parameters:

```
productModuleNumber=M001&sessionId=abc&action=checkOut
```

For **several modules**, add the same 0-based number to a module and its parameters. The order does not matter:

```
productModuleNumber0=M001&sessionId0=abc&action0=checkOut&productModuleNumber1=M002&nodeSecret1=xyz
```

### Caching the result

Do not validate on every action: it slows your product down and loads the server. Every response has a `ttl` attribute, the time (ISO 8601) until which the result may be reused. Keep the last result on the client and validate again after `ttl`.

### Signed responses

If the API key used for the call has a private key, the XML response is signed. See [Signing the response](signing-the-response).

<div class="alert alert-warning" markdown="1">
`GET /licensee/{licenseeNumber}/validate` is deprecated and returns a `methodIsDeprecated` warning. Use `POST`.
</div>

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Licensee/validateLicensee)

---

Transfer licenses
-----------------

<span class="http-method post">POST</span> `/licensee/{licenseeNumber}/transfer`

**Required role:** Licensee+

Moves the licenses of a source licensee to the licensee in the path. Responds with `204` and no body. The body is form encoded.

**Parameters**

| Name | In | Type | Description |
|------|----|------|-------------|
| `licenseeNumber` | path | string | Target licensee, which receives the licenses. |
| `sourceLicenseeNumber` | body | string | Required. Licensee whose licenses are moved. |

Both licensees must be active and belong to the same product, and the source licensee must have `markedForTransfer=true`.

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --data "sourceLicenseeNumber=ISourceLicensee" \
  https://go.netlicensing.io/core/v2/rest/licensee/I011/transfer
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/Licensee/transferLicenses)
