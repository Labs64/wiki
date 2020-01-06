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

### {{ release.date }} - {{ release.title }}
{{ release.description }}

{% if release.image %}
<img src="{{ release.image }}" />
{% endif %}

{% if release.features %}
**Features:**
{% for feature in release.features %}
{% for item in feature %}
- [{{ item[0] }}] {{ item[1] }}
{% endfor %}
{% endfor %}
{% endif %}

{% if release.url %}
[Learn more]({{ release.url }}){: .btn }
{% endif %}

{% endfor %}
