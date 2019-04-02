1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)

<span id="title-text"> Client Libraries and Sample Code </span>
===============================================================

Created by <span class="author"> Alexey Averikhin</span>, last modified
on 05-10-2019

The projects listed below are open source projects. Releases for these
projects will be listed on the corresponding project's download area.
Feel free to use the project's issue tracker to log bugs or feature
requests, and the project's wiki to share your tips and tricks.

Contributions to these projects are welcome: if you are interested in
contributing, don't hesitate to contact us:
<a href="http://netlicensing.io/contact" class="external-link">http://netlicensing.io/contact</a>.

 

Use the following client libraries and examples as a foundation for
integrating NetLicensing in your code. It will help you to understand
how to perform the validation, build the infrastructure to manage and
track licenses, perform various vendor administrative tasks, etc. using
the NetLicensing API. Choose any sample code below that is appropriate
for your environment.

Clients
-------

### Java

-   <a href="https://github.com/Labs64/NetLicensingClient-java" class="external-link">NetLicensingClient-java</a> -
    Java wrapper for NetLicensing RESTful API

### JavaScript

-   <a href="https://github.com/Labs64/NetLicensingClient-javascript" class="external-link">NetLicensingClient-javascript</a> -
    JavaScript wrapper for NetLicensing RESTful API

### Kotlin

-   <a href="https://github.com/Labs64/NetLicensingClient-kotlin" class="external-link">NetLicensingClient-kotlin</a> -
    Kotlin wrapper for NetLicensing RESTful API

### .NET

-   <a href="https://github.com/Labs64/NetLicensingClient-csharp" class="external-link">NetLicensingClient-csharp</a>
    - C\# wrapper for NetLicensing RESTful API

### PHP

-   <a href="https://github.com/Labs64/NetLicensingClient-php" class="external-link">NetLicensingClient-php</a> -
    PHP wrapper for NetLicensing RESTful API

### C++

-   <a href="https://github.com/Labs64/NetLicensingClient-cpp" class="external-link">NetLicensingClient-cpp</a> -
    C++ wrapper for NetLicensing RESTful API

### Command-line

-   [cURL code snippets](11010215.html) - please refer to the *"Try it
    now"* sections at NetLicensing API (RESTful) endpoints description

Integrations
------------

NetLicensing can be easily integrated with common *e-Commerce, billing
and subscription management* platforms, such as:

-   <a href="https://github.com/Labs64/NetLicensing-Gateway" class="external-link">NetLicensing-Gateway</a> -
    NetLicensing / eCommerce gateway
-   <a href="https://zapier.com/apps/netlicensing/integrations" class="external-link">NetLicensing-Zapier</a>
    -<span class="flex-auto mb-2"><span class="text-gray-dark mr-2">
    NetLicensing / Zapier Integration</span></span>
-   <a href="https://github.com/Labs64/NetLicensing-Gateway" class="external-link">NetLicensing-MyCommerce</a> - NetLicensing
    / MyCommerce integration
-   <a href="https://github.com/Labs64/NetLicensing-FastSpring" class="external-link">NetLicensing-FastSpring</a> - NetLicensing
    / FastSpring integration
-   <a href="https://github.com/Labs64/NetLicensing-PrestaShop" class="external-link">NetLicensing-PrestaShop</a> - NetLicensing
    Connector for PrestaShop
-   WordPress -
    <a href="https://wordpress.org/plugins/pluginpass-pro-plugintheme-licensing/" class="external-link">PluginPass: WordPress PRO Plugin/Theme Licensing</a>
-   WooCommerce

-   Magento

-   osCommerce

-   Drupal Commerce

-   Joomla (Plugins Licensing & Monetization)

-   Braintree
-   Cleverbridge
-   2Checkout -
    <a href="https://github.com/Labs64/NetLicensing-Gateway/issues/6" class="external-link">#6</a>
-   Zuora -
    <a href="https://github.com/Labs64/NetLicensing-Gateway/issues/4" class="external-link">#4</a>
-   SendOwl -
    <a href="https://github.com/Labs64/NetLicensing-Gateway/issues/5" class="external-link">#5</a>
-   Shopware
-   Recurly -
    <a href="https://github.com/Labs64/NetLicensing-Gateway/issues/3" class="external-link">#3</a>
-   billwerk
-   Fusebill
-   Paddle
-   Chargify
-   Price Intelligently
-   Chargebee
-   Rerun
-   jvZoo
-   PayKickstart
-   SaaSOptics
-   PaySimple
-   ChargeOver

Please refer to the
<a href="https://github.com/Labs64/NetLicensing-Gateway/wiki" class="external-link">typical integration scenario</a>,
which is showing how NetLicensing extending standard e-commerce flow
(using digital fulfilment) by enabling license management for the
digital products and services.

