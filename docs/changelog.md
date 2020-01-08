---
layout: default
title: Changelog
nav_order: 140
has_children: false
has_toc: false
description: "NetLicensing Changelog"
permalink: changelog
---

{{ page.title }}
=============

We improve the NetLicensing services every day by releasing new features, squashing bugs, and delivering fresh documentation.
Here's an account of what's recently happened. This is our #changelog.

{% for change in site.data.changelog %}

---

### {{ change.date }} - {% if change.component %}[{{ change.component }}] {% endif %}{{ change.title }}
{{ change.description }}

{% if change.image %}
<img src="{{ change.image }}" />
{% endif %}

{% if change.features %}
**Changes:**
{% for feature in change.features %}
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

{% if change.url %}
[Learn more]({{ change.url }}){: .btn }
{% endif %}

{% endfor %}

---

[Here](release-notes) you can find a historical archive of past NetLicensing release notes.
