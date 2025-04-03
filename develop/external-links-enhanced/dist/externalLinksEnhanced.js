"use strict";
(() => {
  // src/globals.ts
  var api = window.PluginApi;
  var { React, ReactDOM, libraries, patch, components } = api;
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
  var customAssetPath = "./plugin/externalLinksEnhanced/assets/custom";
  var customDefinitionsPath = `${customAssetPath}/custom.json`;

  // src/types/LinkDefinitions.ts
  var DefaultLinkDefinitions = [
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
    },
    {
      name: "other",
      icon: faLink,
      baseAddresses: []
    }
  ];
  var LinkDefinitions_default = DefaultLinkDefinitions;

  // src/utils/json.ts
  var getCustomDefinitions = async () => {
    const json = await fetch(customDefinitionsPath).then((response) => response.json()).then((data) => data);
    console.log(json);
    return json;
  };

  // src/utils/svg.ts
  var loadSvgIcon = async (file) => {
    const svg = await fetch(`${customAssetPath}/${file}`).then((response) => response.text()).then((str) => {
      const domParser = new DOMParser();
      const doc = domParser.parseFromString(str, "image/svg+xml");
      const svgElement = doc.querySelector("svg");
      return svgElement;
    });
    console.log(svg);
    return svg;
  };

  // src/utils/text.ts
  var sanitiseURL = (url, siteURL) => {
    if (!url) {
      return url;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (siteURL) {
      if (url.startsWith(siteURL.host)) {
        return `${siteURL.protocol}//${url}`;
      }
      return `${siteURL.protocol}//${siteURL.host}/${url}`;
    }
    return `https://${url}`;
  };
  var TextUtils = {
    sanitiseURL
  };

  // src/components/ExternalLinksButton.tsx
  var ExternalLink = (props) => {
    return /* @__PURE__ */ React.createElement("a", { target: "_blank", rel: "noopener noreferrer", ...props });
  };
  var ExternalLinkIconButton = ({ icon, urls, className }) => {
    if (!urls.length)
      return null;
    const { Button, Dropdown } = libraries.Bootstrap;
    const { Icon } = components;
    const Menu = () => ReactDOM.createPortal(
      /* @__PURE__ */ React.createElement(Dropdown.Menu, null, urls.map((url) => /* @__PURE__ */ React.createElement(
        Dropdown.Item,
        {
          key: url,
          as: ExternalLink,
          href: TextUtils.sanitiseURL(url),
          title: url
        },
        url
      ))),
      document.body
    );
    const renderIcon = () => {
      console.log(`${className} is ${typeof icon}`);
      if (icon instanceof SVGElement) {
        console.log(className);
        return /* @__PURE__ */ React.createElement("span", { dangerouslySetInnerHTML: { __html: icon } });
      }
      return /* @__PURE__ */ React.createElement(Icon, { icon });
    };
    return /* @__PURE__ */ React.createElement(Dropdown, { className: "external-links-button" }, /* @__PURE__ */ React.createElement(
      Dropdown.Toggle,
      {
        as: Button,
        className: `minimal link ${className}`
      },
      renderIcon()
    ), /* @__PURE__ */ React.createElement(Menu, null));
  };
  var ExternalLinksButton_default = ExternalLinkIconButton;

  // src/components/ExternalLinkButtons.tsx
  var ExternalLinkButtons = ({ props }) => {
    const urls = props.urls;
    const [loading, setLoading] = React.useState(true);
    const [linkDefinitions, setLinkDefinitions] = React.useState(LinkDefinitions_default);
    const [links, setLinks] = React.useState(
      /* @__PURE__ */ new Map()
    );
    const updateLinks = (k, v) => {
      setLinks(new Map(links).set(k, v));
    };
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
    const loadCustomIcons = async () => {
      const json = await getCustomDefinitions();
      if (!json) {
        setLoading(false);
        return;
      }
      json.map(async (link) => {
        if (linkDefinitions.filter((def) => def.name === link.name).length > 0)
          return;
        const svg = await loadSvgIcon(link.icon);
        if (!svg)
          return;
        setLinkDefinitions([
          ...linkDefinitions,
          {
            name: link.name,
            icon: svg,
            baseAddresses: link.baseAddresses
          }
        ]);
      });
      setLoading(false);
    };
    React.useEffect(() => {
      if (!urls?.length)
        return;
      loadCustomIcons();
      urls.map((url) => {
        const lookup = linkDefinitions.find(
          (link) => link.baseAddresses.find((addr) => {
            console.log(`lookup ${addr}`);
            const regex = new RegExp(
              link.regex ?? `https?://(?:www.)?${addr}/`
            );
            return url.match(regex);
          })
        );
        if (lookup) {
          urlSpecsBuilder(lookup, url);
        }
      });
    }, [loading, linkDefinitions]);
    const getLinks = React.useMemo(() => {
      return Array.from(links.values()).map((specs, i) => {
        return /* @__PURE__ */ React.createElement(
          ExternalLinksButton_default,
          {
            key: i,
            urls: specs.urls,
            className: specs.className,
            icon: specs.icon
          }
        );
      });
    }, [links]);
    if (loading)
      return null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, getLinks);
  };
  var ExternalLinkButtons_default = ExternalLinkButtons;

  // src/externalLinksEnhanced.tsx
  (function() {
    patch.instead(
      "ExternalLinkButtons",
      function(props, _, orig) {
        return /* @__PURE__ */ React.createElement(ExternalLinkButtons_default, { props });
      }
    );
  })();
})();
