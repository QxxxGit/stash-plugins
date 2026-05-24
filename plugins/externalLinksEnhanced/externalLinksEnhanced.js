"use strict";
(() => {
  // src/globals.ts
  var api = window.PluginApi;
  var { React, ReactDOM, libraries, patch, components } = api;
  var { faLink } = libraries.FontAwesomeSolid;
  var {
    faFacebook,
    faImdb,
    faInstagram,
    faPatreon,
    faReddit,
    faTelegram,
    faTiktok,
    faTumblr,
    faTwitch,
    faTwitter,
    faVk,
    faWordpress,
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
      name: "imdb",
      icon: faImdb,
      addresses: ["imdb.com"]
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
      addresses: ["tumblr.com"],
      regex: "^https?\\://(.+)tumblr.com/"
    },
    {
      name: "twitch",
      icon: faTwitch,
      addresses: ["twitch.tv"]
    },
    {
      name: "vk",
      icon: faVk,
      addresses: ["vk.com"]
    },
    {
      name: "wordpress",
      icon: faWordpress,
      addresses: ["wordpress.com"],
      regex: "^https?\\://(.+)wordpress.com/"
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
      const svg = await fetch(`${customAssetPath}/${file}`, {
        cache: "no-store"
      }).then((response) => response.text()).then((str) => {
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
      const json = await fetch(customDefinitionsPath, { cache: "no-store" }).then((response) => response.json()).then((data) => data);
      return json;
    } catch (e) {
      console.error(`Error loading custom definitions: ${e}`);
    }
  };
  var JsonUtils = {
    getCustomDefinitions
  };

  // src/hooks/useExternalLinkSpecs.ts
  var useExternalLinkSpecs = (urls) => {
    const [loading, setLoading] = React.useState(true);
    const [urlSpecs, setUrlSpecs] = React.useState([]);
    const [definitions, setDefinitions] = React.useState(
      LinkDefinitions_default
    );
    React.useEffect(() => {
      setUrlSpecs([]);
      setDefinitions(LinkDefinitions_default);
      setLoading(true);
    }, [urls]);
    const updateDefinitions = React.useCallback(
      (definition) => {
        setDefinitions(
          (prev) => prev.find((d) => d.name === definition.name) ? prev : [...prev, definition]
        );
      },
      []
    );
    const updateSpecs = React.useCallback((spec, url) => {
      setUrlSpecs((prev) => {
        const index = prev.findIndex(
          (s) => s.definition.name === spec.definition.name
        );
        if (index !== -1) {
          const existingSpec = prev[index];
          if (existingSpec.urls.includes(url))
            return prev;
          const updatedSpec = {
            ...existingSpec,
            urls: [...existingSpec.urls, url]
          };
          return [
            ...prev.slice(0, index),
            updatedSpec,
            ...prev.slice(index + 1)
          ];
        }
        return [
          ...prev,
          {
            definition: spec.definition,
            urls: [url]
          }
        ];
      });
    }, []);
    const loadCustomDefinitions = React.useCallback(async () => {
      const customDefinitions = await JsonUtils.getCustomDefinitions();
      if (!customDefinitions?.length)
        return;
      for (const definition of customDefinitions) {
        const getIcon = await IconUtils.loadIcon(definition.icon);
        if (!getIcon)
          continue;
        updateDefinitions({
          name: definition.name,
          icon: getIcon,
          addresses: definition.addresses,
          regex: definition.regex
        });
      }
      setLoading(false);
    }, [updateDefinitions]);
    const pairLinksToDefinitions = React.useCallback(() => {
      if (!urls?.length) return;

      urls.forEach((url) => {
        // 1) Try FA / custom.json...
        const matchedDefinition = definitions.find((d) =>
          d.addresses.some((addr) => {
            const regex = new RegExp(
              d.regex ?? `https?://(?:www\\.)?${addr}/`
            );
            return regex.test(url);
          })
        );
        if (matchedDefinition) {
          updateSpecs({ definition: matchedDefinition, urls: [] }, url);
          return;
        }

        // 2) …else fallback to Google favicon
        const domain = new URL(url).hostname.replace(/^www\./, "");
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        const dynamicDef = {
          name: `favicon-${domain}`,
          icon: faviconUrl,
          addresses: [domain],
        };
        updateDefinitions(dynamicDef);
        updateSpecs({ definition: dynamicDef, urls: [] }, url);
      });
    }, [urls, definitions, updateDefinitions, updateSpecs]);

    React.useEffect(() => {
      if (urls?.length) {
        loadCustomDefinitions();
      } else {
        setLoading(false);
      }
    }, [urls, loadCustomDefinitions]);
    React.useEffect(() => {
      if (!loading) {
        pairLinksToDefinitions();
      }
    }, [loading, pairLinksToDefinitions]);
    return { urlSpecs, loading };
  };

  // src/components/IconRenderer.tsx
  var IconRenderer = ({ icon }) => {
    const { Icon } = components;

    // 1) raw SVG from custom.json
    if (icon instanceof SVGElement) {
      return React.createElement("span", {
        dangerouslySetInnerHTML: { __html: icon.outerHTML },
      });
    }

    // 2) string → either an absolute favicon URL or a local custom asset
    if (typeof icon === "string") {
      // a) absolute URL (Google favicon)
      if (icon.startsWith("http")) {
        return React.createElement("img", { src: icon, alt: "" });
      }
      // b) local file (icon.png / icon.svg)
      if (icon.includes(".")) {
        return React.createElement("img", {
          src: `${customAssetPath}/${icon}`,
          alt: "",
        });
      }
    }

    // 3) FontAwesome default
    return React.createElement(Icon, { icon });
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

  // src/components/LinkDropdownMenu.tsx
  var ExternalLink = (props) => /* @__PURE__ */ React.createElement("a", { target: "_blank", rel: "noopener noreferrer", ...props });
  var LinkDropdownMenu = ({ urls }) => {
    const { Dropdown } = libraries.Bootstrap;
    const menu = /* @__PURE__ */ React.createElement(Dropdown.Menu, null, urls.map((url) => /* @__PURE__ */ React.createElement(
      Dropdown.Item,
      {
        key: url,
        as: ExternalLink,
        href: TextUtils.sanitiseURL(url),
        title: url
      },
      url
    )));
    return ReactDOM.createPortal(menu, document.body);
  };

  // src/components/ExternalLinkIconButton.tsx
  var ExternalLinkIconButton = ({ icon = faLink, urls, className = "" }) => {
    if (!urls.length)
      return null;
    const { Button, Dropdown } = libraries.Bootstrap;
    return /* @__PURE__ */ React.createElement(Dropdown, { className: "external-links-button" }, /* @__PURE__ */ React.createElement(
      Dropdown.Toggle,
      {
        as: Button,
        className: `minimal link ${className}`
      },
      /* @__PURE__ */ React.createElement(IconRenderer, { icon })
    ), /* @__PURE__ */ React.createElement(LinkDropdownMenu, { urls }));
  };
  var ExternalLinkIconButton_default = ExternalLinkIconButton;

  // src/components/ExternalLinkButtons.tsx
  var ExternalLinkButtons = ({ props }) => {
    const urls = props.urls;
    const { urlSpecs, loading } = useExternalLinkSpecs(urls);
    if (loading)
      return null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, urlSpecs.map(
      (spec, i) => spec.urls.length ? /* @__PURE__ */ React.createElement(
        ExternalLinkIconButton_default,
        {
          key: i,
          urls: spec.urls,
          className: spec.definition.name,
          icon: spec.definition.icon
        }
      ) : null
    ));
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
