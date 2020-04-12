---
layout: post
title: How to create a new License programmatically
parent: FAQ & Troubleshooting
nav_order: 100
description: "How to create a new License programmatically"
permalink: faq-create-license-programmatically
---

{{ page.title }}
=============

## Question

How do I create a new License programmatically using NetLicensing RESTfull API?

## Answer

Use [LicenseService.create()](license-services#create-license) method to create a new License entity and assign this to a particular Customer (Licensee entity).

This method has a set of attributes to be provided, incl. 2 mandatory attributes:

- `licenseeNumber` (string) - Unique Licensee (Customer) number to assign new License object
- `licenseTemplateNumber` (string) - LicenseTemplate number to be used as a template for the new License

There are two ways how to retrieve the `licenseTemplateNumber`.

### Option 1: via RESTful API - LicenseTemplateService.list()

Use this option to retrieve the [list of all created LicenseTemplate objects](license-template-services#license-templates-list), so you can identify the needed entity and it's `number` attribute.

<div>License templates list response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context">
  <ns2:infos/>
  <ns2:items pagenumber="0" itemsnumber="22" totalpages="1" totalitems="22" hasnext="false">
    <ns2:item type="LicenseTemplate">
      <ns2:property name="number">EO2M3LWBD1-DEMO</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="name">1 month subscription</ns2:property>
      <ns2:property name="licenseType">TIMEVOLUME</ns2:property>
      <ns2:property name="price">5.00</ns2:property>
      <ns2:property name="currency">EUR</ns2:property>
      <ns2:property name="automatic">false</ns2:property>
      <ns2:property name="hidden">false</ns2:property>
      <ns2:property name="hideLicenses">false</ns2:property>
      <ns2:property name="productModuleNumber">MTYWTJ3BL-DEMO</ns2:property>
      <ns2:property name="productModuleName">Subscription</ns2:property>
      <ns2:property name="inUse">false</ns2:property>
      <ns2:property name="timeVolumePeriod">MONTH</ns2:property>
      <ns2:property name="timeVolume">1</ns2:property>
    </ns2:item>
    ...
    <ns2:item type="LicenseTemplate">
      <ns2:property name="number">EUJK1BXQ52-DEMO</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="name">3 month subscription</ns2:property>
      <ns2:property name="licenseType">TIMEVOLUME</ns2:property>
      <ns2:property name="price">12.00</ns2:property>
      <ns2:property name="currency">EUR</ns2:property>
      <ns2:property name="automatic">false</ns2:property>
      <ns2:property name="hidden">false</ns2:property>
      <ns2:property name="hideLicenses">false</ns2:property>
      <ns2:property name="productModuleNumber">MTYWTJ3BL-DEMO</ns2:property>
      <ns2:property name="productModuleName">Subscription</ns2:property>
      <ns2:property name="inUse">false</ns2:property>
      <ns2:property name="timeVolumePeriod">MONTH</ns2:property>
      <ns2:property name="timeVolume">3</ns2:property>
    </ns2:item>
    ...
    <ns2:item type="LicenseTemplate">
      <ns2:property name="number">EXQWLMX7D0-DEMO</ns2:property>
      <ns2:property name="active">true</ns2:property>
      <ns2:property name="name">10-day subscription (initial)</ns2:property>
      <ns2:property name="licenseType">TIMEVOLUME</ns2:property>
      <ns2:property name="price">0.00</ns2:property>
      <ns2:property name="currency">EUR</ns2:property>
      <ns2:property name="automatic">true</ns2:property>
      <ns2:property name="hidden">true</ns2:property>
      <ns2:property name="hideLicenses">false</ns2:property>
      <ns2:property name="productModuleNumber">MTYWTJ3BL-DEMO</ns2:property>
      <ns2:property name="productModuleName">Subscription</ns2:property>
      <ns2:property name="inUse">true</ns2:property>
      <ns2:property name="timeVolume">10</ns2:property>
    </ns2:item>
  </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }

### Option 2: via NetLicensing UI

Open customer details view you want to assign a new license and click on the *"Add license"* button. In the *"Create License"* view choose *Module* and expand *Package* drop-down list.

The entities in this list will be named using LicenseTemplate `name` and `number` fields.

<a href="assets/images/faq-create-license-programmatically.png" class="imagelink" data-lightbox="multiple-licensing-models" data-title="Retrieve LicenseTemplate number" data-alt="Retrieve LicenseTemplate number">
  <img src="assets/images/faq-create-license-programmatically.png" />
</a>
