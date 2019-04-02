1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)
3.  [NetLicensing API (RESTful)](11010215.html)

<span id="title-text"> Services </span>
=======================================

Created by <span class="author"> Alexey Averikhin</span>, last modified
on 22-11-2018

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
<th>Supported authentication method <a href="Security_14942718.html">(?)</a></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p><a href="https://www.labs64.de/confluence/display/NLICPUB/Product+Services">Product Services</a></p></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></span></p></td>
</tr>
<tr class="even">
<td><a href="https://www.labs64.de/confluence/display/NLICPUB/Product+Module+Services">Product Module Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="odd">
<td><a href="https://www.labs64.de/confluence/display/NLICPUB/License+Template+Services">License Template Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="even">
<td><a href="https://www.labs64.de/confluence/display/NLICPUB/Licensee+Services">Licensee Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span><span class="status-macro aui-lozenge aui-lozenge-subtle">VALIDATE</span><span class="status-macro aui-lozenge aui-lozenge-subtle">TRANSFER</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="odd">
<td><a href="https://www.labs64.de/confluence/display/NLICPUB/License+Services">License Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span><br />
</span></p></td>
</tr>
<tr class="even">
<td><a href="https://www.labs64.de/confluence/display/NLICPUB/Transaction+Services">Transaction Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span></td>
<td><p><span><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span><br />
</span></p></td>
</tr>
<tr class="odd">
<td><a href="https://www.labs64.de/confluence/display/NLICPUB/Token+Services">Token Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-complete aui-lozenge-subtle">CREATE</span><span class="status-macro aui-lozenge aui-lozenge-error aui-lozenge-subtle">DELETE</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="even">
<td><a href="https://www.labs64.de/confluence/display/NLICPUB/Payment+Method+Services">Payment Method Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span><span class="status-macro aui-lozenge aui-lozenge-subtle">GET</span><span class="status-macro aui-lozenge aui-lozenge-current aui-lozenge-subtle">UPDATE</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
<tr class="odd">
<td><a href="https://www.labs64.de/confluence/display/NLICPUB/Utility+Services">Utility Services</a></td>
<td><span class="status-macro aui-lozenge aui-lozenge-success aui-lozenge-subtle">LIST</span></td>
<td><p><span class="status-macro aui-lozenge aui-lozenge-subtle">BASIC AUTH</span><span class="status-macro aui-lozenge aui-lozenge-subtle">APIKEY</span></p></td>
</tr>
</tbody>
</table>

Document generated by Confluence on 04-11-2019 19:49

[Atlassian](http://www.atlassian.com/)
