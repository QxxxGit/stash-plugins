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
    faYoutube,
  } = libraries.FontAwesomeBrands;
  var pluginAssetPath = "./plugin/externalLinksEnhanced/assets";
  var defaultAssetPath = `${pluginAssetPath}/default`;
  var customAssetPath = `${pluginAssetPath}/custom`;
  var defaultDefinitionsPath = `${defaultAssetPath}/default.json`;
  var customDefinitionsPath = `${customAssetPath}/custom.json`;

  // src/types/Definitions.ts
  var DefaultDefinitions = [
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
  var Definitions_default = DefaultDefinitions;

  // src/utils/svg.ts
  var loadSvgIcon = async (file, assetPath) => {
    try {
      const svg = await fetch(`${assetPath}/${file}`, {
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
  var loadIcon = async (file, assetPath) => {
    if (file instanceof String)
      return null;
    if (file.includes(".svg")) {
      return await SvgUtils.loadSvgIcon(file, assetPath);
    }
    return `${assetPath}/${file}`;
  };
  var IconUtils = {
    loadIcon
  };

  // src/utils/json.ts
  var loadDefinitionsJSON = async (path, optional = false) => {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (optional && response.status === 404)
        return [];
      if (!response.ok)
        throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (!Array.isArray(json))
        throw new Error("Expected an array of link definitions");
      return json;
    } catch (e) {
      console.error(`Error loading definitions from ${path}: ${e}`);
      return [];
    }
  };
  var getDefinitions = async () => {
    const [bundledDefinitions, personalDefinitions] = await Promise.all([
      loadDefinitionsJSON(defaultDefinitionsPath),
      loadDefinitionsJSON(customDefinitionsPath, true)
    ]);
    return [
      ...bundledDefinitions.map((definition) => ({ ...definition, assetPath: defaultAssetPath })),
      ...personalDefinitions.map((definition) => ({ ...definition, assetPath: customAssetPath }))
    ];
  };
  var JsonUtils = {
    getDefinitions
  };

  // src/hooks/useExternalLinkSpecs.ts
  var useExternalLinkSpecs = (urls) => {
    const [loading, setLoading] = React.useState(true);
    const [definitions, setDefinitions] = React.useState(
      Definitions_default
    );
    React.useEffect(() => {
      let cancelled = false;
      setLoading(true);
      const loadDefinitions = async () => {
        const Definitions = await JsonUtils.getDefinitions();
        const mergedDefinitions = [...Definitions_default];
        for (const definition of Definitions) {
          try {
            if (!definition || typeof definition.name !== "string" || !definition.name.trim() ||
              typeof definition.icon !== "string" || !definition.icon.trim() ||
              !Array.isArray(definition.addresses) || definition.addresses.some((address) => typeof address !== "string")) {
              throw new Error("Invalid link definition");
            }
            if (definition.regex !== undefined) {
              if (typeof definition.regex !== "string")
                throw new Error("Invalid definition regex");
              new RegExp(definition.regex);
            } else {
              definition.addresses.forEach((address) => new RegExp(`https?://(?:www.)?${address}/`));
            }
            const icon = await IconUtils.loadIcon(definition.icon, definition.assetPath);
            if (!icon)
              continue;
            const resolvedDefinition = { ...definition, icon };
            const index = mergedDefinitions.findIndex((d) => d.name === definition.name);
            if (index === -1) {
              mergedDefinitions.push(resolvedDefinition);
            } else {
              mergedDefinitions[index] = resolvedDefinition;
            }
          } catch (e) {
            console.error(`Error loading definition: ${e}`);
          }
        }
        if (!cancelled) {
          setDefinitions(mergedDefinitions);
          setLoading(false);
        }
      };
      loadDefinitions();
      return () => { cancelled = true; };
    }, []);
    const urlSpecs = React.useMemo(() => {
      const specs = [];
      if (loading)
        return specs;
      (urls ?? []).forEach((url) => {
        const matchedDefinition = definitions.find(
          (d) => d.addresses.some((addr) => {
            const regex = new RegExp(
              d.regex ?? `https?://(?:www.)?${addr}/`
            );
            return regex.test(url);
          })
        );
        const definition = matchedDefinition || Definitions_default.find((d) => d.name === "other");
        if (definition) {
          const spec = specs.find((s) => s.definition.name === definition.name);
          if (!spec) {
            specs.push({ definition, urls: [url] });
          } else if (!spec.urls.includes(url)) {
            spec.urls.push(url);
          }
        }
      });
      return specs;
    }, [urls, definitions, loading]);
    return { urlSpecs, loading };
  };

  // src/components/IconRenderer.tsx
  var IconRenderer = ({ icon }) => {
    const { Icon } = components;
    if (icon instanceof SVGElement) {
      return /* @__PURE__ */ React.createElement("span", { dangerouslySetInnerHTML: { __html: icon.outerHTML } });
    }
    if (typeof icon === "string" && icon.includes(".")) {
      return /* @__PURE__ */ React.createElement("img", { src: icon });
    }
    return /* @__PURE__ */ React.createElement(Icon, { icon });
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
  var ExternalLinkIconButton = ({ icon = faLink, urls, className = "", openSingleLinksDirectly = false }) => {
    if (!urls.length)
      return null;
    const { Button, Dropdown } = libraries.Bootstrap;
    if (openSingleLinksDirectly && urls.length === 1) {
      return /* @__PURE__ */ React.createElement("div", { className: "external-links-button" }, /* @__PURE__ */ React.createElement(
        Button,
        {
          as: "a",
          className: `minimal link ${className}`,
          href: TextUtils.sanitiseURL(urls[0]),
          target: "_blank",
          rel: "noopener noreferrer",
          title: urls[0],
          "aria-label": urls[0]
        },
        /* @__PURE__ */ React.createElement(IconRenderer, { icon })
      ));
    }
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
    const { data } = api.utils.StashService.useConfiguration();
    const settings = data?.configuration?.plugins?.externalLinksEnhanced;
    const openSingleLinksDirectly = settings?.open_singlelinks_directly === true;
    const { urlSpecs, loading } = useExternalLinkSpecs(urls);
    if (loading)
      return null;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, urlSpecs.map(
      (spec, i) => spec.urls.length ? /* @__PURE__ */ React.createElement(
        ExternalLinkIconButton_default,
        {
          key: i,
          urls: spec.urls,
          openSingleLinksDirectly,
          className: spec.definition.name,
          icon: spec.definition.icon
        }
      ) : null
    ));
  };
  var ExternalLinkButtons_default = ExternalLinkButtons;

  // src/externalLinksEnhanced.tsx
  (function () {
    patch.instead(
      "ExternalLinkButtons",
      function (props, _, orig) {
        return /* @__PURE__ */ React.createElement(ExternalLinkButtons_default, { props });
      }
    );
  })();
})();
