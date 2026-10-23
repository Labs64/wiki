#!/usr/bin/env python3
"""Fail if a guided-tour step points at a heading that no longer exists on the built changelog page.

Usage: check-tour-anchors.py <built _site dir> [tours js]
"""
import re, sys, pathlib

site = pathlib.Path(sys.argv[1])
tours = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'docs/assets/js/guidechimp-tours.js')
# only a fully built changelog counts; an unthemed or data-less build has no entries to check against
pages = [p for p in site.rglob('changelog.html') if 'class="cl-entry"' in p.read_text(encoding='utf-8')]
if not pages:
    print(f'warning: no fully built changelog page under {site}; skipping tour anchor check')
    sys.exit(0)
html = pages[0].read_text(encoding='utf-8')
ids = set(re.findall(r'\bid="([^"]+)"', html))
anchors = set(re.findall(r"h3#([\w-]+)", tours.read_text(encoding='utf-8')))
missing = sorted(a for a in anchors if a not in ids)
for a in missing:
    print(f'tour anchor not found on changelog page: h3#{a}')
print(f'{len(anchors) - len(missing)}/{len(anchors)} tour anchors OK')
sys.exit(1 if missing else 0)
