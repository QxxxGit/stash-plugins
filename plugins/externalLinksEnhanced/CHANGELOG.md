# v2.0 (2026-09-09)

## Features

* Implemented `open_singlelinks_directly`: when enabled, icons with exactly one URL open it directly in a new tab. Icons with multiple URLs still show a dropdown; when disabled or unset, all icons use dropdowns.

## Fixes

* Moved bundled definitions and icons to `default/`, reserving `custom/` exclusively for personal files ([#4](https://github.com/QxxxGit/stash-plugins/issues/4)). Optional `custom/custom.json` overrides `default/default.json` by name, with icon paths relative to each file's directory. Releases exclude the entire `custom/` directory. Back up old custom files before the first update and follow the README migration instructions.
* Keep built-in icons available when custom definitions are empty, unavailable, or invalid.

# v1.2 (2025-04-21)

## New icons

* Bluesky (bsky.app) ~~ as custom icon
* IMDB (imdb.com)
* Wordpress (wordpress.com)

## Fixes

* Fixed caching issue (thanks feederbox!)
