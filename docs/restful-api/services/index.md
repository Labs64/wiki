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
<a href="https://go.netlicensing.io/console/v2/content/register.xhtml" class="external-link">here</a>.

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
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
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></span></p></td>
</tr>
<tr class="even">
<td><a href="product-module-services">Product Module Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="odd">
<td><a href="license-template-services">License Template Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="even">
<td><a href="licensee-services">Licensee Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span><span class="status-macro aui-lozenge aui-lozenge-subtle">VALIDATE</span><span class="status-macro aui-lozenge aui-lozenge-subtle">TRANSFER</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="odd">
<td><a href="license-services">License Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span><br />
</span></p></td>
</tr>
<tr class="even">
<td><a href="transaction-services">Transaction Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span></td>
<td><p><span><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span><br />
</span></p></td>
</tr>
<tr class="odd">
<td><a href="token-services">Token Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="even">
<td><a href="payment-method-services">Payment Method Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="odd">
<td><a href="utility-services">Utility Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
</tbody>
</table>
