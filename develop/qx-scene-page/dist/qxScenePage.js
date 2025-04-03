"use strict";
(() => {
  // src/globals.ts
  var api = window.PluginApi;
  var {
    React,
    GQL,
    libraries,
    patch,
    components,
    loadableComponents,
    utils,
    hooks
  } = api;
  var VIDEO_PLAYER_ID = "VideoJsPlayer";
  var { Icon, LoadingIndicator } = components;
  var { FormattedDate, FormattedMessage } = libraries.Intl;
  var { Link, NavLink } = libraries.ReactRouterDOM;
  var { Button } = libraries.Bootstrap;

  // src/utils/TextUtils.ts
  function stringToDate(date) {
    if (!date)
      return null;
    const parts = date.split("-");
    if (parts.length !== 3)
      return null;
    const year = Number(parts[0]);
    const monthIndex = Math.max(0, Number(parts[1]) - 1);
    const day = Number(parts[2]);
    return new Date(year, monthIndex, day, 0, 0, 0, 0);
  }
  function maybeGetSceneTitle(title, files) {
    if (title)
      return title;
    if (files && files.length > 0) {
      var primaryFilePath = files[0].path;
      primaryFilePath = primaryFilePath.replace(/^.*[\\/]/, "");
      return primaryFilePath;
    }
    return "Scene not found";
  }
  function calculateAge(dateStr, fromDateStr) {
    if (!dateStr)
      return 0;
    const birthdate = stringToDate(dateStr);
    const fromDate = fromDateStr ? stringToDate(fromDateStr) : /* @__PURE__ */ new Date();
    if (!birthdate || !fromDate)
      return 0;
    let age = fromDate.getFullYear() - birthdate.getFullYear();
    if (birthdate.getMonth() > fromDate.getMonth() || birthdate.getMonth() >= fromDate.getMonth() && birthdate.getDate() > fromDate.getDate()) {
      age -= 1;
    }
    return age;
  }
  var TextUtils = {
    maybeGetSceneTitle,
    calculateAge
  };
  var TextUtils_default = TextUtils;

  // src/components/Details/Editor.tsx
  var Editor = ({ scene }) => {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, "editor!");
  };
  var Editor_default = Editor;

  // src/components/Details/Filters/Slider.tsx
  var Slider = ({ title, className, range, value, setValue, displayValue }) => {
    const { Form } = libraries.Bootstrap;
    return /* @__PURE__ */ React.createElement("div", { className: "row form-group" }, /* @__PURE__ */ React.createElement("span", { className: "col-sm-3" }, title), /* @__PURE__ */ React.createElement("span", { className: "col-sm-6" }, /* @__PURE__ */ React.createElement(
      Form.Control,
      {
        className: `filter-slider d-inline-flex ml-sm-3 ${className}`,
        type: "range",
        min: range.min,
        max: range.max,
        value,
        onChange: (e) => setValue(Number.parseInt(e.currentTarget.value, 10))
      }
    )), /* @__PURE__ */ React.createElement(
      "span",
      {
        className: "col-sm-3 filter-slider-value",
        role: "presentation",
        onClick: () => setValue(range.default)
      },
      displayValue
    ));
  };
  var Slider_default = Slider;

  // src/components/Details/Filters/FilterOverlay.tsx
  var FilterOverlay = ({ props }) => {
    const popoverRef = React.useRef(null);
    const { Popover } = libraries.Bootstrap;
    const brightnessRange = {
      min: 0,
      default: 100,
      max: 200,
      divider: 1
    };
    const contrastRange = {
      min: 0,
      default: 100,
      max: 200,
      divider: 1
    };
    const gammaRange = {
      min: 0,
      default: 100,
      max: 200,
      divider: 200
    };
    const rotateRange = {
      min: 0,
      default: 2,
      max: 4,
      divider: 1 / 90
    };
    const scaleRange = {
      min: 0,
      default: 100,
      max: 200,
      divider: 1
    };
    const aspectRatioRange = {
      min: 0,
      default: 150,
      max: 300,
      divider: 100
    };
    const xposRange = {
      min: -100,
      default: 0,
      max: 100,
      divider: 1
    };
    const yposRange = {
      min: -100,
      default: 0,
      max: 100,
      divider: 1
    };
    const [brightnessValue, setBrightnessValue] = React.useState(
      brightnessRange.default
    );
    const [contrastValue, setContrastValue] = React.useState(
      contrastRange.default
    );
    const [gammaValue, setGammaValue] = React.useState(gammaRange.default);
    const [rotateValue, setRotateValue] = React.useState(rotateRange.default);
    const [scaleValue, setScaleValue] = React.useState(scaleRange.default);
    const [aspectRatioValue, setAspectRatioValue] = React.useState(
      aspectRatioRange.default
    );
    const [xposValue, setXPosValue] = React.useState(xposRange.default);
    const [yposValue, setYPosValue] = React.useState(yposRange.default);
    function getVideoElement(playerVideoContainer) {
      let videoElements = playerVideoContainer.getElementsByTagName("canvas");
      if (videoElements.length == 0) {
        videoElements = playerVideoContainer.getElementsByTagName("video");
      }
      if (videoElements.length > 0) {
        return videoElements[0];
      }
    }
    function updateVideoStyle() {
      const playerVideoContainer = document.getElementById(VIDEO_PLAYER_ID);
      if (!playerVideoContainer) {
        return;
      }
      const playerVideoElement = getVideoElement(playerVideoContainer);
      if (playerVideoElement != null) {
        let styleString = "filter:";
        let style = playerVideoElement.attributes.getNamedItem("style");
        if (style == null) {
          style = document.createAttribute("style");
          playerVideoElement.attributes.setNamedItem(style);
        }
        if (gammaValue !== gammaRange.default) {
          styleString += " url(#videoFilter)";
        }
        if (brightnessValue !== brightnessRange.default) {
          styleString += ` brightness(${brightnessValue}%)`;
        }
        if (contrastValue !== contrastRange.default) {
          styleString += ` contrast(${contrastValue}%)`;
        }
        styleString += "; transform: ";
        if (rotateValue !== rotateRange.default) {
          styleString += ` rotate(${(rotateValue - rotateRange.default) / rotateRange.divider}deg)`;
        }
        if (scaleValue !== scaleRange.default || aspectRatioValue !== aspectRatioRange.default) {
          let xScale = scaleValue / scaleRange.divider / 100;
          let yScale = scaleValue / scaleRange.divider / 100;
          if (aspectRatioValue > aspectRatioRange.default) {
            xScale *= (aspectRatioRange.divider + aspectRatioValue - aspectRatioRange.default) / aspectRatioRange.divider;
          } else if (aspectRatioValue < aspectRatioRange.default) {
            yScale *= (aspectRatioRange.divider + aspectRatioRange.default - aspectRatioValue) / aspectRatioRange.divider;
          }
          styleString += ` scale(${xScale},${yScale});`;
        }
        if (playerVideoElement.tagName == "CANVAS") {
          styleString += "; width: 100%; height: 100%; position: absolute;";
        }
        if (xposValue !== xposRange.default) {
          styleString += `left: ${xposValue}%;`;
        }
        if (yposValue !== yposRange.default) {
          styleString += `top: ${yposValue}%`;
        }
        style.value = `${styleString};`;
      }
    }
    function updateVideoFilters() {
      const filterContainer = document.getElementById(
        "video-filter-container"
      );
      if (filterContainer == null) {
        return;
      }
      const svg1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      const videoFilter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      videoFilter.setAttribute("id", "videoFilter");
      if (gammaValue !== gammaRange.default) {
        const feComponentTransfer = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feComponentTransfer"
        );
        const feFuncR = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feFuncR"
        );
        feFuncR.setAttribute("type", "gamma");
        feFuncR.setAttribute("amplitude", "1.0");
        feFuncR.setAttribute(
          "exponent",
          `${1 + (gammaRange.default - gammaValue) / gammaRange.divider}`
        );
        feFuncR.setAttribute("offset", "0.0");
        feComponentTransfer.appendChild(feFuncR);
        const feFuncG = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feFuncG"
        );
        feFuncG.setAttribute("type", "gamma");
        feFuncG.setAttribute("amplitude", "1.0");
        feFuncG.setAttribute(
          "exponent",
          `${1 + (gammaRange.default - gammaValue) / gammaRange.divider}`
        );
        feFuncG.setAttribute("offset", "0.0");
        feComponentTransfer.appendChild(feFuncG);
        const feFuncB = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feFuncB"
        );
        feFuncB.setAttribute("type", "gamma");
        feFuncB.setAttribute("amplitude", "1.0");
        feFuncB.setAttribute(
          "exponent",
          `${1 + (gammaRange.default - gammaValue) / gammaRange.divider}`
        );
        feFuncB.setAttribute("offset", "0.0");
        feComponentTransfer.appendChild(feFuncB);
        const feFuncA = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feFuncA"
        );
        feFuncA.setAttribute("type", "gamma");
        feFuncA.setAttribute("amplitude", "1.0");
        feFuncA.setAttribute("exponent", "1.0");
        feFuncA.setAttribute("offset", "0.0");
        feComponentTransfer.appendChild(feFuncA);
        videoFilter.appendChild(feComponentTransfer);
      }
      svg1.appendChild(videoFilter);
      const filterContainerSvgs = filterContainer.getElementsByTagNameNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      if (filterContainerSvgs.length === 0) {
        filterContainer.appendChild(svg1);
      } else {
        filterContainer.replaceChild(svg1, filterContainerSvgs[0]);
      }
    }
    function renderFilterContainer() {
      return /* @__PURE__ */ React.createElement("div", { id: "video-filter-container" });
    }
    updateVideoFilters();
    updateVideoStyle();
    return /* @__PURE__ */ React.createElement("div", { ref: popoverRef }, /* @__PURE__ */ React.createElement(Popover, { id: "popover-trigger-click-root-close", ...props }, /* @__PURE__ */ React.createElement("div", { className: "filter-overlay" }, /* @__PURE__ */ React.createElement("h5", null, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "effect_filters.name" })), /* @__PURE__ */ React.createElement(
      Slider_default,
      {
        title: "Brightness",
        className: "brightness-slider",
        range: brightnessRange,
        value: brightnessValue,
        setValue: setBrightnessValue,
        displayValue: `${brightnessValue / brightnessRange.divider}%`
      }
    ), /* @__PURE__ */ React.createElement(
      Slider_default,
      {
        title: "Contrast",
        className: "contrast-slider",
        range: contrastRange,
        value: contrastValue,
        setValue: setContrastValue,
        displayValue: `${contrastValue / contrastRange.divider}%`
      }
    ), /* @__PURE__ */ React.createElement(
      Slider_default,
      {
        title: "Gamma",
        className: "gamma-slider",
        range: gammaRange,
        value: gammaValue,
        setValue: setGammaValue,
        displayValue: `${gammaValue / gammaRange.divider}%`
      }
    ), /* @__PURE__ */ React.createElement("h5", null, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "effect_filters.name_transforms" })), /* @__PURE__ */ React.createElement(
      Slider_default,
      {
        title: "Rotate",
        className: "rotate-slider",
        range: rotateRange,
        value: rotateValue,
        setValue: setRotateValue,
        displayValue: `${rotateValue / rotateRange.divider}%`
      }
    ), /* @__PURE__ */ React.createElement(
      Slider_default,
      {
        title: "Scale",
        className: "scale-slider",
        range: scaleRange,
        value: scaleValue,
        setValue: setScaleValue,
        displayValue: `${scaleValue / scaleRange.divider}%`
      }
    ), /* @__PURE__ */ React.createElement(
      Slider_default,
      {
        title: "Aspect",
        className: "aspect-slider",
        range: aspectRatioRange,
        value: aspectRatioValue,
        setValue: setAspectRatioValue,
        displayValue: `${aspectRatioValue / aspectRatioRange.divider}%`
      }
    ), /* @__PURE__ */ React.createElement("h5", null, "Position"), /* @__PURE__ */ React.createElement(
      Slider_default,
      {
        title: "X",
        className: "xpos-slider",
        range: xposRange,
        value: xposValue,
        setValue: setXPosValue,
        displayValue: `${xposValue / xposRange.divider}%`
      }
    ), /* @__PURE__ */ React.createElement(
      Slider_default,
      {
        title: "Y",
        className: "ypos-slider",
        range: yposRange,
        value: yposValue,
        setValue: setYPosValue,
        displayValue: `${yposValue / yposRange.divider}%`
      }
    ))), renderFilterContainer());
  };
  var FilterOverlay_default = FilterOverlay;

  // src/components/Details/Filters/FilterButton.tsx
  var FilterButton = ({}) => {
    const buttonRef = React.useRef();
    const { faSliders } = libraries.FontAwesomeSolid;
    const { OverlayTrigger } = libraries.Bootstrap;
    const renderFilterOverlay = (props) => {
      return /* @__PURE__ */ React.createElement(FilterOverlay_default, { props });
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      OverlayTrigger,
      {
        placement: "top",
        trigger: "click",
        overlay: renderFilterOverlay,
        container: void 0,
        rootClose: true
      },
      /* @__PURE__ */ React.createElement(Button, { className: "wide-btn", ref: buttonRef }, /* @__PURE__ */ React.createElement(Icon, { icon: faSliders }), /* @__PURE__ */ React.createElement("span", { className: "label" }, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "filters" })))
    ));
  };
  var FilterButton_default = FilterButton;

  // src/components/Details/Header.tsx
  var Header = ({ title, onClickEdit }) => {
    const { faEllipsis, faPencil } = libraries.FontAwesomeSolid;
    return /* @__PURE__ */ React.createElement("div", { className: "header" }, /* @__PURE__ */ React.createElement("div", { className: "title" }, title), /* @__PURE__ */ React.createElement("div", { className: "buttons" }, /* @__PURE__ */ React.createElement(Button, { className: "wide-btn", onClick: onClickEdit }, /* @__PURE__ */ React.createElement(Icon, { icon: faPencil }), /* @__PURE__ */ React.createElement("span", { className: "label" }, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "actions.edit" }))), /* @__PURE__ */ React.createElement(FilterButton_default, null), /* @__PURE__ */ React.createElement(Button, null, /* @__PURE__ */ React.createElement(Icon, { icon: faEllipsis }))));
  };
  var Header_default = Header;

  // src/hooks/useConfiguration.tsx
  function useConfiguration() {
    const { data } = GQL.useConfigurationQuery();
    return data?.configuration?.plugins?.qxScenePage;
  }
  var useConfiguration_default = useConfiguration;

  // src/components/Details/Performers/PerformerItem.tsx
  var PerformerItem = ({ performer, showAge, scene_date }) => {
    function getAge() {
      if (!showAge)
        return;
      const age = TextUtils_default.calculateAge(performer.birthdate, scene_date);
      return /* @__PURE__ */ React.createElement("span", { className: "age" }, "(", age, ")");
    }
    return /* @__PURE__ */ React.createElement(Link, { to: `/performers/${performer.id}` }, /* @__PURE__ */ React.createElement("div", { className: "performer row" }, /* @__PURE__ */ React.createElement("div", { className: "picture" }, /* @__PURE__ */ React.createElement("img", { src: performer.image_path })), /* @__PURE__ */ React.createElement("div", { className: "info" }, /* @__PURE__ */ React.createElement("div", { className: "row" }, performer.name, getAge()), /* @__PURE__ */ React.createElement("div", { className: "scene-count row" }, performer.scene_count + " ", /* @__PURE__ */ React.createElement(
      FormattedMessage,
      {
        id: "countables.scenes",
        values: { count: performer.scene_count }
      }
    )))));
  };
  var PerformerItem_default = PerformerItem;

  // src/components/Details/Performers/PerformerList.tsx
  var PerformerList = ({ performers, scene_date }) => {
    const config = useConfiguration_default();
    function maybeShowAge() {
      if (!scene_date)
        return false;
      return config?.showPerformerAge;
    }
    return /* @__PURE__ */ React.createElement("div", { className: "performer-list row" }, performers?.map((performer) => /* @__PURE__ */ React.createElement(
      PerformerItem_default,
      {
        performer,
        scene_date,
        showAge: maybeShowAge()
      }
    )));
  };
  var PerformerList_default = PerformerList;

  // src/components/Details/Details.tsx
  var Details = ({ scene }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const detailsRef = React.useRef(null);
    const title = maybeGetSceneTitle(scene.title, scene.files);
    const toggleEditing = () => setIsEditing((value) => !value);
    React.useEffect(() => {
      if (isEditing) {
        detailsRef?.current?.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    }, [isEditing]);
    return /* @__PURE__ */ React.createElement("div", { className: "scene-details", ref: detailsRef }, /* @__PURE__ */ React.createElement(Header_default, { title, onClickEdit: () => toggleEditing() }), /* @__PURE__ */ React.createElement(
      PerformerList_default,
      {
        performers: scene.performers,
        scene_date: scene.date
      }
    ), !isEditing ? (
      // <Description scene={scene} />
      /* @__PURE__ */ React.createElement(React.Fragment, null)
    ) : /* @__PURE__ */ React.createElement(Editor_default, { scene }));
  };
  var Details_default = Details;

  // src/hooks/usePerformerScenes.tsx
  function usePerformerScenes(performer) {
    const props = React.useMemo(() => {
      return {
        variables: {
          scene_filter: {
            performers: {
              value: [performer.id],
              modifier: "INCLUDES"
            }
          },
          filter: {
            sort: "random"
          }
        }
      };
    }, [performer]);
    return GQL.useFindScenesQuery(props);
  }
  var usePerformerScenes_default = usePerformerScenes;

  // src/components/SidePanel/SceneItem.tsx
  var SceneItem = ({ scene }) => {
    const performers = scene.performers?.map((performer, index) => {
      return /* @__PURE__ */ React.createElement("span", { key: performer.id }, (index ? ", " : "") + performer.name);
    });
    return /* @__PURE__ */ React.createElement(Link, { to: `/scenes/${scene.id}` }, /* @__PURE__ */ React.createElement("div", { className: "scene-item" }, /* @__PURE__ */ React.createElement("div", { className: "thumbnail" }, /* @__PURE__ */ React.createElement("img", { src: scene.paths.screenshot })), /* @__PURE__ */ React.createElement("div", { className: "info" }, /* @__PURE__ */ React.createElement("div", { className: "title" }, maybeGetSceneTitle(scene.title, scene.files)), /* @__PURE__ */ React.createElement("div", { className: "studio" }, scene.studio?.name), /* @__PURE__ */ React.createElement("div", { className: "performers" }, performers), /* @__PURE__ */ React.createElement("div", { className: "date" }, scene.date && /* @__PURE__ */ React.createElement(
      FormattedDate,
      {
        value: scene.date,
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "utc"
      }
    )))));
  };
  var SceneItem_default = SceneItem;

  // src/components/SidePanel/SceneList.tsx
  var SceneList = ({ scenes }) => {
    if (!scenes || scenes.length === 0)
      return /* @__PURE__ */ React.createElement(LoadingIndicator, null);
    return /* @__PURE__ */ React.createElement("div", { className: "scene-list" }, scenes.map((scene) => /* @__PURE__ */ React.createElement(SceneItem_default, { scene })));
  };
  var SceneList_default = SceneList;

  // src/components/SidePanel/PerformerPanel.tsx
  var PerformerPanel = ({ performer }) => {
    const { data, loading } = usePerformerScenes_default(performer);
    const scenes = data?.findScenes?.scenes;
    if (loading)
      return /* @__PURE__ */ React.createElement(LoadingIndicator, null);
    return /* @__PURE__ */ React.createElement(SceneList_default, { scenes });
  };
  var PerformerPanel_default = PerformerPanel;

  // src/components/SidePanel/QueuePanel.tsx
  var QueuePanel = ({ queue }) => {
    return /* @__PURE__ */ React.createElement(SceneList_default, { scenes: queue });
  };
  var QueuePanel_default = QueuePanel;

  // src/hooks/useStudioScenes.tsx
  function useStudioScenes(studio) {
    const props = React.useMemo(() => {
      return {
        variables: {
          scene_filter: {
            studios: {
              value: [studio.id],
              modifier: "EQUALS"
            }
          },
          filter: {
            sort: "random"
          }
        }
      };
    }, [studio]);
    return GQL.useFindScenesQuery(props);
  }
  var useStudioScenes_default = useStudioScenes;

  // src/components/SidePanel/StudioPanel.tsx
  var StudioPanel = ({ studio }) => {
    const { data, loading } = useStudioScenes_default(studio);
    const scenes = data?.findScenes?.scenes;
    if (loading)
      return /* @__PURE__ */ React.createElement(LoadingIndicator, null);
    return /* @__PURE__ */ React.createElement(SceneList_default, { scenes });
  };
  var StudioPanel_default = StudioPanel;

  // src/components/SidePanel/SidePanel.tsx
  var SidePanel = ({ queue, studio, performers }) => {
    const { Nav, Tab } = libraries.Bootstrap;
    const determineDefaultTab = queue && queue.length > 0 ? "side-panel-queue" : studio ? "side-panel-studio" : performers ? `side-panel-performer-${performers[0].id}` : "";
    const [activeTabKey, setActiveTabKey] = React.useState(determineDefaultTab);
    const maybeRenderPerformerTabs = () => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, performers?.map((p) => /* @__PURE__ */ React.createElement(Nav.Item, null, /* @__PURE__ */ React.createElement(Nav.Link, { eventKey: `side-panel-performer-${p.id}` }, p.name))));
    };
    const maybeRenderPerformerTabPanes = () => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, performers?.map((p) => /* @__PURE__ */ React.createElement(Tab.Pane, { eventKey: `side-panel-performer-${p.id}` }, /* @__PURE__ */ React.createElement(PerformerPanel_default, { performer: p }))));
    };
    return /* @__PURE__ */ React.createElement("div", { className: "side-panel" }, /* @__PURE__ */ React.createElement(
      Tab.Container,
      {
        activeKey: activeTabKey,
        onSelect: (tab) => tab && setActiveTabKey(tab)
      },
      /* @__PURE__ */ React.createElement(Nav, { variant: "tabs", className: "mr-auto" }, queue && queue.length > 0 && /* @__PURE__ */ React.createElement(Nav.Item, null, /* @__PURE__ */ React.createElement(Nav.Link, { eventKey: "side-panel-queue" }, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "queue" }))), studio && /* @__PURE__ */ React.createElement(Nav.Item, null, /* @__PURE__ */ React.createElement(Nav.Link, { eventKey: "side-panel-studio" }, studio.name)), maybeRenderPerformerTabs()),
      /* @__PURE__ */ React.createElement(Tab.Content, null, queue && queue.length > 0 && /* @__PURE__ */ React.createElement(Tab.Pane, { eventKey: "side-panel-queue" }, /* @__PURE__ */ React.createElement(QueuePanel_default, { queue })), studio && /* @__PURE__ */ React.createElement(Tab.Pane, { eventKey: "side-panel-studio" }, /* @__PURE__ */ React.createElement(StudioPanel_default, { studio })), maybeRenderPerformerTabPanes())
    ));
  };
  var SidePanel_default = SidePanel;

  // src/qxScenePage.tsx
  (function() {
    const ScenePage = ({ props }) => {
      const scene = props.scene;
      return /* @__PURE__ */ React.createElement("div", { className: "scene-container" }, /* @__PURE__ */ React.createElement(Details_default, { scene }), /* @__PURE__ */ React.createElement(
        SidePanel_default,
        {
          queue: props.queueScenes,
          studio: scene.studio,
          performers: scene.performers
        }
      ));
    };
    patch.instead("ScenePage", function(props, _, original) {
      return /* @__PURE__ */ React.createElement(ScenePage, { props });
    });
  })();
})();
