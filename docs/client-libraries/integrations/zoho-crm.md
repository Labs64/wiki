---
layout: default
title: NetLicensing Extension for Zoho CRM
parent: Integrations
grand_parent: Client Libraries & Integrations
nav_order: 10
description: "Connect NetLicensing customers and Zoho CRM"
permalink: zoho-crm
---

{{ page.title }}
================

[Labs64 NetLicensing for Zoho CRM](https://marketplace.zoho.com/crm/labs64-netlicensing-extension-for-zoho-crm){:target="_blank"}{:rel="noopener nofollow"} integrates your customers' entitlements in NetLicensing with your CRM system. The extension adds a new "Customer Number" field to the Accounts module which will be used to retrieve all available licenses for a particular vendor.

### Key Features
- Use Zoho CRM as one-stop-shop to maintain customers' licensing
- Connect Zoho CRM account profile with NetLicensing customer
- Get licensing details for invoices from Labs64 NetLicensing
- Shortcut to open customer profile in NetLicensing

### Configuration

#### NetLicensing Licenses View

The Customer view at NetLicensing [Management Console](https://ui.netlicensing.io) showing Customer profile with all associated Licenses.
Having this information in Zoho CRM would connect CRM and Licence Management system and significantly improve vendors workflow.

<a href="assets/images/zoho-screenshot3.png" class="imagelink" data-lightbox="zoho" data-title="NetLicensing Licenses" data-alt="NetLicensing Licenses">
    <img src="assets/images/zoho-screenshot3.png" />
</a>

#### NetLicensing API Key

The information kept in the NetLicensing can be retrieved using the RESTful API, where all the requests need to be authenticated using API Key.
A new API Key can be created at *"Settings - API Access"* page.

<a href="assets/images/zoho-screenshot4.png" class="imagelink" data-lightbox="zoho" data-title="NetLicensing API Key" data-alt="NetLicensing API Key">
    <img src="assets/images/zoho-screenshot4.png" />
</a>

#### Configure Zoho CRM

Created API Key need to be used in the Zoho CRM configuration for the variable *"API Key"*.

<a href="assets/images/zoho-screenshot5.png" class="imagelink" data-lightbox="zoho" data-title="Zoho: Configuration" data-alt="Zoho: Configuration">
    <img src="assets/images/zoho-screenshot5.png" />
</a>

#### Zoho Account: Customer Number

Provide NetLicensing Customer Number in the corresponding Account field.

<a href="assets/images/zoho-screenshot1.png" class="imagelink" data-lightbox="zoho" data-title="Zoho: Customer Number" data-alt="Zoho: Customer Number">
    <img src="assets/images/zoho-screenshot1.png" />
</a>

Having this field filled, the licensing data will be retrieved and shown in the *"NetLicensing Licenses"* list.
#### Zoho Account: NetLicensing Licenses as related view

<a href="assets/images/zoho-screenshot2.png" class="imagelink" data-lightbox="zoho" data-title="Zoho: NetLicensing Licenses (related list)" data-alt="Zoho: NetLicensing Licenses (related list)">
    <img src="assets/images/zoho-screenshot2.png" />
</a>
