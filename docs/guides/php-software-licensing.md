---
layout: default
title: "How to Implement Software Licensing in PHP"
nav_title: PHP Quick Start
parent: Guides
nav_order: 52
description: "Add license validation to a PHP application, plugin or SaaS back end with the NetLicensing PHP client: Composer installation, API key authentication, validating a customer, reading results, TTL caching and offline validation."
permalink: php-software-licensing
last_modified_at: 2026-10-25
---

How to Implement Software Licensing in PHP
==========================================

Whether it's a WordPress plugin, a self-hosted web app or a SaaS back end, the steps are the same: install the
[NetLicensing PHP client](https://github.com/Labs64/NetLicensingClient-php){:target="_blank"}{:rel="noopener"} with
Composer, create a `Context` with your API key, and call `LicenseeService::validate(...)` with the customer's licensee
number.

## Requirements and installation

The current client requires PHP 8.2 or later with the `curl`, `dom`, `json`, `libxml`, `mbstring` and `openssl`
extensions. Run a patched PHP runtime; check the client
[README](https://github.com/Labs64/NetLicensingClient-php#requirements){:target="_blank"}{:rel="noopener"} for the
minimum patch versions.

```sh
composer require labs64/netlicensingclient-php
```

## Validate a customer

```php
<?php
require 'vendor/autoload.php';

use NetLicensing\Constants;
use NetLicensing\Context;
use NetLicensing\LicenseeService;
use NetLicensing\ValidationParameters;

$context = (new Context())
    ->setBaseUrl('https://go.netlicensing.io/core/v2/rest')
    ->setSecurityMode(Constants::APIKEY_IDENTIFICATION)
    ->setApiKey('YOUR_API_KEY');                    // role ROLE_APIKEY_LICENSEE

$parameters = new ValidationParameters();
$parameters->setProductNumber('YOUR_PRODUCT_NUMBER'); // needed only for licensee auto-create

$result = LicenseeService::validate($context, 'CUSTOMER-123', $parameters);
$module = $result->getProductModuleValidation('YOUR_PRODUCT_MODULE_NUMBER');

$isLicensed = $module && filter_var($module['valid'] ?? false, FILTER_VALIDATE_BOOLEAN);
```

`$module` is an array with everything the licensing model returns, for example `expires` for a
[Subscription](subscription) module or `remainingQuantity` for [Pay-per-Use](pay-per-use).

## Licensing-model parameters

```php
$parameters->setProductModuleValidationParameters('M-FLOAT', [
    'sessionId' => $sessionId,
    'action'    => 'checkOut',
]);
```

## Cache the result

`$result->getTtl()` returns a `DateTime` that says how long the result stays good. In a web application, cache the
result per licensee (APCu, Redis, the database) and only call the API again after the TTL. Your pages stay fast and you
don't make an API call on every request.

## Validate offline

```php
use NetLicensing\ValidationService;

$context = (new Context())->setPublicKey($publicKeyPem);
$meta = [];
$result = ValidationService::validateOffline($context, $offlineFileXml, $meta);
```

The file must be signed with the private key attached to one of your API keys. See
[Offline License Validation](offline-license-validation) and the runnable
[`examples/OfflineValidation.php`](https://github.com/Labs64/NetLicensingClient-php/tree/master/examples){:target="_blank"}{:rel="noopener"}.

## Security notes for PHP plugins and self-hosted apps

PHP ships as source code, and customers can edit it. Licensing tells you what's allowed, but it can't stop a modified
copy from skipping the check, so keep the logic you care most about on your own server if you can.

Never ship your account password or an Admin API key. A key with the role `ROLE_APIKEY_LICENSEE` is all a client needs.

## See also

- [Software Licensing API: Architecture and Examples](software-licensing-api)
- [Client Libraries](client-libraries)
- [WordPress integration](integrations)
