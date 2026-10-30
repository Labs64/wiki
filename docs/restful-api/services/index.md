---
layout: default
title: Services
parent: NetLicensing REST API Reference
nav_order: 10
has_children: true
description: "Overview of the NetLicensing REST API services: products, product modules, license templates, licensees, licenses, bundles, tokens, transactions, payment methods and utilities."
permalink: services
last_modified_at: 2026-10-30
---

<link rel="stylesheet" href="{{ '/assets/css/http-methods.css' | relative_url }}">

Services
========

NetLicensing exposes all available services functionality via an Application Programming Interface (API).

Using the NetLicensing REST API you can access programmatically all NetLicensing public functions and fully automate your licensing flow: from issuing and validating customer's entitlements to managing NetLicensing assets and interface with your in-house systems, such as CRM, ERP, e-Commerce, etc.
However, in most of the integration scenarios, you will need only a smaller subset of [essential methods](restful-api#essentials), first of all [Validate licensee](licensee-services#validate-licensee).

Most of the applications will use one of the existing [wrapper libraries](client-libraries) in the language of your choice, but it's important to familiarize yourself with the underlying API HTTP methods first.

All services accept Basic authentication (vendor account) and API keys. The **Role** column shows the lowest [API key role](api-conventions#roles) that may call an endpoint; "+" means that role and every higher one. Paths are relative to `https://go.netlicensing.io/core/v2/rest`, and every call can be tried in the [API Test Center](https://netlicensing.io/NetLicensing-API/).

To access the API methods you will need a NetLicensing vendor account. If you do not have one already, <a href="https://ui.netlicensing.io/#/register" class="external-link">sign up here</a>.

[Product Services](product-services)
------------------------------------

Products are the top-level entities that hold your product modules, licensees and discounts.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/product`](product-services#products-list) | List products | Licensee+ |
| <span class="http-method get">GET</span> [`/product/{productNumber}`](product-services#get-product) | Get product | Licensee+ |
| <span class="http-method post">POST</span> [`/product`](product-services#create-product) | Create product | Maintenance+ |
| <span class="http-method post">POST</span> [`/product/{productNumber}`](product-services#update-product) | Update product | Maintenance+ |
| <span class="http-method delete">DELETE</span> [`/product/{productNumber}`](product-services#delete-product) | Delete product | Maintenance+ |

[Product Module Services](product-module-services)
--------------------------------------------------

Product modules are the licensable parts of a product. Each module uses one licensing model.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/productmodule`](product-module-services#product-modules-list) | List product modules | Analytics+ |
| <span class="http-method get">GET</span> [`/productmodule/{productModuleNumber}`](product-module-services#get-product-module) | Get product module | Analytics+ |
| <span class="http-method post">POST</span> [`/productmodule`](product-module-services#create-product-module) | Create product module | Maintenance+ |
| <span class="http-method post">POST</span> [`/productmodule/{productModuleNumber}`](product-module-services#update-product-module) | Update product module | Maintenance+ |
| <span class="http-method delete">DELETE</span> [`/productmodule/{productModuleNumber}`](product-module-services#delete-product-module) | Delete product module | Maintenance+ |

[License Template Services](license-template-services)
------------------------------------------------------

License templates define what a license grants (type, price, currency) within a product module.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/licensetemplate`](license-template-services#license-templates-list) | List license templates | Analytics+ |
| <span class="http-method get">GET</span> [`/licensetemplate/{licenseTemplateNumber}`](license-template-services#get-license-template) | Get license template | Analytics+ |
| <span class="http-method post">POST</span> [`/licensetemplate`](license-template-services#create-license-template) | Create license template | Maintenance+ |
| <span class="http-method post">POST</span> [`/licensetemplate/{licenseTemplateNumber}`](license-template-services#update-license-template) | Update license template | Maintenance+ |
| <span class="http-method delete">DELETE</span> [`/licensetemplate/{licenseTemplateNumber}`](license-template-services#delete-license-template) | Delete license template | Maintenance+ |

[Licensee Services](licensee-services)
--------------------------------------

Licensees are your customers' installations or users. Includes license validation and transfer.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/licensee`](licensee-services#licensees-list) | List licensees | Analytics+ |
| <span class="http-method get">GET</span> [`/licensee/{licenseeNumber}`](licensee-services#get-licensee) | Get one licensee | Licensee+ |
| <span class="http-method post">POST</span> [`/licensee`](licensee-services#create-licensee) | Create a licensee | Operation+ |
| <span class="http-method post">POST</span> [`/licensee/{licenseeNumber}`](licensee-services#update-licensee) | Update a licensee | Operation+ |
| <span class="http-method delete">DELETE</span> [`/licensee/{licenseeNumber}`](licensee-services#delete-licensee) | Delete a licensee | Operation+ |
| <span class="http-method post">POST</span> [`/licensee/{licenseeNumber}/validate`](licensee-services#validate-licensee) | **Validate a licensee** | Licensee+ |
| <span class="http-method post">POST</span> [`/licensee/{licenseeNumber}/transfer`](licensee-services#transfer-licenses) | Move licenses to another licensee | Licensee+ |

[License Services](license-services)
------------------------------------

Licenses are issued to a licensee from a license template.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/license`](license-services#licenses-list) | List licenses | Licensee+ |
| <span class="http-method get">GET</span> [`/license/{licenseNumber}`](license-services#get-license) | Get license | Licensee+ |
| <span class="http-method post">POST</span> [`/license`](license-services#create-license) | Create license | Operation+ |
| <span class="http-method post">POST</span> [`/license/{licenseNumber}`](license-services#update-license) | Update license | Operation+ |
| <span class="http-method delete">DELETE</span> [`/license/{licenseNumber}`](license-services#delete-license) | Delete license | Operation+ |

[Bundle Services](bundle-services)
----------------------------------

Bundles group several license templates so they can be sold and issued together.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/bundle`](bundle-services#bundles-list) | List bundles | Analytics+ |
| <span class="http-method get">GET</span> [`/bundle/{bundleNumber}`](bundle-services#get-bundle) | Get bundle | Analytics+ |
| <span class="http-method post">POST</span> [`/bundle`](bundle-services#create-bundle) | Create bundle | Maintenance+ |
| <span class="http-method post">POST</span> [`/bundle/{bundleNumber}`](bundle-services#update-bundle) | Update bundle | Maintenance+ |
| <span class="http-method delete">DELETE</span> [`/bundle/{bundleNumber}`](bundle-services#delete-bundle) | Delete bundle | Operation+ |
| <span class="http-method post">POST</span> [`/bundle/{bundleNumber}/obtain`](bundle-services#obtain-bundle) | Create the bundle's licenses for a licensee | Operation+ |

[Transaction Services](transaction-services)
--------------------------------------------

Transactions record purchases and automatic license changes.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/transaction`](transaction-services#transactions-list) | List transactions | Analytics+ |
| <span class="http-method get">GET</span> [`/transaction/{transactionNumber}`](transaction-services#get-transaction) | Get transaction | Analytics+ |
| <span class="http-method post">POST</span> [`/transaction`](transaction-services#create-transaction) | Create transaction | Admin |
| <span class="http-method post">POST</span> [`/transaction/{transactionNumber}`](transaction-services#update-transaction) | Update transaction | Admin |

[Token Services](token-services)
--------------------------------

Tokens grant temporary or API-key access, and create shop links for licensees.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/token`](token-services#tokens-list) | List active tokens | Admin |
| <span class="http-method get">GET</span> [`/token/{tokenNumber}`](token-services#get-token) | Get token | Admin |
| <span class="http-method post">POST</span> [`/token`](token-services#create-token) | Create token | Licensee+ |
| <span class="http-method delete">DELETE</span> [`/token/{tokenNumber}`](token-services#delete-token) | Delete token | Admin |

[Payment Method Services](payment-method-services)
--------------------------------------------------

Payment methods available in the NetLicensing shop.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/paymentmethod`](payment-method-services#payment-methods-list) | List payment methods | Admin |
| <span class="http-method get">GET</span> [`/paymentmethod/{paymentMethodNumber}`](payment-method-services#get-payment-method) | Get payment method | Admin |
| <span class="http-method post">POST</span> [`/paymentmethod/{paymentMethodNumber}`](payment-method-services#update-payment-method) | Update payment method | Admin |

[Utility Services](utility-services)
------------------------------------

Reference data such as licensing models, license types, countries and currencies.

| Endpoint | Purpose | Role |
|----------|---------|------|
| <span class="http-method get">GET</span> [`/utility/licensingModels`](utility-services#licensing-models-list) | List licensing models | Analytics+ |
| <span class="http-method get">GET</span> [`/utility/licenseTypes`](utility-services#license-types-list) | List license types | Analytics+ |
| <span class="http-method get">GET</span> [`/utility/countries`](utility-services#countries-list) | List countries | Analytics+ |
| <span class="http-method get">GET</span> [`/utility/currencies`](utility-services#currencies-list) | List currencies | Analytics+ |
