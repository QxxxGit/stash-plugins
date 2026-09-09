# External Links Enhanced

<https://discourse.stashapp.cc/t/external-links-enhanced/584>

Plugin that adds additional icons for external links.

## Settings

Enable `open_singlelinks_directly` in the plugin settings to open an icon's URL
directly in a new tab when that icon has exactly one URL. Icons with multiple
URLs still show a dropdown menu. When disabled or unset, all icons use dropdowns.

## Supported Links

The following sites are supported out of the box:

* Bluesky (bsky.app) ~~ as bundled icon
* Facebook (facebook.com)
* IMDB (imdb.com)
* Instagram (instagram.com)
* OnlyFans (onlyfans.com) ~~ as bundled icon
* Patreon (patreon.com)
* Reddit (reddit.com)
* Telegram (telegram.com | t.me)
* TikTok (tiktok.com)
* Tumblr (tumblr.com)
* Twitch (twitch.tv)
* Twitter (twitter.com | x.com)
* VK (vk.com)
* Wordpress (wordpress.com)
* YouTube (youtube.com)

Want more icons? It's pretty simple to add your own; however, it's recommended to request an icon to be added the CommunityScripts repository. When you install the plugin from the CommunityScripts repository, it will come bundled with icons that the community has contributed.

## Creating a custom icon

`default/` contains the plugin's bundled definitions and icons. `custom/` belongs entirely to you and is excluded from release packages.

Create `custom/` in the installed plugin directory if needed, then copy `example/example.json` to `custom/custom.json`. Edit this file to add your personal definitions. Entries override bundled definitions with the same `name`.

Place your icon files directly in `custom/`. Icon paths in `custom/custom.json` are relative to that directory; for example, `myicon.png` loads `custom/myicon.png`.

Bundled definitions in `default/default.json` load their icons from `default/`.

> NOTE: Images and SVGs are supported when using an icon.

The file contains a JSON array. For example:

```json
[
    {
        "name": "sitename",
        "icon": "myicon.png",
        "addresses": ["mysitename.com"]
    }
]
```

The `name` is a unique identifier. The `icon` can be an SVG or image. The `addresses` array will be used in conjunction with the `regex` property (not shown above since it's not required) for link detection to properly categorize the icons. The default/fallback regex is `https?:\/\/(?:www\.)?${addr}\/`

Save the file and reload the Stash page. Invalid entries are skipped and reported in the browser console; the remaining definitions continue to work. A missing `custom/custom.json` is normal and uses only the bundled definitions.

### Migrating existing custom definitions from v1.*

Before the first update to this layout, back up your existing `custom/` directory. Prefer copying only personal
additions and overrides so bundled definitions can receive future updates.

Reload the Stash page after editing. Subsequent releases leave the entire `custom/` directory untouched because none of its files are shipped. This change cannot recover files that an earlier update has already overwritten.

### Packaging releases

Ship `default/default.json`, the icons in `default/`, and `example/example.json`.
Never include anything under `custom/` in a release ZIP or package manifest. Stash deletes files listed in the old manifest before extracting the new package, so merely removing a previously shipped file from a later release does not protect that file during migration.

The entire `custom/` directory is excluded by `.gitignore` and by `.gitattributes` for Git archives. ZIP tools that package the working directory must exclude them explicitly as well.

## Things to know

The plugin fetches `default/default.json`, the optional `custom/custom.json`, and icon files from the hard-coded plugin asset root:

`./plugin/externalLinksEnhanced/assets`

This means if you rename the `externalLinksEnhanced` directory, things will break. You would need to update `pluginAssetPath` in the `externalLinksEnhanced.js` file.

## Support

I (Qx) developed this plugin but I'm giving it to the community to change and update it as much as they like. The original source code can be found [here](https://github.com/QxxxGit/stash-plugins/tree/main/develop/external-links-enhanced).

If you're looking for a clean install of the plugin without the custom icons, you can add my plugin repo source to Stash and install it that way:

`https://qxxxgit.github.io/stash-plugins/index.yml`
