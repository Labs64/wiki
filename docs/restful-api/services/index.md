---
layout: default
title: Services
parent: NetLicensing API (RESTful)
nav_order: 10
has_children: true
description: "NetLicensing exposes all available service’s functionality via an Application Programming Interface (API)"
permalink: services
---

Services
========

NetLicensing exposes all available services functionality via an Application Programming Interface (API).

Using the NetLicensing REST API you can access programmatically all NetLicensing public functions and fully automate your licensing flow: from issuing and validating customer's entitlements to managing NetLicensing assets and interface with your in-house systems, such as CRM, ERP, e-Commerce, etc.
However, in most of the integration scenarios, you will need only a smaller subset of [essential methods](essentials).

Most of the applications will use one of the existing [wrapper libraries](client-libraries) in the language of your choice, but it's important to familiarize yourself with the underlying API HTTP methods first.

<table>
<colgroup>
<col />
<col />
<col />
</colgroup>
<thead>
<tr class="header">
<th>Endpoint</th>
<th>Allowed operations</th>
<th>Supported authentication method <a href="security">(?)</a></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p><a href="product-services">Product Services</a></p></td>
<td><span markdown="1">`LIST` `GET` `CREATE` `UPDATE` `DELETE`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
<tr class="even">
<td><a href="product-module-services">Product Module Services</a></td>
<td><span markdown="1">`LIST` `GET` `CREATE` `UPDATE` `DELETE`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
<tr class="odd">
<td><a href="license-template-services">License Template Services</a></td>
<td><span markdown="1">`LIST` `GET` `CREATE` `UPDATE` `DELETE`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
<tr class="even">
<td><strong><a href="licensee-services">Licensee Services</a></strong></td>
<td><span markdown="1">`LIST` `GET` `CREATE` `UPDATE` `DELETE` <strong>`VALIDATE`</strong> `TRANSFER`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
<tr class="odd">
<td><a href="license-services">License Services</a></td>
<td><span markdown="1">`LIST` `GET` `CREATE` `UPDATE` `DELETE`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
<tr class="even">
<td><a href="transaction-services">Transaction Services</a></td>
<td><span markdown="1">`LIST` `GET` `CREATE` `UPDATE`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
<tr class="odd">
<td><a href="token-services">Token Services</a></td>
<td><span markdown="1">`LIST` `GET` `CREATE` `DELETE`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
<tr class="even">
<td><a href="payment-method-services">Payment Method Services</a></td>
<td><span markdown="1">`LIST` `GET` `UPDATE`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
<tr class="odd">
<td><a href="utility-services">Utility Services</a></td>
<td><span markdown="1">`LIST`</span></td>
<td><span markdown="1">`BASIC AUTH` `APIKEY`</span></td>
</tr>
</tbody>
</table>

To access the API methods you will need a NetLicensing vendor account.
If you do not have one already, signup <a href="https://ui.netlicensing.io/#/register" class="external-link">here</a>.
