---
layout: default
title: How to license product using multiple licensing models
parent: FAQ & Troubleshooting
nav_order: 100
description: "How to license product using multiple licensing models"
permalink: faq-multiple-licensing-models
---

{{ page.title }}
=============

## Question

We distribute our product on a subscription basis and want to upsell some premium features. How can we achieve this with NetLicensing?

## Answer

Ability to use multiple licensing models in one product configuration is one of the unique NetLicensing features.

Follow this guide to configure the product using Subscription and Multi-Feature licensing models.

- Add a new product or use <a href="https://ui.netlicensing.io/#/demo-data" target="_blank" class="external-link">demo data</a> view to speed-up product creation.
- Add the first module and choose [Subscription](subscription) model. Add some packages (e.g. *1-week* default and *1-month*).
- Add the second module and choose [Multi-Feature](multi-feature) model. Add some feature packages (e.g. *"Feature BI"* default and *"Backup"*).

Your final product configuration should be similar to this one.

<a href="assets/images/faq-multiple-licensing-models.png" class="imagelink" data-lightbox="multiple-licensing-models" data-title="Configure product using different licensing models" data-alt="Configure product using different licensing models">
  <img src="assets/images/faq-multiple-licensing-models.png" />
</a>


The validation response will return the customer status per module:

<div>Request</div>
{: .code-example .ml-5 .code-header }
```shell
$ curl -X POST --header 'Content-Type: application/x-www-form-urlencoded' --header 'Accept: application/xml' --header 'Authorization: Basic ZGVtbzpkZW1v' -d 'productNumber=PM8DA463B-DEMO' 'https://go.netlicensing.io/core/v2/rest/licensee/CUST-MM-01/validate' | xmllint --format -
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context" ttl="2020-04-02T12:23:50.738Z">
  <ns2:infos/>
  <ns2:items>
    <ns2:item type="ProductModuleValidation">
      <ns2:property name="productModuleNumber">MMX6HXDSZ</ns2:property>
      <ns2:property name="productModuleName">Upsell Features</ns2:property>
      <ns2:property name="licensingModel">MultiFeature</ns2:property>
      <ns2:list name="FEATURE-BI">
        <ns2:property name="valid">true</ns2:property>
        <ns2:property name="featureName">BI &amp; Reporting</ns2:property>
      </ns2:list>
      <ns2:list name="FEATURE-BCK">
        <ns2:property name="valid">false</ns2:property>
        <ns2:property name="featureName">Backup</ns2:property>
      </ns2:list>
    </ns2:item>
    <ns2:item type="ProductModuleValidation">
      <ns2:property name="productModuleNumber">MTYWTJ3BL-DEMO</ns2:property>
      <ns2:property name="valid">true</ns2:property>
      <ns2:property name="expires">2020-04-12T11:23:50.738Z</ns2:property>
      <ns2:property name="productModuleName">Subscription</ns2:property>
      <ns2:property name="licensingModel">Subscription</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }
