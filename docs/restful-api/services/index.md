---
layout: default
title: Services
parent: NetLicensing API (RESTful)
nav_order: 99
has_children: true
description: ""
permalink: services
---

Services
========


NetLicensing exposes all available service's functionality via an
Application Programming Interface (API).

To access the API methods you will need a NetLicensing vendor account.
If you do not have one already, signup
<a href="https://ui.netlicensing.io/#/register" class="external-link">here</a>.

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
<td><a href="licensee-services">Licensee Services</a></td>
<td><span markdown="1">`LIST` `GET` `CREATE` `UPDATE` `DELETE` `VALIDATE` `TRANSFER`</span></td>
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
