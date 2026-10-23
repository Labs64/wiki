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
redirect_from:
  - /release-notes
  - /netlicensing-1-0-0-final
  - /netlicensing-2-0-0-final
  - /netlicensing-2-0-2-final
  - /netlicensing-2-1-0-final
  - /netlicensing-2-2-0-final
  - /netlicensing-2-3-0-final
  - /netlicensing-2-3-1-final
  - /netlicensing-2-3-2-final
  - /netlicensing-2-3-3-final
  - /netlicensing-2-3-4-final
  - /netlicensing-2-3-5-final
  - /netlicensing-2-3-6-final
  - /netlicensing-2-3-7-final
  - /netlicensing-2-3-8-final
  - /netlicensing-2-3-9-final
  - /netlicensing-2-4-0-final
  - /netlicensing-2-4-1-final
  - /netlicensing-2-5-0-final
---

{{ page.title }}
=============

We improve NetLicensing every day by releasing new features, squashing bugs, and delivering fresh documentation.
Here's an account of what's recently happened. This is our *#changelog*.

<div class="cl" markdown="1">

<div class="cl-toolbar">
<button class="btn" id="startTour" type="button">Tour: Notable Features</button>
<a class="cl-feed" href="{{ '/feed.xml' | relative_url }}"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M3 3a10 10 0 0 1 10 10M3 7.5A5.5 5.5 0 0 1 8.5 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="3.6" cy="12.4" r="1.4" fill="currentColor"/></svg>Subscribe via RSS</a>
</div>

{% assign cutoff = site.time | date: '%s' | plus: 0 | minus: 31536000 %}
{% assign years = site.data.changelog | group_by_exp: "c", "c.date | date: '%Y'" %}

<div class="cl-recent" markdown="1">
{% for change in site.data.changelog %}{% assign ts = change.date | date: '%s' | plus: 0 %}{% if ts >= cutoff %}
{% include changelog-entry.html change=change %}
{% endif %}{% endfor %}
</div>

<div class="cl-archive" markdown="1">

## Earlier entries

Older than twelve months, grouped by year.

{% for g in years %}{% assign n = 0 %}{% for c in g.items %}{% assign ts = c.date | date: '%s' | plus: 0 %}{% if ts < cutoff %}{% assign n = n | plus: 1 %}{% endif %}{% endfor %}{% if n > 0 %}
<details class="cl-year" markdown="1">
<summary><span class="cl-year-name">{{ g.name }}</span><span class="cl-count">{{ n }} {% if n == 1 %}entry{% else %}entries{% endif %}</span></summary>
<div class="cl-year-body" markdown="1">
{% for c in g.items %}{% assign ts = c.date | date: '%s' | plus: 0 %}{% if ts < cutoff %}
{% include changelog-entry.html change=c %}
{% endif %}{% endfor %}
</div>
</details>
{% endif %}{% endfor %}

</div>

</div>


<link rel="stylesheet" href="{{ '/assets/css/changelog.css' | relative_url }}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/guidechimp@5.0.5/dist/guidechimp.min.css" integrity="sha384-CtCHUCPNI8pOj9U8q5F3gMrcnIcQEaaLt/2zf1fYHdxbf1+0p5cqJ4HO5lELpcK/" crossorigin="anonymous">
<script defer src="{{ '/assets/js/changelog.js' | relative_url }}"></script>
<script defer src="https://cdn.jsdelivr.net/npm/guidechimp@5.0.5/dist/guidechimp.min.js" integrity="sha384-FB4v/hFf+kaEn1SOXCvF9/iI7mB5Dmw6wA4x1IUm7y+bcOHdFyCVrX4mDYdYIu0j" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/guidechimp@5.0.5/dist/plugins/licensing.js" integrity="sha384-bT8xjX2OuTWFBu3WJ4VYuT76IZVHkX9TmcVKA/oIbcssTuERI2VQzDJkcGGiHLxg" crossorigin="anonymous"></script>
<script defer src="{{ '/assets/js/guidechimp-tours.js' | relative_url }}"></script>
