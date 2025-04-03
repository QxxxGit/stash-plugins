"use strict";
(() => {
  // src/globals.ts
  var api = window.PluginApi;
  var { React, libraries, patch, components } = api;
  var { faLink } = libraries.FontAwesomeSolid;
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
    faYoutube
  } = libraries.FontAwesomeBrands;

  // src/types/LinkDefinitions.ts
  var LinkDefinitions = [
    {
      name: "facebook",
      icon: faFacebook,
      baseAddresses: ["facebook.com"]
    },
    {
      name: "instagram",
      icon: faInstagram,
      baseAddresses: ["instagram.com"]
    },
    {
      name: "patreon",
      icon: faPatreon,
      baseAddresses: ["patreon.com"]
    },
    {
      name: "reddit",
      icon: faReddit,
      baseAddresses: ["reddit.com"]
    },
    {
      name: "telegram",
      icon: faTelegram,
      baseAddresses: ["telegram.com", "t.me"]
    },
    {
      name: "tiktok",
      icon: faTiktok,
      baseAddresses: ["tiktok.com"]
    },
    {
      name: "tumblr",
      icon: faTumblr,
      baseAddresses: ["tumblr.com"]
    },
    {
      name: "twitch",
      icon: faTwitch,
      baseAddresses: ["twitch.tv"]
    },
    {
      name: "twitter",
      icon: faTwitter,
      baseAddresses: ["twitter.com", "x.com"]
    },
    {
      name: "vk",
      icon: faVk,
      baseAddresses: ["vk.com"]
    },
    {
      name: "youtube",
      icon: faYoutube,
      baseAddresses: ["youtube.com"]
    }
  ];
  var LinkDefinitions_default = LinkDefinitions;

  // src/externalLinksEnhanced.tsx
  (function() {
    const ExternalLinksButtons = ({ props }) => {
      const urls = props.urls;
      const { ExternalLinksButton } = components;
      const links = /* @__PURE__ */ new Map();
      const urlSpecsBuilder = (link, url) => {
        if (links.has(link.name)) {
          links.get(link.name)?.urls.push(url);
          return;
        }
        links.set(link.name, {
          icon: link.icon,
          className: link.name,
          urls: [url]
        });
      };
      const urlSpecs = React.useMemo(() => {
        if (!urls?.length) {
          return [];
        }
        urls.map((url) => {
          const lookup = LinkDefinitions_default.find(
            (link) => link.baseAddresses.find((addr) => {
              const regex = new RegExp(
                `https?://(?:www.)?${addr}/`
              );
              return url.match(regex);
            })
          );
          if (lookup) {
            urlSpecsBuilder(lookup, url);
          } else {
            urlSpecsBuilder(
              {
                name: "other",
                icon: faLink,
                baseAddresses: []
              },
              url
            );
          }
        });
        return Array.from(links.values());
      }, [urls]);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, urlSpecs.map((spec, i) => /* @__PURE__ */ React.createElement(ExternalLinksButton, { key: i, ...spec })));
    };
    patch.instead(
      "ExternalLinkButtons",
      function(props, _, orig) {
        return /* @__PURE__ */ React.createElement(ExternalLinksButtons, { props });
      }
    );
  })();
})();
