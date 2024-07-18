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

Supported Warning Levels
--------

The Warning Level can have one of the following values:
- **GREEN (Licensed):** The customer is licensed for all configured product modules.
- **YELLOW (Warning):** Some product modules are approaching under-licensed status.
- **RED (Underlicensed):** Some product modules have reached under-licensed status.

**Note:** The warning level is calculated with each validation request from the customer and cached for a period of time. The value may be evicted from cache due to extended inactivity (no validation requests) or license changes since the last validation. In such cases, the warning level is not returned via API and is shown as grey-colored `Unknown` in the UI. To force an update, send a validation request with the `dryRun` parameter set to `true` (or click refresh symbol in the UI). Be aware that some licenses only activate on the first non-dry validation request, which may cause the warning level to be incorrectly reported as RED or YELLOW if updated via a dry validation.

Access
------

The Warning Level can be accessed via the following [RESTful API](restful-api) methods:

### Validation

The `warningLevel` value is included in the [validation results](licensee-services#validate-licensee) for each product module.

**Example:**
```xml
<ns2:property name="warningLevel">GREEN</ns2:property>
```

### Get Licensee

The `warningLevel` value in the licensee object provides a combined [result](licensee-services#get-licensee) of all product modules and their respective warning levels. This is a cached value, and is not recalculated on the request - see the note in the "Supported Warning Levels" section above.

**Example:**
```xml
<ns2:property name="warningLevel">
  {"RED":["M7W5JGF4D","MKFRA22H3"],"YELLOW":[],"GREEN":["MVA66EEE6"]}
</ns2:property>
```

Rules
-----

Each licensing model specifies its own ruleset for determining the warning level.
Please refer to the description of the particular [licensing model](licensing-models) to see its specific warning level ruleset.
