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

---

### {{ release.date }} - {% if release.component %}[{{ release.component }}] {% endif %}{{ release.title }}
{{ release.description }}

{% if release.image %}
<img src="{{ release.image }}" />
{% endif %}

{% if release.features %}
**Changes:**
{% for feature in release.features %}
{% for item in feature %}
{% case item[0] %}
{% when 'added' %}
{% assign style = 'label-green' %}
{% when 'updated' %}
{% assign style = 'label-yellow' %}
{% when 'fixed' %}
{% assign style = 'label-red' %}
{% else %}
{% assign style = 'label-purple' %}
{% endcase %}
- <span class="label {{ style }}">{{ item[0] }}</span> {{ item[1] }}
{% endfor %}
{% endfor %}
{% endif %}

{% if release.url %}
[Learn more]({{ release.url }}){: .btn }
{% endif %}

{% endfor %}
