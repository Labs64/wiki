---
layout: default
title: FAQ & Troubleshooting
has_children: true
has_toc: false
nav_order: 110
description: "Answers to common NetLicensing questions: license validation, offline use, licensing models, API keys and security, trials, subscriptions, Shop payments, integrations and troubleshooting."
permalink: faq
last_modified_at: 2026-10-25
---

FAQ & Troubleshooting
=====================

Answers to common questions about Labs64 NetLicensing, grouped by topic, plus troubleshooting answered by our support
team. In addition, the [NetLicensing Community Support](https://github.com/Labs64/NetLicensing-Community){:target="_blank"}{:rel="noopener"}
repository collects questions, ideas and bug reports from the vendor community.

{% assign faq_pages = site.pages | where: "parent", page.title | sort: "title" -%}
{%- assign faq_categories = "Getting started,Validation,Licensing models,Licenses and customers,Security,Offline and on-premises,Integrations,Troubleshooting" | split: "," -%}
{%- for category in faq_categories %}
## {{ category }}
{% for faq in faq_pages %}{% if faq.faq_category == category %}
- [{{ faq.title }}]({{ faq.url | relative_url }})
{%- endif %}{% endfor %}
{% endfor %}
{%- assign uncategorized = faq_pages | where: "faq_category", nil -%}
{%- if uncategorized.size > 0 %}
## More questions
{% for faq in uncategorized %}
- [{{ faq.title }}]({{ faq.url | relative_url }})
{%- endfor %}
{% endif %}
