---
layout: default
title: Glossary
nav_order: 120
description: "NetLicensing Glossary"
permalink: glossary
canonical: /glossary
---

Glossary
=======================================

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Client</strong></p></td>
<td><p>In the context of data communication with NetLicensing, e.g. via RESTful NetLicensing API, the client is the program sending requests to NetLicensing and receiving answers from NetLicensing.</p></td>
</tr>
<tr class="even">
<td><p><strong>Entity</strong></p></td>
<td><p markdown="1">Instance of an object within [NetLicensing Object Model](object-model)</p></td>
</tr>
<tr class="odd">
<td><p><strong>NetLicensing</strong></p></td>
<td><p>Labs64 innovative license management solution</p></td>
</tr>
<tr class="even">
<td><p><strong>NetLicensing Management Console</strong></p></td>
<td><p><a href="https://go.netlicensing.io/console/v2/" class="external-link">Web-based user interface</a> of NetLicensing, accessible by vendor.</p></td>
</tr>
<tr class="odd">
<td><p><strong>NetLicensing Shop</strong></p></td>
<td><p>Web Frontend (eCommerce) of NetLicensing for end users, used to shop for new licenses.</p></td>
</tr>
<tr class="even">
<td><p><strong>NetLicensing API</strong></p></td>
<td><p>Network API of NetLicensing.</p></td>
</tr>
<tr class="odd">
<td><p><strong>Licensing Model</strong></p></td>
<td><p>Set of algorithms, rules and constraints applied to the licenses and license templates that define interconnection between licenses and possible states of the product or product module.</p></td>
</tr>
<tr class="even">
<td><p><strong>Licensee</strong></p></td>
<td><p>Holder of licenses. This can be an individual or organisation, but not necessarily the end-user.</p></td>
</tr>
<tr class="odd">
<td><p><strong>License Template</strong></p></td>
<td><p>License Template is a configuration element, that doesn't belong to and Licensee, but acts as a license prototype.</p></td>
</tr>
<tr class="even">
<td><p><strong>License</strong></p></td>
<td><p>License is the object of purchase, owned by a Licensee, and influences the resulting state of the product (validation result). Licenses are created based on License Templates.</p></td>
</tr>
<tr class="odd">
<td><p><strong>Number,</strong><br />
<strong>Business Number,</strong><br />
<strong>Entity Number,</strong><br />
<strong>External Number,</strong><br />
<strong>Identification Number</strong></p></td>
<td><p>Arbitrary sequence of printable ASCII characters that uniquely identify an object within NetLicensing. E.g. Licensee number can be something like <code>'CUST-0015'</code></p></td>
</tr>
<tr class="even">
<td><p><strong>Product</strong></p></td>
<td><p>Generalized term, meaning any product or service that is integrated with NetLicensing and is subject of licensing to licensees.</p></td>
</tr>
<tr class="odd">
<td><p><strong>Product Module</strong></p></td>
<td><p>In terms of NetLicensing, every product consists of one or more product modules that are licensed independently of each other. This ensures high degree of NetLicensing customizability.</p></td>
</tr>
<tr class="even">
<td><p><strong>PSP,</strong><br />
<strong>Payment Service Provider</strong></p></td>
<td><p>Service used by NetLicensing for collecting payments from end customers, such as PayPal.</p></td>
</tr>
<tr class="odd">
<td><p><strong>Token</strong></p></td>
<td><p>Unique identifier randomly generated on demand, that is valid for a limited period of time and/or for limited number of uses (e.g. one-time use) after generation. Used for secure access to NetLicensing resources via unique non-predictable URLs.</p></td>
</tr>
<tr class="even">
<td><p><strong>Transaction</strong></p></td>
<td><p>Any particular action within NetLicensing that cause change in licenses (adding, removing, modification) is a transaction and is accompanied by the corresponding transaction record.</p></td>
</tr>
<tr class="odd">
<td><p><strong>Validation</strong></p></td>
<td><p>Specific request to NetLicensing via NetLicensing API, typically made by a product, to obtain the current licensing state of a specific licensee.</p></td>
</tr>
<tr class="even">
<td><p><strong>Vendor</strong></p></td>
<td><p>Vendor uses NetLicensing by integrating it to his product or service. This is You, NetLicensing customer.</p></td>
</tr>
</tbody>
</table>
