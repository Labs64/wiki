---
layout: default
title: Discount
parent: Licensing Models
nav_order: 10
description: "Offer promo-code discounts in NetLicensing Shop"
permalink: discount
---

{{ page.title }}
========

-   [When to use Discount](#when-to-use-discount)
-   [License templates](#license-templates)
-   [Create a discount with the REST API](#create-a-discount-with-the-rest-api)
-   [NetLicensing Shop](#netlicensing-shop)

When to use Discount
--------------------

Use the **Discount** licensing model when you want customers to enter a promo code at checkout, for example for a seasonal campaign, a partner offer, or a limited-time promotion. Each discount defines a code and either a fixed amount or a percentage off. You can optionally set start and end dates and a minimum cart total.

Discounts are intended for checkout and do not change the regular prices of your product's license templates. NetLicensing Shop supports Discount directly.

License templates
-----------------

Configure one or more discount license templates in a Product Module using the **Discount** licensing model. Each template defines a promo-code offer and its conditions:

Each active promo code must be unique across Discount modules for the same product. For codes customers will use in Shop, use letters, numbers, `@`, `+`, `&`, `$`, `:`, `.`, `-`, and `_`.

| Setting | Description |
|:--------|:------------|
| Promo code | Code a customer enters at checkout. Required and unique among active offers for the product. |
| Discount type | `FIX` for an amount off or `PERCENT` for a percentage off. |
| Discount amount | Amount or percentage to subtract. Percentage values range from 0 to 100. |
| Discount currency | Required for a fixed discount. Choose a currency that matches the cart currency used by your checkout. |
| Start date / End date | Optional dates that control when the offer can be used. The end date cannot be before the start date. |
| Minimum cart total | Optional subtotal that the cart must reach before the offer applies. |

Create a discount with the REST API
-----------------------------------

If the product does not already have a Discount Product Module, create one first. Then create a license template for that module using `POST /licensetemplate`. The example below creates a 10% offer that requires a cart subtotal of at least 50 EUR and is valid during December 2026.

<div>Create Product Module</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/productmodule
Accept: application/xml
Content-Type: application/x-www-form-urlencoded

productNumber=PRODUCT-01&number=DISCOUNT-MODULE-01&name=Promo+discounts&licensingModel=Discount
```
{: .ml-5 }

<div>Create discount package</div>
{: .code-example .ml-5 .code-header }
```http
POST https://go.netlicensing.io/core/v2/rest/licensetemplate
Accept: application/xml
Content-Type: application/x-www-form-urlencoded

productModuleNumber=DISCOUNT-MODULE-01&number=WINTER10&name=Winter+sale&licenseType=FEATURE&promoCode=WINTER10&discountType=PERCENT&discountAmount=10&minCartTotal=50&startDate=2026-12-01&endDate=2026-12-31
```
{: .ml-5 }

For a fixed amount, set `discountType=FIX`, provide `discountAmount` and `discountCurrency`, for example `discountAmount=5&discountCurrency=EUR`. The `productModuleNumber` must identify a Product Module configured with the Discount licensing model. See [License Template services](../restful-api/services/license-template-services) for authentication and the full set of template operations.

NetLicensing Shop
-----------------

NetLicensing Shop includes a promo-code field and applies an eligible discount to the cart. It checks the minimum cart total against the cart subtotal. Percentage discounts are calculated from that subtotal and rounded to two decimal places; fixed discounts are capped at the subtotal, so the discounted amount cannot make it negative. Fixed discount currency should match the Shop cart currency.

Shop can also select an initial promo code from the Shop URL, Shop token, or licensee data, in that order. A code entered by the customer takes precedence.
