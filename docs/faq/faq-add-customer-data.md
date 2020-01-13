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

Additional information can be added to any [NetLicensing entity](object-model) (including Customer/Licensee) using Custom Properties.
See [this FAQ](faq-add-licensee-customproperty) on how to use this.

Additionally, you can group customer information in the NetLicensing UI by adding JSON structure to the reserved Tag (Custom Property):

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

JSON content will be made accessible on the Customer profile as the separate tabs.

<a href="assets/images/changelog/netlicensing-customer-data-01.png" class="imagelink" data-lightbox="customerData" data-title="customerData definition" data-alt="customerData definition">
  <img src="assets/images/changelog/netlicensing-customer-data-01.png" width="100%" />
</a>

<a href="assets/images/changelog/netlicensing-customer-data-02.png" class="imagelink" data-lightbox="customerData" data-title="customerData" data-alt="customerData rendered - Address">
  <img src="assets/images/changelog/netlicensing-customer-data-02.png" width="100%" />
</a>

<a href="assets/images/changelog/netlicensing-customer-data-03.png" class="imagelink" data-lightbox="customerData" data-title="customerData" data-alt="customerData rendered - Business Info">
  <img src="assets/images/changelog/netlicensing-customer-data-03.png" width="100%" />
</a>

## See also
- [How to add tags to the customer using RESTful API](faq-add-licensee-customproperty)
