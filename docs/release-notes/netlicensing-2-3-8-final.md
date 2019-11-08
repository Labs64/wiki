---
layout: default
title: NetLicensing 2.3.8-FINAL
parent: Release Notes
nav_order: 20
description: "NetLicensing 2.3.8-FINAL"
permalink: netlicensing-2-3-8-final
---

Release Notes - NetLicensing 2.3.8-FINAL
========================================

    ** Feature
        * [NLIC-1173] - Permanent NetLicensing Shop token
        * [NLIC-1389] - Allow validate for licensee marked for transfer

    ** Improvement
        * [NLIC-1436] - Pay-per-Use (Phase 1): allow negative values for “remainingQuantity”
        * [NLIC-1021] - Statistics fetching for dashboard takes too long
        * [NLIC-1372] - Add ttl attribute to the ValidationResult in NetLicensing Client Libraries (Java, C#, C++, PHP, JavaScript)
        * [NLIC-1362] - Support discounts delete in NetLicensing Client Libraries
        * [NLIC-1377] - Change ttl output format, in case Accept: application/json, from timestamp to datetime
        * [NLIC-1325] - Verify and confirm MyCommerce with the automatic renewal

    ** Bug
        * [NLIC-1335] - Repeated checkout (after incomplete attempt) causes error
        * [NLIC-1345] - Discounts can't be removed
        * [NLIC-1368] - Licensee cannot be found in dropdown box (License edit view)
        * [NLIC-1371] - License Template has no price in edit mode
        * [NLIC-1388] - Licenses transfer causes error 500 if source equals target
        * [NLIC-1391] - start Date in License has bad format after create or edit
        * [NLIC-1398] - Licenses transfer may cause inconsistency in licenses
        * [NLIC-1401] - New licensee gets automatic licenses even if marked for transfer
        * [NLIC-1409] - NPE in Shop on demo product
