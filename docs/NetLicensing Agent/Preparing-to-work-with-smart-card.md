---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Preparing to work with smart card
================================================================

by <span class="editor"> Konstantin Korotkov</span> on 22-10-2018

-   [General
    information](#Preparingtoworkwithsmartcard-Generalinformation)
-   [Linux-based OS](#Preparingtoworkwithsmartcard-Linux-basedOS)
    -   [Known issues](#Preparingtoworkwithsmartcard-Knownissues)

<span class="aui-icon icon-warning">Icon</span>

This document assumes you're familiar with the Labs64 NetLicensing
service. If you need more info about NetLicensing, please
visit <a href="https://netlicensing.io/" class="external-link">https://netlicensing.io</a>.

General information
===================

Before using NetLicensing Agent with any of the functions requiring
smart card, you must prepare the PC to recognize the smart card.

Preparation depends on the operating system:

| OS                                  | Smart card support                                                                   |
|-------------------------------------|--------------------------------------------------------------------------------------|
| Windows 7 SP1 and above             | Supported, no extra steps requires                                                   |
| macOS High Sierra (10.13) and above | Supported, no extra steps requires                                                   |
| Linux-based OS                      | Supported, requires installation of additional components, follow instructions below |

 

<span style="color: rgb(64,15,0);font-size: 24.0px;">Linux-based OS</span>
==========================================================================

To work with smart card on Linux the following packages are required:

 

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>pcscd</strong></td>
<td><p>PC/SC <span style="color: rgb(34,34,34);">(short for "Personal Computer/Smart Card") d</span>aemon</p></td>
</tr>
<tr class="even">
<td><strong>libpcsclite1</strong></td>
<td><p>Middleware to access a smart card using PC/SC </p></td>
</tr>
<tr class="odd">
<td><strong>libccid</strong> (<span>&gt;= 1.3.11)</span></td>
<td><span style="color: rgb(34,34,34);">PC/SC driver for the USB smart card readers compliant to the CCID protocol</span></td>
</tr>
</tbody>
</table>

To install the required packages use the following commands:

-   For Linux distributions using Debian package management with APT
    toolset (Ubuntu, Debian, Linux Mint, etc.)

    ``` theme:
    $ sudo apt-get install libccid pcscd libpcsclite1
    ```

<!-- -->

-   For Linux distributions using RPM Package Manager with YUM
    toolset (RedHat, CentOS, Fedora, etc.)

    ``` theme:
    $ sudo yum install ccid pcsc-lite-devel
    ```

Known issues
------------

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th>Issue</th>
<th>Cause</th>
<th>Solution</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p><span style="color: rgb(0,0,0);">NetLicensing Agent gives the following error:</span></p>
<div class="code panel pdl" style="border-width: 1px;">
<div class="codeContent panelContent pdl">
<pre class="theme: Confluence; brush: java; gutter: false" style="font-size:12px;"><code>Could not find a reader with a card.</code></pre>
</div>
</div></td>
<td>PC/SC daemon is not running</td>
<td><p>Execute:</p>
<div class="code panel pdl" style="border-width: 1px;">
<div class="codeContent panelContent pdl">
<pre class="theme: Confluence; brush: text; gutter: false" style="font-size:12px;"><code>$ sudo service pcscd start</code></pre>
</div>
</div></td>
</tr>
</tbody>
</table>




 

<span style="white-space: pre-wrap;">  
</span>
