---
layout: default
title: "Zoho CRM Integration"
parent: CRM and Sales
grand_parent: Integrations
nav_order: 10
description: "See each customer's NetLicensing licenses inside Zoho CRM: the Labs64 extension from Zoho Marketplace links CRM accounts to NetLicensing customers."
permalink: zoho-crm
last_modified_at: 2026-11-08
---

{{ page.title }}
================

In short: the Labs64 NetLicensing extension, listed in Zoho Marketplace, adds a *Customer Number* field to Zoho CRM accounts and shows that customer's NetLicensing licenses in the CRM. It is the one ready-made CRM integration; other CRMs connect through webhooks and the REST API.

[Labs64 NetLicensing for Zoho CRM](https://marketplace.zoho.com/app/crm/labs64-netlicensing-extension-for-zoho-crm){:target="_blank"}{:rel="noopener"} integrates your customers' entitlements in NetLicensing with your CRM system. The extension adds a new "Customer Number" field to the Accounts module which will be used to retrieve all available licenses for a particular vendor.

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
    <img alt="NetLicensing Management Console customer page showing the customer number and its list of licenses" src="assets/images/zoho-screenshot3.png" />
</a>

#### NetLicensing API Key

The information kept in the NetLicensing can be retrieved using the RESTful API, where all the requests need to be authenticated using API Key.
A new API Key can be created at *"Settings - API Access"* page.

<a href="assets/images/zoho-screenshot4.png" class="imagelink" data-lightbox="zoho" data-title="NetLicensing API Key" data-alt="NetLicensing API Key">
    <img alt="NetLicensing Management Console API Access tab with the API key for Zoho CRM (role Analytics) highlighted" src="assets/images/zoho-screenshot4.png" />
</a>

#### Configure Zoho CRM

Created API Key need to be used in the Zoho CRM configuration for the variable *"API Key"*.

<a href="assets/images/zoho-screenshot5.png" class="imagelink" data-lightbox="zoho" data-title="Zoho: Configuration" data-alt="Zoho: Configuration">
    <img alt="Zoho CRM Variables page with the netlicensing__API_Key variable and its empty value field highlighted" src="assets/images/zoho-screenshot5.png" />
</a>

#### Zoho Account: Customer Number

Provide NetLicensing Customer Number in the corresponding Account field.

<a href="assets/images/zoho-screenshot1.png" class="imagelink" data-lightbox="zoho" data-title="Zoho: Customer Number" data-alt="Zoho: Customer Number">
    <img alt="Zoho CRM account page with the Customer Number field (CUST-CAD-01) highlighted" src="assets/images/zoho-screenshot1.png" />
</a>

Having this field filled, the licensing data will be retrieved and shown in the *"NetLicensing Licenses"* list.
#### Zoho Account: NetLicensing Licenses as related view

<a href="assets/images/zoho-screenshot2.png" class="imagelink" data-lightbox="zoho" data-title="Zoho: NetLicensing Licenses (related list)" data-alt="Zoho: NetLicensing Licenses (related list)">
    <img alt="Zoho CRM account page with the NetLicensing Licenses related list and the View Licenses link highlighted" src="assets/images/zoho-screenshot2.png" />
</a>

### References

- [Zoho CRM](https://go.zoho.com/ZLs){:target="_blank"}{:rel="nofollow"} <sup>*</sup> is an online Sales CRM software that manages your sales, marketing and support in one CRM platform. Sign up now and earn **$100 credits** instantly!
- [Management Console](https://ui.netlicensing.io) - NetLicensing Management Console

---

<sup>*</sup> this is an affiliate link; we get commissions for purchases made through this link at no extra cost to you.

## Example: the calls

The extension needs no code. To see the same customer data the CRM account shows, or to script around it, use the NetLicensing API with the *Customer Number* you entered in Zoho CRM:

```bash
NLIC=https://go.netlicensing.io/core/v2/rest
AUTH="apiKey:$NETLICENSING_API_KEY"   # ROLE_APIKEY_ANALYTICS is enough for reading

# The customer (licensee) behind the Zoho CRM account
curl --user $AUTH --header "Accept: application/json" $NLIC/licensee/IKWUYQ9GR

# What the customer may use now
curl --user $AUTH --header "Accept: application/json" --request POST $NLIC/licensee/IKWUYQ9GR/validate
```

The roles are listed under [API conventions](api-conventions#roles). These calls show the data; they do not describe how the extension itself queries NetLicensing.

