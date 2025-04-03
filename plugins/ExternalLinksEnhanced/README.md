# External Links Enhanced

Plugin that adds additional icons for external links.

## Supported Links

The following sites are supported:

* Facebook (facebook.com)
* Instagram (instagram.com)
* Patreon (patreon.com)
* Reddit (reddit.com)
* Telegram (telegram.com | t.me)
* TikTok (tiktok.com)
* Tumblr (tumblr.com)
* Twitch (twitch.tv)
* Twitter (twitter.com | x.com)
* VK (vk.com)
* YouTube (youtube.com)

Don't see one you need on the list? View [Font Awesome's brand icons](https://fontawesome.com/search?o=r&ip=brands) to see if it's available. Then you can update `externalLinksEnhanced.js` to add your icon to the list. You will need to update two things in the file:

1. You need to reference it from the library. In the javascript file, add `faSite` (whatever the icon is named... just make sure to keep the `fa` prefix) below `faYoutube`. It should look like:

    ```js
    var {
        faFacebook,
        faInstagram,
        faPatreon,
        faReddit,
        faTelegram,
        faTiktok,
        faTumblr,
        faTwitch,
        faTwitter,
        faVk,
        faYoutube,
        faSite
    } = libraries.FontAwesomeBrands;
    ```

2. In the LinkDefinitions array, there are a list of definitions that have site names, their icon (which is referenced above e.g. `faYoutube`), then an array of addresses. These addresses will be used to detect a match with the link you enter for your performer, group, etc.

    That's it! Optionally, you can edit the `externalLinksEnhanced.css` to change the color of the new icon. Whatever you entered in the `name` property for the link definition will be used here. Example:

    ```js
    {
        name: "somesite",
        icon: faSite,
        baseAddresses: ["somesite.com"]
    }
    ```

    becomes

    ```css
    .external-links-button .btn.link.somesite {
        color: green;
    }
    ```

## To do

* Allow custom icons.