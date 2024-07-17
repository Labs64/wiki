---
layout: default
title: Warning Level
nav_order: 93
description: "Labs64 NetLicensing warning level"
permalink: warning-level
---

{{ page.title }}
================

The NetLicensing Warning Level feature provides vendors with valuable metrics regarding the current licensing status of a specific customer. Represented as a traffic light, the Warning Level indicates whether a customer profile is fully licensed, approaching under-licensing, or has reached under-licensing.

Important Clarifications
------------------------

- **Warning Level** vs. **Valid Status**: The Warning Level should not be confused with the `valid` status in the validation response. While the `valid` status indicates the current validity of a specific product module for a given customer at the time of the request, the Warning Level value provides information about potential or imminent changes in the licensing situation, highlighting any forthcoming under-licensing issues.
- **Purpose**: The Warning Level is intended to act as an indicator of the licensee's health and is not meant to replace the validation response. It serves solely as a supplementary metric, providing an early warning if the customer's licensing situation is likely to change soon or requires immediate action.

Statuses
--------

The Warning Level is calculated during each validation request and is represented by the following statuses:
-	GREEN – the customer is licensed for all configured product modules
-	YELLOW – some licensing parameters are approaching under-licensed status
-	RED – some licensing parameters have reached under-licensed status

**Note:** The warning level status resets after a certain period, usually due to extended licensee inactivity or delayed validation requests. When this occurs, the customer status is shown as `GREY (undefined)`. You can force an update of the Warning Level by sending a validation request with the parameter `dryRun` set to `true`.

Access
------

The Warning Level can be accessed via the following [RESTful API](restful-api) methods:

### Validation

The `warningLevel` parameter is included in the [validation results](licensee-services#validate-licensee) for each product module.

**Example:**
```xml
<ns2:property name="warningLevel">GREEN</ns2:property>
```

### Get Licensee

The `warningLevel` parameter provides a combined [result](licensee-services#get-licensee) of all product modules and their respective warning level statuses.

**Example:**
```xml
<ns2:property name="warningLevel">
  {"RED":["M7W5JGF4D","MKFRA22H3"],"YELLOW":[],"GREEN":["MVA66EEE6"]}
</ns2:property>
```

Rules
-----

Every licensing model specify its own ruleset determining warning level. Please find below detailed description for each licensing model:

|                | GREEN | YELLOW | RED |
|:---------------|:------|:-------|:----|
| [Try & Buy](try-n-buy) | trialPeriodActive = true<br>AND<br>featureAquired = true | trialPeriodActive = true | trialPeriodActive = false<br>AND<br>featureAquired = false |
| [Subscription](subscription) | timeUsed < 80% | timeUsed >= 80% | timeUsed = 100% |
| [Pricing Table](pricing-table) | timeUsed < 80% | timeUsed >= 80% | timeUsed = 100% |
| [Rental](rental) | Time-volume not reached yellow threshold<br>AND<br>Time-volume not reached red threshold | Time-volume reached yellow threshold | No time-volume license associated with the feature license<br>OR<br>Time-volume license expired<br>OR<br>Time-volume reached red threshold |
| [Floating](floating) | sessionsUsed < 80% | sessionsTotal < 10 AND sessionsUsed >= sessionsTotal<br>OR<br>sessionsUsed >= 80% | sessionsTotal >= 10<br>AND<br>sessionsUsed >= sessionsTotal |
| [Multi-Feature](multi-feature) | always GREEN | N/A | N/A |
| [Pay-per-Use](pay-per-use) | remainingQuantity < 80% | remainingQuantity >= 80% | remainingQuantity = 100% |
| [Node-Locked](node-locked) | nodeSecretsUsed < 80% | nodeSecretsTotal < 10 AND nodeSecretsUsed >= nodeSecretsTotal<br>OR<br>nodeSecretsUsed >= 80% | nodeSecretsTotal >= 10<br>AND<br>nodeSecretsUsed >= nodeSecretsTotal |
| [Quota](quota) | totalQuota > 0 | N/A | totalQuota = 0 |
