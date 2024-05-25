---
layout: default
title: Notifications
nav_order: 92
description: "Automate your licensing workflows and streamline your business processes with NetLicensing webhook notifications"
permalink: notifications
---

Notifications
=============

NetLicensing offers a Notifications feature that allows you to receive real-time notifications for specific events related to your vendor account. These notifications provide timely updates and alerts regarding the activities and statuses of your licenses and customers.

With the Notifications feature, you can set up endpoints to receive notifications for events such as:
- Creation of a new customer
- Issuance of a license
- Change in a customer’s warning level

These notifications are sent via HTTP POST requests to the specified endpoint URL, allowing you to integrate them into your systems or applications for further processing.

By leveraging the Notifications feature, you can automate your licensing workflows and streamline your business processes. You can use the notifications to trigger actions like sending automated emails to customers, updating internal databases or CRM systems, or generating reports based on events occurring within your licensing environment.

Setup
-----

Manage your NetLicensing Notifications from the *"Settings / Notifications"* section. Here, you can view, deactivate, delete, and create notifications.

### Creating a New Notification

1. Click on "Add Notification" to start the creation process
2. In the "Create Notification" view, fill in the required attributes
3. Click "Create" to create notification

<a href="assets/images/notifications.png" class="imagelink" data-lightbox="notifications" data-title="Notifications" data-alt="Notifications">
    <img src="assets/images/notifications.png" />
</a>

### Notification Attributes

- **Name**: The name of the notification.
- **Number**: A unique notification number. If left empty, a number will be generated automatically.
- **Events**: One or more events that will trigger the notification. Options include:
  - **Create Customer**: Triggered when a new customer is created.
  - **Create License**: Triggered when a new license is created.
  - **Change Warning Level**: Triggered on customer's [warning level](warning-level) changes (e.g., from `GREEN` to `YELLOW` or `YELLOW` to `RED`).
- **Type**: The type of notification. Currently, only `WEBHOOK` is supported.
- **Endpoint**: The URL where an HTTP POST request with the specified payload will be sent. **Note:** The endpoint must use the secured HTTPS protocol with a public SSL/TLS certificate.
- **Payload**: The specific payload for the event can be defined here.

Payload Structure
-----------------

Notification payload can be configured to include specific data related to the event that triggered the notification. The payload is sent as a JSON object in the body of the HTTP POST request to the specified endpoint URL. The structure of the payload depends on the event type and the data associated with the event.

The standard payload structure includes the following fields:

- **Event**: `${event}` - full event object
- **Data**: `${event.data}` - event-specific data
- **Name**: `${event.name}` - event name; can be one of the following: `LICENSEE_CREATED`, `LICENSE_CREATED`, `WARNING_LEVEL_CHANGED`
- **Timestamp**: `${event.timestamp}` - timestamp of the event

Below are examples of the payload structure (`event.data` element) for different events:

<div>LICENSEE_CREATED</div>
{: .code-example .ml-5 .code-header }
```json
{
    ...
    "items": {
        "item": [
            {
                "property": [
                    {
                        "value": "IADGNSGZG",
                        "name": "number"
                    },
                    {
                        "value": "true",
                        "name": "active"
                    },
                    {
                        "value": "PQMW7JWWN",
                        "name": "productNumber"
                    },
                    {
                        "value": "Customer 04",
                        "name": "name"
                    },
                    {
                        "value": "{\"RED\":[],\"YELLOW\":[],\"GREEN\":[]}",
                        "name": "warningLevel"
                    },
                    ...
                ],
                "type": "Licensee"
            },
            {
                "property": [
                    {
                        "value": "PQMW7JWWN",
                        "name": "number"
                    },
                    {
                        "value": "true",
                        "name": "active"
                    },
                    {
                        "value": "Pricing Table demo product",
                        "name": "name"
                    },
                    ...
                ],
                ...
                "type": "Product"
            }
        ],
        ...
    },
    ...
}
```
{: .ml-5 }


<div>LICENSE_CREATED</div>
{: .code-example .ml-5 .code-header }
```json
{
    ...
    "items": {
        "item": [
            {
                "property": [
                    {
                        "value": "L76HEM5M6",
                        "name": "number"
                    },
                    {
                        "value": "true",
                        "name": "active"
                    },
                    {
                        "value": "License 01",
                        "name": "name"
                    },
                    {
                        "value": "IADGNSGZG",
                        "name": "licenseeNumber"
                    },
                    {
                        "value": "E9FSDF2RX",
                        "name": "licenseTemplateNumber"
                    },
                    ...
                ],
                "list": [],
                "type": "License"
            }
        ],
        ...
    },
    ...
}
```
{: .ml-5 }


<div>WARNING_LEVEL_CHANGED</div>
{: .code-example .ml-5 .code-header }
```json
{
    ...
    "items": {
        "item": [
            {
                "property": [
                    {
                        "value": "N123456",
                        "name": "number"
                    },
                    {
                        "value": "true",
                        "name": "active"
                    },
                    {
                        "value": "P5URES4FZ",
                        "name": "productNumber"
                    },
                    {
                        "value": "Customer 04",
                        "name": "name"
                    },
                    {
                        "value": "{\"RED\":[],\"YELLOW\":[],\"GREEN\":[\"MQWTGNYMI\",\"MT2VNWASP\"]}",
                        "name": "warningLevel"
                    }
                    ...
                ],
                "list": [],
                "type": "Licensee"
            },
            {
                "property": [
                    {
                        "value": "true",
                        "name": "valid"
                    },
                    {
                        "value": "Features",
                        "name": "productModuleName"
                    },
                    {
                        "value": "GREEN",
                        "name": "warningLevel"
                    },
                    {
                        "value": "MultiFeature",
                        "name": "licensingModel"
                    },
                    {
                        "value": "MT2VNWASP",
                        "name": "productModuleNumber"
                    }
                ],
                ...
                "type": "ProductModuleValidation"
            }
        ],
        ...
    }
}
```
{: .ml-5 }

Considerations and Best Practices for Receiving Notifications
-------------------------------------------------------------

When building an application to receive notifications, consider the following factors:

1. **Reliability**: Notification delivery is not always guaranteed due to factors such as network issues, server errors, or application downtime. Implement retry mechanisms and idempotency to handle missed or duplicate notifications.

2. **Security**: Ensure secure connections using encryption protocols, such as TLS, to protect the integrity and confidentiality of the data transmitted via notifications. Validate the source of the notifications by checking signatures or using secret keys.

3. **Scalability**: Design your notifications receiver to handle varying loads. Use asynchronous processing to manage high volumes of incoming notifications efficiently.

4. **Logging and Monitoring**: Implement comprehensive logging and monitoring to track notifications deliveries and failures. This helps in diagnosing issues and improving the reliability of your notification handling.

5. **Validation**: Validate incoming notification data to ensure it adheres to the expected format and contains all necessary information. This helps prevent the processing of invalid or malicious data.

6. **Versioning**: Plan for versioning of your notifications endpoint(-s) to accommodate future changes without disrupting existing integrations. Ensure backward compatibility whenever possible.
