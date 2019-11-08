---
layout: default
title: Interation
parent: Getting Started
nav_order: 3
description: ""
permalink: integration
image: assets/images/11010226/NetLicensing-GettingStarted.png
---

[Step 1: Planning](planning) &nbsp;&nbsp; [Step 2: Setting up](setting-up) &nbsp;&nbsp; **Step 3: Integration**

Integration
===========

Integration of NetLicensing into your product has two aspects:

### NetLicensing API

Implement calls to the NetLicensing API in your code. [NetLicensing API
reference](11010215.html) and
[examples](client-libraries) will help
you. At minimum you need a call to the
[validate](Licensee-Services_11010217.html#LicenseeServices-Validatelicensee)
method of the licensee services.

### NetLicensing Shop

Provide a link to NetLicensing Shop in the UI of your product or forward
the user to NetLicensing Shop URL by other means.  
The URL of NetLicensing Shop has the following format:

``` theme:
https://go.netlicensing.io/shop/v2/?shoptoken={token}
```

`<token>`<span style="line-height: 1.4285715;"> must be obtained using
</span>[create token](token-services)<span
style="line-height: 1.4285715;"> service with
</span>`tokenType=SHOP`<span style="line-height: 1.4285715;">. The
Generate token service returns also the complete shop URL for
convenience.</span>

 
[Step 1: Planning](planning) &nbsp;&nbsp; [Step 2: Setting up](setting-up) &nbsp;&nbsp; **Step 3: Integration**
