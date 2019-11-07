---
layout: default
title:
nav_order: 99
description: ""
permalink:
---

Release Notes - NetLicensing 2.0.0-RC2
=====================================================================

by <span class="editor"> Konstantin Korotkov</span> on 28-11-2013

    ** Feature
        * [LMB-490] - Send activation and registration confirmation email during vendor registration
        * [LMB-545] - Adapt C# client library and demo to NetLicensing
     
    ** Improvement
        * [LMB-559] - Style tooltip for discounts on product edit page
        * [LMB-575] – Extend length of licensee.number field (currently 20 chars)

    ** Bug
        * [LMB-528] - Shop error page fixed
        * [LMB-536] - Feature with TimeVolume: if no feature licenses available, it shouldn't be possible to add timevolume to the shopping cart
        * [LMB-558] - It is possible to set yellowThreshold=1 and redThreshold=0, which causes validation error and, as a result, shop error (NPE).
        * [LMB-568] - Entity numbers with special symbols are not encoded properly when used in URL
        * [LMB-572] - LM FeatureWithTimeVolume: it is possible to delete feature license when associated timevolume licenses exists
        * [LMB-586] - Password reset email is not delivered
        * [LMB-589] - NullPointerException at PriceFormatter
