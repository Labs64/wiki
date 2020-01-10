---
layout: post
title: How to add additional data to the customer profile
parent: FAQ & Troubleshooting
nav_order: 100
description: "How to add additional data to the customer profile in NetLicensing UI."
permalink: faq-add-customer-data
---

{{ page.title }}
=============

## Question

Is it possible to add some additional data to the Customer profile in NetLicensing, which can be used by different departements and processes?

## Answer


<div>customerData</div>
{: .code-example .ml-5 .code-header }
```json
{
    "Address": {
        "Address": "Radlkoferstr. 2",
        "City": "Munich",
        "ZIP": "81373",
        "Country": "Germany"
    },
    "Business Info": {
        "VAT": "DE12345678",
        "CRM-ID": "1234",
        "Type": "LaaS"
    }
}
```
{: .ml-5 }

<a href="assets/images/faq-add-customer-data.png" class="imagelink" data-lightbox="customerData" data-title="customerData" data-alt="customerData">
  <img src="assets/images/faq-add-customer-data.png" width="60%" />
</a>

## See also
- [How to add tags to the customer using RESTful API](faq-add-licensee-customproperty)
