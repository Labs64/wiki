---
layout: default
title: Payment Method Services API
nav_title: Payment Method Services
parent: Services
grand_parent: NetLicensing REST API Reference
nav_order: 80
description: "REST API reference for payment methods: list, get and update the payment methods (such as PayPal and Stripe) used by NetLicensing Shop."
permalink: payment-method-services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Payment Method Services
=======================

Payment methods available in the NetLicensing shop.

Authentication, formats, error codes, paging and role levels are the same for all endpoints and described on the [Conventions](api-conventions) page. Paths are relative to `https://go.netlicensing.io/core/v2/rest`. Every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/paymentmethod`](#payment-methods-list) | List payment methods | Admin |
| <span class="http-method get">GET</span> [`/paymentmethod/{paymentMethodNumber}`](#get-payment-method) | Get payment method | Admin |
| <span class="http-method post">POST</span> [`/paymentmethod/{paymentMethodNumber}`](#update-payment-method) | Update payment method | Admin |

A role followed by "+" means that role and every higher one, see [Roles](api-conventions#roles).

---

Payment methods list
--------------------

<span class="http-method get">GET</span> `/paymentmethod`

**Required role:** Admin

Return a list of all payment methods for the current vendor.

Paging attributes (`pagenumber` and the others) are **not** set on this list response.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `filter` | query | string |  | `;`-separated `key=value` pairs, e.g. `page=0;items=50;sortorder=number;sortdirection=DESC`. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/paymentmethod
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos/>
    <items>
        <item type="PaymentMethod">
            <property name="number">PAYPAL_SANDBOX</property>
            <property name="active">false</property>
        </item>
        <item type="PaymentMethod">
            <property name="number">PAYPAL</property>
            <property name="active">true</property>
            <property name="paypal.subject">sample_paypal_subject</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/PaymentMethod/listPaymentMethods)

---

Get payment method
------------------

<span class="http-method get">GET</span> `/paymentmethod/{paymentMethodNumber}`

**Required role:** Admin

Return a payment method info by paymentMethodNumber.

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `paymentMethodNumber` | path | string | yes | Number of the payment method. |

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  https://go.netlicensing.io/core/v2/rest/paymentmethod/PAYPAL
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos/>
    <items>
        <item type="PaymentMethod">
            <property name="number">PAYPAL</property>
            <property name="active">true</property>
            <property name="paypal.subject">sample_paypal_subject</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/PaymentMethod/getPaymentMethod)

---

Update payment method
---------------------

<span class="http-method post">POST</span> `/paymentmethod/{paymentMethodNumber}`

**Required role:** Admin

Sets the provided properties to a payment method. Return an updated payment method. The body is form encoded (`application/x-www-form-urlencoded`).

**Parameters**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `paymentMethodNumber` | path | string | yes | Number of the payment method. |
| `active` | body | boolean |  | Parsed with Java `Boolean.parseBoolean`. Only `true` (case-insensitive) is true. |

Any other body field is stored as a [custom property](custom-properties).

**Example**

<div>Request</div>
{: .code-example .code-header }
```bash
curl --user demo:demo --header "Accept: application/xml" \
  --data "active=false" \
  https://go.netlicensing.io/core/v2/rest/paymentmethod/PAYPAL
```

<div>Response</div>
{: .code-example .code-header }
```xml
<netlicensing xmlns="http://netlicensing.labs64.com/schema/context">
    <infos/>
    <items>
        <item type="PaymentMethod">
            <property name="number">PAYPAL</property>
            <property name="active">false</property>
            <property name="paypal.subject">sample_paypal_subject</property>
        </item>
    </items>
</netlicensing>
```

[Try it in the API Test Center](https://netlicensing.io/NetLicensing-API/#/PaymentMethod/updatePaymentMethod)

