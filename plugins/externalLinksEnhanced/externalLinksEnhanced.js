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
      addresses: ["facebook.com"]
    },
    {
      name: "instagram",
      icon: faInstagram,
      addresses: ["instagram.com"]
    },
    {
      name: "patreon",
      icon: faPatreon,
      addresses: ["patreon.com"]
    },
    {
      name: "reddit",
      icon: faReddit,
      addresses: ["reddit.com"]
    },
    {
      name: "telegram",
      icon: faTelegram,
      addresses: ["telegram.com", "t.me"]
    },
    {
      name: "tiktok",
      icon: faTiktok,
      addresses: ["tiktok.com"]
    },
    {
      name: "tumblr",
      icon: faTumblr,
      addresses: ["tumblr.com"]
    },
    {
      name: "twitch",
      icon: faTwitch,
      addresses: ["twitch.tv"]
    },
    {
      name: "twitter",
      icon: faTwitter,
      addresses: ["twitter.com", "x.com"]
    },
    {
      name: "vk",
      icon: faVk,
      addresses: ["vk.com"]
    },
    {
      name: "youtube",
      icon: faYoutube,
      addresses: ["youtube.com"]
    },
    {
      name: "other",
      icon: faLink,
      addresses: []
    }
  ];
  var LinkDefinitions_default = DefaultLinkDefinitions;

  // src/utils/svg.ts
  var loadSvgIcon = async (file) => {
    try {
      const svg = await fetch(`${customAssetPath}/${file}`).then((response) => response.text()).then((str) => {
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(str, "image/svg+xml");
        const svgElement = doc.querySelector("svg");
        return svgElement;
      });
      return svg;
    } catch (e) {
      console.error(`Error loading svg: ${file}, ${e}`);
      return null;
    }
  };
  var SvgUtils = {
    loadSvgIcon
  };

  // src/utils/icon.ts
  var loadIcon = async (file) => {
    if (file instanceof String)
      return null;
    if (file.includes(".svg")) {
      return await SvgUtils.loadSvgIcon(file);
    }
    return file;
  };
  var IconUtils = {
    loadIcon
  };

  // src/utils/json.ts
  var getCustomDefinitions = async () => {
    try {
      const json = await fetch(customDefinitionsPath).then((response) => response.json()).then((data) => data);
      return json;
    } catch (e) {
      console.error(`Error loading custom definitions: ${e}`);
    }
  };
  var JsonUtils = {
    getCustomDefinitions
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

  // src/components/ExternalLinkIconButton.tsx
  var ExternalLink = (props) => {
    return /* @__PURE__ */ React.createElement("a", { target: "_blank", rel: "noopener noreferrer", ...props });
  };
  var ExternalLinkIconButton = ({ icon = faLink, urls, className = "" }) => {
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
      if (icon instanceof SVGElement) {
        return /* @__PURE__ */ React.createElement("span", { dangerouslySetInnerHTML: { __html: icon.outerHTML } });
      } else if (typeof icon === "string" && icon.includes(".")) {
        return /* @__PURE__ */ React.createElement("img", { src: `${customAssetPath}/${icon}` });
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
  var ExternalLinkIconButton_default = ExternalLinkIconButton;

  // src/components/ExternalLinkButtons.tsx
  var ExternalLinkButtons = ({ props }) => {
    const urls = props.urls;
    const [loading, setLoading] = React.useState(true);
    const [definitions, setDefinitions] = React.useState(
      LinkDefinitions_default
    );
    const [urlSpecs, setUrlSpecs] = React.useState([]);
    const abortController = new AbortController();
    const updateDefinitions = (definition) => {
      if (definitions.find((d) => d.name === definition.name))
        return;
      setDefinitions([...definitions, definition]);
    };
    const updateSpecs = (spec, url) => {
      setUrlSpecs((prev) => {
        const index = prev.findIndex(
          (s) => s.definition.name === spec.definition.name
        );
        if (index !== -1) {
          const existingSpec = prev[index];
          if (existingSpec.urls.includes(url))
            return prev;
          const updatedSpec = {
            ...prev[index],
            urls: [...prev[index].urls, url]
          };
          return [
            ...prev.slice(0, index),
            updatedSpec,
            ...prev.slice(index + 1)
          ];
        } else {
          return [...prev, { definition: spec.definition, urls: [url] }];
        }
      });
    };
    const checkForCustomDefinitions = async () => {
      if (!urls?.length)
        return;
      const customDefinitions = await JsonUtils.getCustomDefinitions();
      if (!customDefinitions?.length)
        return;
      customDefinitions.map(async (link) => {
        const getIcon = await IconUtils.loadIcon(link.icon);
        if (!getIcon)
          return;
        updateDefinitions({
          name: link.name,
          icon: getIcon,
          addresses: link.addresses,
          regex: link.regex
        });
      });
      setLoading(false);
    };
    const pairLinksToDefinitions = () => {
      urls?.map((url) => {
        const lookup = definitions.find(
          (d) => d.addresses.find((addr) => {
            const regex = new RegExp(
              d.regex ?? `https?://(?:www.)?${addr}/`
            );
            return url.match(regex);
          })
        );
        if (lookup) {
          updateSpecs(
            {
              definition: lookup,
              urls: []
            },
            url
          );
        }
      });
    };
    React.useEffect(() => {
      checkForCustomDefinitions();
      if (!loading) {
        pairLinksToDefinitions();
      }
      return () => abortController.abort();
    }, [loading, definitions]);
    const renderIconButtons = () => {
      return urlSpecs.map((spec, i) => {
        if (!spec.urls.length)
          return;
        return /* @__PURE__ */ React.createElement(
          ExternalLinkIconButton_default,
          {
            key: i,
            urls: spec.urls,
            className: spec.definition.name,
            icon: spec.definition.icon
          }
        );
      });
    };
    if (loading)
      return null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, renderIconButtons());
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