<span class="aui-icon icon-hint">Icon</span>

Depending on your business processes and distribution channels there
might be many different integration options. Please contact us via
<a href="mailto:netlicensing@labs64.com" class="external-link">netlicensing@labs64.com</a>
and we'll be happy to assist you defining best-fit integration scenario.

Online test application
-----------------------

-   <a href="https://netlicensing.io/NetLicensing-API/" class="external-link">NetLicensing API Test Center</a> -
    Test Labs64 NetLicensing RESTful API online
-   <a href="https://github.com/Labs64/NetLicensing-Demo" class="external-link">NetLicensing-Demo</a> -<span
    style="color: rgb(36,41,46);"> NetLicensing Demo Application</span>

Comments:
---------

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><span id="comment-14942577"></span>
<p>When are you guys planning to release c++ client for netlicensing.</p>
<div class="smallfont" data-align="left" style="color: #666666; width: 98%; margin-bottom: 10px;">
<img src="assets/images/icons/contenttypes/comment_16.png" width="16" height="16" /> Posted by at 20-02-2016 10:03
</div></td>
</tr>
<tr class="even">
<td><span id="comment-14942578"></span>
<p>Hello,<br />
We've already scheduled <a href="https://github.com/Labs64/NetLicensingClient-cpp" class="external-link">C++ wrapper for Labs64 NetLicensing RESTful API</a>; at least repository is already there ;)</p>
<p>In order to speed up this, we'd implement <a href="https://www.labs64.de/confluence/display/NLICPUB/Licensee+Services#LicenseeServices-Validatelicensee">Licensee.validate()</a> first; since this a minimal integration requirement, you will be able to start right away with the NetLicensing integration.</p>
<div class="smallfont" data-align="left" style="color: #666666; width: 98%; margin-bottom: 10px;">
<img src="assets/images/icons/contenttypes/comment_16.png" width="16" height="16" /> Posted by averikhin at 20-02-2016 10:20
</div></td>
</tr>
<tr class="odd">
<td><span id="comment-14942612"></span>
<p>Hello, if I want to use your product in a vb.net solution I suppose I can simply convert the C# code with available tools and be fine, right?</p>
<div class="smallfont" data-align="left" style="color: #666666; width: 98%; margin-bottom: 10px;">
<img src="assets/images/icons/contenttypes/comment_16.png" width="16" height="16" /> Posted by at 22-03-2016 21:56
</div></td>
</tr>
<tr class="even">
<td><span id="comment-14942613"></span>
<p>Sure, you can easily port NetLicesning C# client to VB.NET using one of C#-VB.NET converters or implement minimally needed licensee.validation() method by means of your programming language and environment.</p>
<p>Please refer to the validation method C# implementation:<br />
<a href="https://github.com/Labs64/NetLicensingClient-csharp/blob/master/NetLicensingClient/LicenseeService.cs#L85" class="external-link">https://github.com/Labs64/NetLicensingClient-csharp/blob/master/NetLicensingClient/LicenseeService.cs#L85</a></p>
<p>... as well as validation example:<br />
<a href="https://github.com/Labs64/NetLicensingClient-csharp/blob/master/NetLicensingClient-demo/NetLicensingClient-demo.cs#L259" class="external-link">https://github.com/Labs64/NetLicensingClient-csharp/blob/master/NetLicensingClient-demo/NetLicensingClient-demo.cs#L259</a></p>
<p>We will be glad to help you with your integration. Please contact us directly via <a href="mailto:netlicensing@labs64.com" class="external-link">netlicensing@labs64.com</a></p>
<div class="smallfont" data-align="left" style="color: #666666; width: 98%; margin-bottom: 10px;">
<img src="assets/images/icons/contenttypes/comment_16.png" width="16" height="16" /> Posted by averikhin at 23-03-2016 06:23
</div></td>
</tr>
<tr class="odd">
<td><span id="comment-14942712"></span>
<p>We are glad to announce the availability of a new version of <a href="https://github.com/Labs64/NetLicensingClient-cpp" class="external-link">C++ wrapper for NetLicensing RESTful API</a></p>
<p>Current version provides a good foundation for NetLicensing C++ integrations and allows sending of <a href="Licensee-Services_11010217.html">LicesenseeService.validate()</a> requests.</p>
<div class="smallfont" data-align="left" style="color: #666666; width: 98%; margin-bottom: 10px;">
<img src="assets/images/icons/contenttypes/comment_16.png" width="16" height="16" /> Posted by averikhin at 30-04-2016 09:09
</div></td>
</tr>
</tbody>
</table>

Document generated by Confluence on 04-11-2019 19:49

[Atlassian](http://www.atlassian.com/)
