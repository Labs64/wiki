<a href="https://netlicensing.io"><img src="https://netlicensing.io/img/netlicensing-stage-twitter.jpg" alt="Innovative License Management Solution"></a>

# [Labs64 NetLicensing Wiki](https://netlicensing.io/wiki/) - Innovative License Management Solution

[![Lint NetLicensing Wiki](https://github.com/Labs64/wiki/actions/workflows/netlicensing-wiki-lint.yml/badge.svg)](https://github.com/Labs64/wiki/actions/workflows/netlicensing-wiki-lint.yml)

Visit Labs64 NetLicensing at https://netlicensing.io

## Run

### System Requirements
To be able to run the wiki locally you need [Docker](https://www.docker.com) with Compose.

### Docker

1. Clone repository
```bash
git clone https://github.com/Labs64/wiki.git
```

2. Start environment
```bash
docker compose up -d
```

Now you can browse the site at [http://localhost:4000/wiki/](http://localhost:4000/wiki/). The first start takes a minute (it downloads the theme and installs gems); pages rebuild when you save a file.

3. Stop environment
```bash
docker compose down
```

## Repository layout

| Path | What it is |
|------|-----------|
| `docs/` | The published site (Jekyll source). Pages are Markdown with front matter; the theme comes from [Labs64/NetLicensing-Wiki-template](https://github.com/Labs64/NetLicensing-Wiki-template) via `remote_theme`. |
| `docs/_data/changelog.yml` | Source of the [changelog](https://netlicensing.io/wiki/changelog), the home page "What's new" block and the RSS feed. See the comment at the top of the file for the entry format. |
| `docs/llms.txt` | Machine-readable site index for AI assistants, generated from page front matter. |
| `scripts/` | CI helpers. |

## Checks

Every push and pull request runs [`netlicensing-wiki-lint.yml`](.github/workflows/netlicensing-wiki-lint.yml): it builds `docs/` the same way GitHub Pages does, verifies that the guided-tour anchors still exist, and runs HTMLProofer on internal links, images and scripts. To reproduce locally:

```bash
mkdir -p /tmp/wiki-site && docker run --rm -v "$PWD/docs:/srv/jekyll" -v /tmp/wiki-site:/out -w /srv/jekyll \
  jekyll/jekyll:pages jekyll build --future --strict_front_matter --baseurl "" -d /out
python3 scripts/check-tour-anchors.py /tmp/wiki-site docs/assets/js/guidechimp-tours.js
```

## Credits

- [Just the Docs](https://github.com/pmarsceill/just-the-docs) - A modern, highly customizable, and responsive Jekyll theme for documentation with built-in search.

## License and Copyright

Following files, directories and their contents are copyright Labs64. You may not reuse anything therein without permission:

* `docs/` including all subdirectories

All other files and directories are licensed under the [MIT License](https://www.opensource.org/licenses/mit-license.php) unless explicitly stated.
