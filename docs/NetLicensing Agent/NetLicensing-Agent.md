1.  [NetLicensing Wiki](index.html)
2.  [Home](Home_11010214.html)

<span id="title-text"> NetLicensing Agent </span>
=================================================

Created by <span class="author"> Konstantin Korotkov</span>, last
modified on 03-11-2019

-   [Motivation](#NetLicensingAgent-Motivation)
-   [Legal Information](#NetLicensingAgent-LegalInformation)
-   [NetLicensing Agent](#NetLicensingAgent-NetLicensingAgent)
    -   [Files](#NetLicensingAgent-Files)
    -   [Command Line](#NetLicensingAgent-CommandLine)
    -   [Modes of Operation](#NetLicensingAgent-ModesofOperation)
    -   [Setting Up for the Offline
        Mode](#NetLicensingAgent-SettingUpfortheOfflineMode)
-   [Client Configuration](#NetLicensingAgent-ClientConfiguration)
-   [Security](#NetLicensingAgent-Security)
    -   [Execution Environment](#NetLicensingAgent-ExecutionEnvironment)
    -   [Smart Card](#NetLicensingAgent-SmartCard)
    -   [Networking](#NetLicensingAgent-Networking)
-   [Known Limitations](#NetLicensingAgent-KnownLimitations)
    -   [Licensing Models](#NetLicensingAgent-LicensingModels)
    -   [Entity Numbers](#NetLicensingAgent-EntityNumbers)
    -   [Licensee Auto-Create](#NetLicensingAgent-LicenseeAuto-Create)

<span class="aui-icon icon-warning">Icon</span>

This document assumes you're familiar with the Labs64 NetLicensing
service. If you need more info about NetLicensing, please
visit <a href="https://netlicening.io" class="external-link">https://netlicening.io</a>.

Motivation
==========

NetLicensing recommended operation mode is online validation. This mode
has many advantages:

-   Security: licensing assets are stored in a secure cloud database,
    licensee has no direct access to the assets
-   Traceability: license usage information is always up to date and
    available at any time
-   Flexibility: licensing assets can be adjusted by vendor at any time
    with immediate effect

Nevertheless, in some environments access to the NetLicensing cloud
services is not possible for technical or organizational reasons, such
as no internet connectivity or security restrictions. To enable
NetLicensing functionality even in such restricted environments, we
offer NetLicensing Agent - a standalone module, that is able to operate
without connectivity to the NetLicensing cloud services and responding
in a local network or on a local host to the validation requests same as
the NetLicensing cloud service does.

Legal Information
=================

Please read:

-   <a href="https://www.labs64.com/legal/terms-of-service/netlicensing" class="external-link">https://www.labs64.com/legal/terms-of-service/netlicensing</a>
-   <a href="https://www.labs64.com/legal/privacy-policy" class="external-link">https://www.labs64.com/legal/privacy-policy</a>

NetLicensing Agent
==================

NetLicensing Agent is a software component of Labs64 NetLicensing
service. Agent runs on a local server and responds to the validation
requests in place of NetLicensing, allowing operation in isolated
networks without connection to the Internet and the NetLicensing cloud
service.

NetLicensing Agent is a simple java command-line tool that only requires
JRE for its operation.

<img src="assets/images/icons/emoticons/warning.png" alt="(warning)" class="emoticon emoticon-warning" /> NetLicensing
Agent is only available in selected pricing plans. In case your pricing
plan does not include NetLicensing Agent, you'll get the message:

``` theme:
Payment required. Feature "NetLicensing Agent" is not allowed. Please upgrade your plan.
```

 Files
-----

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>File</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>netlicensing-agent-&lt;version&gt;.jar</code></td>
<td><p>Java executable. This is the only downloadable for the NetLicensing Agent. In addition you'll need Java 8 Runtime (JRE). During execution Agent creates a local database in the 'database/' subdirectory of the directory, from where it is executed (working directory). Ensure to execute the Agent always from the same working directory, so it finds its database files.</p></td>
</tr>
<tr class="even">
<td><p><code>database/*</code></p>
<p><code>.assets</code></p></td>
<td>Database files. Created and maintained by the agent. You may want to include this in a backup of the host running the agent. It is recommended to stop the agent when creating a backup copy / snapshot of the database files to ensure backup integrity.</td>
</tr>
<tr class="odd">
<td><code>{n}_netlicensing-assets.xml</code></td>
<td>File(s) with exported assets. <span>Created</span> by the agent. Contain sensitive information, care to be taken when copying / transferring these files.</td>
</tr>
</tbody>
</table>

Command Line
------------

Syntax:

``` theme:
java -jar netlicensing-agent.jar --help
java -jar netlicensing-agent.jar --version
java -jar netlicensing-agent.jar --action=<action> [options]
```

Command line options:

<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<thead>
<tr class="header">
<th>Option</th>
<th>Long option</th>
<th>Default value</th>
<th><p>Description</p></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><pre><code>-h</code></pre></td>
<td><pre><code>--help</code></pre></td>
<td> </td>
<td><p>Print help screen and exit.</p></td>
</tr>
<tr class="even">
<td><pre><code>-v</code></pre></td>
<td><pre><code>--version</code></pre></td>
<td> </td>
<td><p>Print the version of the application and exit.</p></td>
</tr>
<tr class="odd">
<td><pre><code>-a</code></pre></td>
<td><pre><code>--action</code></pre></td>
<td> </td>
<td><p>Action to perform. Available actions:</p>
<ul>
<li><p><code>run-agent</code> - run as a caching proxy to the NetLicensing Cloud;</p></li>
<li><p><code>run-agent-offline</code> - run in offline mode, using assets from the local database;</p></li>
<li><p><strong><code>export-assets</code></strong><br />
- export assets from the NetLicensing Cloud to the local file(s);</p></li>
<li><p><strong><code>import-assets</code></strong><br />
- import assets to the local database from the local file(s) created with <strong><code>export-assets</code></strong>.</p></li>
</ul></td>
</tr>
<tr class="even">
<td> </td>
<td><pre><code>--core.base.host</code></pre></td>
<td><pre><code>https://go.netlicensing.io</code></pre></td>
<td><p>NetLicensing Cloud host, including protocol and port, if necessary. Used for <strong><code>export-assets</code></strong>.</p></td>
</tr>
<tr class="odd">
<td><pre><code>-u</code></pre></td>
<td><pre><code>--nlic.username</code></pre></td>
<td> </td>
<td><p>Vendor username at NetLicensing Cloud. Required for <strong><code>export-assets</code></strong>.</p></td>
</tr>
<tr class="even">
<td><pre><code>-p</code></pre></td>
<td><pre><code>--nlic.password</code></pre></td>
<td> </td>
<td><p>Vendor password at NetLicensing Cloud. Required for <strong><code>export-assets</code></strong>.</p></td>
</tr>
<tr class="odd">
<td> </td>
<td><p><code>--port</code></p></td>
<td><pre><code>8080</code></pre></td>
<td><p>TCP port the NetLicensing Agent will listen on. Used for <strong><code>run-agent</code></strong> and <strong><code>run-agent-offline</code></strong>.</p></td>
</tr>
<tr class="even">
<td><pre><code>-o</code></pre></td>
<td><pre><code>--output</code></pre></td>
<td>.</td>
<td><p>Local directory where output files of <strong><code>export-assets</code></strong> to be saved.</p></td>
</tr>
<tr class="odd">
<td><pre><code>-i</code></pre></td>
<td><pre><code>--input</code></pre></td>
<td>.</td>
<td><p>Input files for <strong><code>import-assets</code></strong> to be read from this local directory.</p></td>
</tr>
<tr class="even">
<td><pre><code>-l</code></pre></td>
<td><pre><code>--licensees</code></pre></td>
<td> </td>
<td><p>Comma-separated list of licensee numbers targeted for <code>export-assets</code>. Required for <strong><code>export-assets</code></strong>.</p></td>
</tr>
<tr class="odd">
<td><pre><code>-f</code></pre></td>
<td><pre><code>--force</code></pre></td>
<td> </td>
<td><p>Ignore conflicts on <strong><code>export-assets</code></strong> or <strong><code>import-assets</code></strong>.</p></td>
</tr>
<tr class="even">
<td> </td>
<td><p><strong><code>--serial-number</code></strong></p></td>
<td> </td>
<td><p>Specify smart card serial number for <strong><code>export-assets</code></strong>. <span>Required for </span><strong><code>export-assets</code></strong><span>, unless </span><strong><code>--without-card</code></strong> is used.</p></td>
</tr>
<tr class="odd">
<td> </td>
<td><p><strong><code>--without-card</code></strong></p></td>
<td> </td>
<td><p>Don't use the smart card. Can be used for <strong><code>export-assets</code></strong>, <strong><code>import-assets</code></strong>, <strong><code>run-agent-offline</code></strong>.</p></td>
</tr>
<tr class="even">
<td> </td>
<td><p><strong><code>--verbose</code></strong></p></td>
<td> </td>
<td><p>Enable detailed log output to the console.</p></td>
</tr>
</tbody>
</table>

Modes of Operation
------------------

Agent runs in different modes depending on the requested 'action':

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Action</th>
<th>Mode description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><pre><code>export-assets</code></pre></td>
<td>Downloads assets from the NetLicensing cloud service and saves it to a local file. This file should be transferred together with the agent executable to the disconnected environment for offline operation.</td>
</tr>
<tr class="even">
<td><pre><code>import-assets</code></pre></td>
<td>Import assets from the local file (created with 'export-assets') to the local database. This is a preparation step for the offline operation mode.</td>
</tr>
<tr class="odd">
<td><pre><code>run-agent-offline</code></pre></td>
<td>Offline server mode, NetLicensing Agent runs as local server and responds to 'validate' calls from clients same as the main NetLicensing service.</td>
</tr>
<tr class="even">
<td><pre><code>run-agent</code></pre></td>
<td><p>Runs as a caching proxy, connecting to the main NetLicensing service if available, and responding with the last known state when connectivity is not available. This mode is meant for the environments that may have only occasional or unstable connection to the internet.</p>
<div class="aui-message warning shadowed information-macro">
<span class="aui-icon icon-warning">Icon</span>
<div class="message-content">
Currently this mode has limited support and should not be used in production environment.
</div>
</div></td>
</tr>
</tbody>
</table>

     

Setting Up for the Offline Mode
-------------------------------

1.  Prepare licensing assets same way as you would do for normal
    NetLicensing operation as a cloud service.

2.  Download NetLicensing Agent, note serial number of the smart card
    (provided with smart card).

3.  On a workstation having Internet connection with access to the
    NetLicensing Cloud, execute Agent to export assets from the
    NetLicensing Cloud to the local file:

    ``` theme:
    java -jar netlicensing-agent.jar --action=export-assets --nlic.username=<username> --nlic.password=<password> --licensees=<licensee>[,...] --serial-number=<serial number>
    ```

    Agent binds exported licensees to the smart card with provided
    serial number, and creates one or more transfer files with the name
    '`{n}_netlicensing-assets.xml`' in the current working directory,
    where *`{n}`* is a sequential number. Smart card must not be present
    at this step, however in case you plan to work without smart card,
    add '`--without-card`' option, see also note below.

4.  Transfer files created at step 3 and the NetLicensing Agent
    executable jar to the target disconnected environment. Save on the
    target server in a working directory of your choice, take care of
    access security for the directory! Ensure Java 8 JRE is configured
    on the target server.

5.  Execute Agent with '`import-assets`' action, while in the working
    directory. <img src="assets/images/icons/emoticons/warning.png" alt="(warning)" class="emoticon emoticon-warning" /> Requires
    smart card (see note below).

    ``` theme:
    java -jar netlicensing-agent.jar --action=import-assets
    ```

    Agent creates local database in the working directory, and imports
    assets from the transfer files into the new database. After
    successful execution, the transfer files
    '`{n}_netlicensing-assets.xml`' can be removed. Do not delete or
    alter the content of the created files belonging to the local
    database!

6.  <span style="color: rgb(0,0,0);"><span
    style="color: rgb(0,0,0);">Staying in the same working directory as
    in step 5, s</span>tart Agent to serve
    offline. <img src="assets/images/icons/emoticons/warning.png" alt="(warning)" class="emoticon emoticon-warning" /> Requires
    smart card (see note below).</span>

    ``` theme:
    java -jar netlicensing-agent.jar --action=run-agent-offline --port=8080
    ```

    With this action the agent will keep running and listening on the
    specified port until stopped by SIGINT (Ctrl-C). Make sure firewall,
    if any, allows this connection. Also read the article [Securing the
    Agent with SSL/TLS](17432748.html).

 

 

Requires smart card

<span class="aui-icon icon-warning">Icon</span>

<span style="color: rgb(0,0,0);">If using smart card, be
sure</span><span style="color: rgb(0,0,0);"> it</span><span
style="color: rgb(0,0,0);"> is attached, see also [Preparing to work
with smart card](Preparing-to-work-with-smart-card_17433126.html).
I<span style="color: rgb(0,0,0);">f working without smart card,</span>
use **`--without-card`** option.</span>

 

Steps 3-5 can be repeated to update licensing assets after changes have
been made on the NetLicensing Cloud.

Client Configuration
====================

Client should be configured to point to the local server running
NetLicensing Agent (port 8080 by default) instead of main NetLicensing
service, i.e. API base URL changes from:

``` theme:
https://go.netlicensing.io/core/v2/rest/...
```

to:

``` theme:
http://yourhost:8080/rest/...
```

NetLicensing Agent will respond to the validation requests. Parameters
have the same format as described in the [NetLicensing
API](Licensee-Services_11010217.html).

Security
========

Execution Environment
---------------------

Having export file and the agent executable it is possible to create
unlimited number of agent instances with the same set of assets.
Besides, today's virtualized environments allow easy cloning of virtual
machines, which allows to create exact copy of a NetLicensing Agent
instance including all licensing assets even without having an export
file. This risk can be significantly reduced by a
controlled installation of NetLicensing Agent at customer premises on a
host properly protected against tampering using up-to-date HW/SW
security measures, including secure networking (see below). 

Smart Card
----------

In some cases fully controlled installation of NetLicensing Agent is not
possible, or it is desired to install Agent in a virtual environment, in
which case user gets access to the NetLicening Agent executable /
database files. To keep security even in these cases, NetLicensing Agent
offers protection with smart card. Smart card protects from the Agent
cloning, as well as from attempts to revert the use counters / time
accounting by restoring the environment from an older snapshot. Note
that the communication security (see below) is still important,
therefore we recommend a controlled installation even when using the
smart card.

Networking
----------

NetLicensing Agent by itself do not provide any security for the
communication with the client. This leaves the possibility of mangling
the responses sent by the agent. To eliminate this risk, in addition to
controlled installation of the agent on a secured host and/or using
smart card security we recommend to setup agent behind HTTPS reverse
proxy. Reverse proxy and SSL support is available as a standard
functionality in most popular HTTP frontends Apache, NGINX and IIS.
Please refer to [Securing the Agent with SSL/TLS](17432748.html) for
details.

Known Limitations
=================

Licensing Models
----------------

On repeated export/import operation for the assets, NetLicensing Agent
performs merging of changes made in the NetLicensing Cloud (master copy)
into the current state of the Agent local database to ensure
Agent functioning as close as possible to the NetLicensing Cloud.
Nevertheless, the logic of some Licensing Models in Agent may differ
from that of the NetLicensing Cloud, as summarized below.

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th>Licensing Model</th>
<th>Deviation from the model logic if assets import repeated</th>
<th>Recommendation</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Try &amp; Buy</td>
<td><span>Trial period may start over, however if perpetual license purchased in the mean time, the model will keep functioning properly.</span></td>
<td><p>Option 1: To mitigate the problem with the trial period starting over, set the trial license startDate explicitly before performing the export.</p>
<p>Option 2: Only update if perpetual license was purchased after initial export.</p></td>
</tr>
<tr class="even">
<td>Subscription</td>
<td>Licenses having initially no startDate set will lose any startDate that was set during agent operation. This may lead to increased subscription period after import.</td>
<td>Ensure startDate is set explicitly before performing the export.</td>
</tr>
<tr class="odd">
<td>Rental</td>
<td><span>See <em>Subscription.</em></span></td>
<td>See <em>Subscription.</em></td>
</tr>
<tr class="even">
<td>Floating</td>
<td><span>All sessions will be treated by the server as checked in, making possible to run higher number of sessions for up to maxCheckoutValidity time period after fresh import.</span></td>
<td><ul>
<li>Keep maxCheckoutValidity short enough to minimize the impact.</li>
<li>In case increased number of simultaneous session should be avoided by all means, keep agent shut down for maxCheckoutValidity period upon new import to let existing sessions expire.</li>
</ul></td>
</tr>
<tr class="odd">
<td>Multi-Feature</td>
<td><span>No deviation</span></td>
<td>-</td>
</tr>
<tr class="even">
<td>Pay-per-Use</td>
<td>All used quantity values will be lost.</td>
<td>Avoid using this model with the Agent v2.3.9.</td>
</tr>
<tr class="odd">
<td>Quota</td>
<td><span>No deviation</span></td>
<td>-</td>
</tr>
</tbody>
</table>

Entity Numbers
--------------

Although NetLicensing Cloud allows to use almost any character in entity
numbers, do not use the following characters for entities exported to
NetLicensing Agent, as it will conflict with export/import procedures:

-   comma - **,**
-   semicolon - **;**

Licensee Auto-Create
--------------------

NetLicensing Agent does not support licensee auto-create.

Document generated by Confluence on 04-11-2019 19:49

[Atlassian](http://www.atlassian.com/)
