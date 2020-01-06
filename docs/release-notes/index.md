---
layout: default
title: Release Notes
nav_order: 140
has_children: true
has_toc: true
description: "NetLicensing release notes"
permalink: release-notes
---

Release Notes
=============

NetLicensing release notes are specific to each version.

Select your version from the list below to see the release notes for it.

{% for release in site.data.releases %}
    <p>{{ release.title }}</p>
    <p>{{ release.date }}</p>
    <p>{{ release.description }}</p>
    <p>{{ release.url }}</p>
    <p>{{ release.image }}</p>
    <p>{{ release.features }}</p>
{% endfor %}
