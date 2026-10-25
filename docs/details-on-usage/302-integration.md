---
layout: default
title: "Integration: Call the NetLicensing API from Your Product"
nav_order: 3
nav_exclude: true
description: "Step 3 of getting started: call the validate method of the NetLicensing REST API from your product, and send customers to NetLicensing Shop with a shop token to buy or renew licenses."
permalink: integration
image: assets/images/NetLicensing-GettingStarted.png
---

[Step 1: Planning](planning) · [Step 2: Setting up](setting-up) · **Step 3: Integration**

Integration
===========

Integration of NetLicensing into your product has two aspects:

### NetLicensing API

Implement calls to the NetLicensing API in your code. [NetLicensing API reference](restful-api) and
[examples](client-libraries) will help
you. At minimum you need a call to the
[validate](licensee-services#validate-licensee)
method of the licensee services.

### NetLicensing Shop

Provide a link to [NetLicensing Shop](netlicensing-shop) in the UI of your product or forward the user to NetLicensing Shop URL by other means.  

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

 
[Step 1: Planning](planning) · [Step 2: Setting up](setting-up) · **Step 3: Integration**
