---
layout: default
title: How to access and verify consent given by end-customer
parent: Privacy Center
nav_order: 99
description: "How to access and verify consent given by end-customer"
permalink: how-to-access-and-verify-consent-given-by-end-customer
---

How to access and verify consent given by end-customer
=============================================================

To keep proof of customers' consent is mandatory with the new GDPR
rules.

In NetLicensing, when a customer acquires new Licenses using
NetLicensing Shop, he should give you a consent and agree to your Terms
and Conditions as well as Privacy Policies applicable to your product or
service.

NetLicensing provides a logging feature which records every consent
given within corresponding *Transaction* entity.

You can access this data either using [NetLicensing RESTful API](transaction-services) or via *NetLicensing Management Console*.

<img src="assets/images/17433045/17629258.png?effects=drop-shadow" title="Transaction - Proof of Concent" alt="Transaction - Proof of Concent" />

Customer's consent will be stored in the following *Transaction*
properties:

-   *Consent Timestamp* - consent timestamp; please be aware of the time
    zone (NetLicensing server time zone), as you might need to convert
    this to your or customer's time zone in order to get exact consent
    timestamp
-   *Consent Privacy Policy* - link to the Privacy Policy
    [defined](how-to-maintain-vendor-account-data) in your
    vendor profile
-   *Consent Terms Of Service* - link to the Terms Of Service
    [defined](how-to-maintain-vendor-account-data) in your
    vendor profile

Please Note

<span class="aui-icon icon-warning">Icon</span>

If you are using an external shopping module or system with the
NetLicensing integrated into fulfilment process, it's the responsibility
of the external systems to collect customer's consent in the shopping
cart!

Please contact the support team of those systems to get more info on the
Proof of Consent process.
