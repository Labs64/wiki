---
layout: default
title: NetLicensing Shop
nav_order: 70
has_children: true
has_toc: false
description: "NetLicensing Shop provides a seamless online purchase experience, aligned with deployed licensing models."
permalink: netlicensing-shop
---

NetLicensing Shop
=================

NetLicensing Shop is a white-label licensing e-commerce solution, which offers your customers easy licenses acquisition. NetLicensing products, modules and packages configuration will be used to show your customers available licensing options.

## Access Shop

To use NetLicensing Shop, [Shop Token](token-services#create-token) need to be created; `shopURL` parameter in the response can be used to forward the customer to NetLicensing Shop.

<div>Request</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/token
tokenType=SHOP&licenseeNumber=%LICENSEE_NUMBER%
Accept: application/xml
```
{: .ml-5 }

<div>Response</div>
{: .code-example .ml-5 .code-header }
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns2:netlicensing xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:ns2="http://netlicensing.labs64.com/schema/context">
    <ns2:infos/>
    <ns2:items>
        <ns2:item type="Token">
            <ns2:property name="number">976bde51-0014-4e2a-b97e-08ede6604054</ns2:property>
            <ns2:property name="active">true</ns2:property>
            <ns2:property name="expirationTime">2022-04-20T21:51:05.293Z</ns2:property>
            <ns2:property name="tokenType">SHOP</ns2:property>
            <ns2:property name="shopURL">https://go.netlicensing.io/shop/v2/?shoptoken=976bde51-0014-4e2a-b97e-08ede6604054</ns2:property>
            <ns2:property name="cancelURL">https://netlicensing.io/#cancel</ns2:property>
            <ns2:property name="successURL">https://netlicensing.io/#success</ns2:property>
            <ns2:property name="successURLTitle">Return to netlicensing.io</ns2:property>
            <ns2:property name="cancelURLTitle">Cancel and return to netlicensing.io</ns2:property>
            <ns2:property name="licenseeNumber">CUST-API-KEY-SIGN-01</ns2:property>
            <ns2:property name="vendorNumber">VDEMO</ns2:property>
        </ns2:item>
    </ns2:items>
</ns2:netlicensing>
```
{: .ml-5 }

## Shop Token Kind

The NetLicensing Shop supports various kinds of tokens for opening a shop session, allowing vendors to implement specific license acquisition flows and improve the shopping experience for their customers.

### Licensee Shop Token

This is the default token kind, created for a specific licensee/customer. The identified customer can choose from the available modules and licenses. The process considers the customer's existing licenses, and newly acquired licenses will be assigned to the customer.

<div>Request Parameters</div>
{: .code-example .ml-5 .code-header }
```http
tokenType=SHOP&licenseeNumber=%LICENSEE_NUMBER%
```
{: .ml-5 }

### Bundle Shop Token

This token type can be created for a specific bundle, allowing customers to purchase only that bundle. The licenses acquired within the bundle will then be assigned to the customer.

<div>Request Parameters</div>
{: .code-example .ml-5 .code-header }
```http
tokenType=SHOP&licenseeNumber=%LICENSEE_NUMBER%&bundleNumber=%BUNDLE_NUMBER%&bundlePrice=%BUNDLE_PRICE%
```
{: .ml-5 }

### Permanent Shop Token

This non-expiring token type allows the acquisition of predefined shopping cart items (such as a Pricing Table plan) identified by one or more “licenseTemplateNumber_N” values.

A permanent token is created when “licenseeNumber” is omitted and the following custom properties are included in the token properties at creation:

- "productNumber" - the product to be purchased.
- "predefinedShoppingItem" - the name of the shopping cart item to be purchased.
- "licenseTemplateNumber_N" - the license template number(s), where N is an incrementing index starting from “1”.

<div>Request Parameters</div>
{: .code-example .ml-5 .code-header }
```http
tokenType=SHOP&productNumber=%PRODUCT_NUMBER%&licenseTemplateNumber=%LICENSETEMPLATE_NUMBER%&predefinedShoppingItem=Plan%20Name
```
{: .ml-5 }


## Customization

You can customize NetLicensing Shop at **Settings > Shop Customization** to display your brand elements: logo, legal information and links, and custom texts.

## Payment Methods

On the **Settings > Payment Methods** page you can configure [payment methods](payment-service-providers) to be used during the checkout process.

NetLicensing Shop works in the single currency mode. System currency for the entire vendor account can be configured at **Settings > General** page.

**Note:** In case, no payments method is activated and configured, NetLicensing checkout will be executed without payment step and selected licenses will be assigned to the customer. This scenario can be used for non-profit or to test the checkout process.

## Alternatives

NetLicensing Shop is an optional component.
Below you will find alternative options on how new licenses can be added to the customer profile.

- *External e-Commerce* - Enable external e-Commerce system using [NetLicensing Gateway](gateway)
- *RESTful API* - Use [License Services](license-services#create-license) API to create a new License and assign this to the Customer
- *Management Console* - Add licenses manually via NetLicensing Management Console
