---
layout: default
title: Changelog
nav_order: 140
has_children: false
has_toc: false
description: "Track NetLicensing additions, updates and fixes using NetLicensing changelog"
permalink: changelog
sitemap:
  changefreq: daily
  priority: 0.8
---

{{ page.title }}
=============

We improve the NetLicensing services every day by releasing new features, squashing bugs, and delivering fresh documentation.
Here's an account of what's recently happened. This is our #changelog.

{% for change in site.data.changelog %}

---

### {{ change.title }}
<p style="font-size: smaller; font-style: italic;">{% if change.component %}In {{ change.component }} on {% endif %}{{ change.date | date: '%B %d, %Y' }}</p>
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
