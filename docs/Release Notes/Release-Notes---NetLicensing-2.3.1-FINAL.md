---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.3.1-FINAL
=======================================================================


    ** Improvement
        * [LMB-1084] - "Generate new key" overrides old APIKey
        * [LMB-1102] - Revisit NetLicensing email templates
        * [LMB-1103] - Multi-Feature license doesn't show license template relation
        * [LMB-1104] - Floating licensing model doesn't indicate if there are no active licenses exists
        * [LMB-1119] - Java Client: Form params are being used for GET requests

    ** Bug
        * [LMB-933] - Wrong date format for Subscription Licensing Model breaks validation
        * [LMB-969] - GET / DELETE Token method returns HTTP500
        * [LMB-1046] - For license templates that allow no price (empty), it is not possible to empty it once set
        * [LMB-1047] - With only free licenses in shopping cart (total price 0), PSP selection still required for checkout
        * [LMB-1100] - License custom property deletion using [-] is not working in Management Console
        * [LMB-1101] - PayPal: vendor account isn't funded after successful payment
        * [LMB-1101] - Null-Payment Method is always shown on the confirmation page
        * [LMB-1106] - Shop success and cancel URLs aren't rendered
        * [LMB-1107] - TryAndBuy Licensing Model doesn't allow to buy a full-featured license for the second licensee
        * [LMB-1110] - Order confirmation email isn't received
        * [LMB-1112] - Licenses bound to inactive license templates are not considered for validation
