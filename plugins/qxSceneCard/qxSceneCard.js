"use strict";
(() => {
  // src/globals.ts
  var api = window.PluginApi;
  var { React, GQL, libraries, patch, components } = api;

  // src/hooks/useSceneDate.tsx
  var SceneDateContext = React.createContext({
    date: {}
  });
  var SceneDateProvider = ({ date, children }) => {
    return /* @__PURE__ */ React.createElement(SceneDateContext.Provider, { value: { date } }, children);
  };
  var useSceneDate = () => React.useContext(SceneDateContext);

  // src/components/Footer.tsx
  var Footer = ({ id, date, views, studio }) => {
    const { OverlayTrigger, Tooltip } = libraries.Bootstrap;
    const { Link } = libraries.ReactRouterDOM;
    const { FormattedDate } = libraries.Intl;
    const [fetchLastPlayed, { data }] = GQL.useFindSceneLazyQuery();
    const onTooltipEnter = () => {
      fetchLastPlayed({ variables: { id } });
    };
    const LastViewedTooltip = (props) => {
      if (!data?.findScene?.last_played_at)
        return /* @__PURE__ */ React.createElement(Tooltip, { ...props }, "Error fetching last played");
      return /* @__PURE__ */ React.createElement(Tooltip, { ...props }, "Last Viewed", " ", /* @__PURE__ */ React.createElement(
        FormattedDate,
        {
          value: data.findScene.last_played_at,
          format: "long",
          timeZone: "utc"
        }
      ));
    };
    const RenderViewCount = () => {
      return /* @__PURE__ */ React.createElement("div", null, views === 1 && "1 view" || `${views} views`);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "footer" }, /* @__PURE__ */ React.createElement("span", { className: "studio" }, studio && /* @__PURE__ */ React.createElement(Link, { to: `/studios/${studio.id}` }, studio.name)), /* @__PURE__ */ React.createElement("span", { className: "views" }, views && views > 0 ? /* @__PURE__ */ React.createElement(
      OverlayTrigger,
      {
        placement: "bottom",
        overlay: LastViewedTooltip,
        onEnter: onTooltipEnter,
        id: "last-played-tooltip"
      },
      RenderViewCount()
    ) : RenderViewCount()), /* @__PURE__ */ React.createElement("span", { className: "date" }, date && /* @__PURE__ */ React.createElement(FormattedDate, { value: date, format: "short", timeZone: "utc" })));
  };

  // src/components/Performers/PerformerListLink.tsx
  var PerformerListLink = ({ performer }) => {
    const { Link } = libraries.ReactRouterDOM;
    return /* @__PURE__ */ React.createElement(Link, { to: `/performers/${performer.id}`, className: performer.gender }, performer.name);
  };
  var PerformerListLink_default = PerformerListLink;

  // src/hooks/usePerformerQuery.ts
  var usePerformerQuery = (performers) => {
    const props = React.useMemo(() => {
      return {
        variables: {
          performer_ids: performers.map((p) => p.id)
        }
      };
    }, [performers]);
    return GQL.useFindPerformersQuery(props);
  };

  // src/utils/text.ts
  var stringToDate = (dateString) => {
    if (!dateString)
      return null;
    const parts = dateString.split("-");
    if (parts.length !== 3)
      return null;
    const year = Number(parts[0]);
    const monthIndex = Math.max(0, Number(parts[1]) - 1);
    const day = Number(parts[2]);
    return new Date(year, monthIndex, day, 0, 0, 0, 0);
  };
  var getAge = (dateString, fromDateString) => {
    if (!dateString)
      return 0;
    const birthdate = stringToDate(dateString);
    const fromDate = fromDateString ? stringToDate(fromDateString) : /* @__PURE__ */ new Date();
    if (!birthdate || !fromDate)
      return 0;
    let age = fromDate.getFullYear() - birthdate.getFullYear();
    if (birthdate.getMonth() > fromDate.getMonth() || birthdate.getMonth() >= fromDate.getMonth() && birthdate.getDate() > fromDate.getDate()) {
      age -= 1;
    }
    return age;
  };
  var TextUtils = {
    stringToDate,
    getAge
  };
  var text_default = TextUtils;

  // src/components/Performers/PerformerHoverPopover.tsx
  var PerformerHoverPopover = ({ performers, props }) => {
    const { Link } = libraries.ReactRouterDOM;
    const { Popover } = libraries.Bootstrap;
    const { useIntl } = libraries.Intl;
    const { LoadingIndicator } = components;
    const { loading, data } = usePerformerQuery(performers);
    const sceneDateContext = useSceneDate();
    const intl = useIntl();
    const getIntlStringForAgeContext = (age) => {
      const ageL10Id = sceneDateContext.date ? "media_info.performer_card.age_context" : "media_info.performer_card.age";
      const ageL10String = intl.formatMessage({
        id: "years_old",
        defaultMessage: "years old"
      });
      const ageString = intl.formatMessage(
        { id: ageL10Id },
        { age, years_old: ageL10String }
      );
      return ageString;
    };
    const getPerformerAge = (performer) => {
      const performerResults = data?.findPerformers.performers;
      if (!performerResults || loading)
        return null;
      const p = performerResults.find((p2) => p2.id === performer.id);
      if (!p?.birthdate)
        return null;
      const getAge2 = text_default.getAge(
        p.birthdate,
        sceneDateContext.date ?? p.death_date
      );
      return getIntlStringForAgeContext(getAge2);
    };
    return /* @__PURE__ */ React.createElement(Popover, { id: "performer-popover-container", ...props }, /* @__PURE__ */ React.createElement("div", { className: "flex-col" }, loading && /* @__PURE__ */ React.createElement("div", { className: "qx-loading-indicator" }, /* @__PURE__ */ React.createElement(LoadingIndicator, null)) || performers?.map((p, i) => {
      return /* @__PURE__ */ React.createElement(Link, { to: `/performers/${p.id}` }, /* @__PURE__ */ React.createElement("div", { className: "performer-row" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          className: "image-thumbnail",
          alt: p.name ?? "",
          src: p.image_path ?? ""
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "performer-details" }, /* @__PURE__ */ React.createElement("div", { className: `name ${p.gender}` }, p.name), /* @__PURE__ */ React.createElement("div", { className: "age" }, getPerformerAge(p)))));
    })));
  };
  var PerformerHoverPopover_default = PerformerHoverPopover;

  // src/components/Performers/PerformerList.tsx
  var PerformerList = ({ performers }) => {
    if (!performers)
      return null;
    const containerRef = React.useRef(null);
    const moreRef = React.useRef(null);
    const [visibleCount, setVisibleCount] = React.useState(performers.length);
    const { OverlayTrigger } = libraries.Bootstrap;
    React.useLayoutEffect(() => {
      if (!containerRef.current || !performers)
        return;
      const calculateVisible = () => {
        if (!containerRef.current || !performers)
          return;
        const containerWidth = containerRef.current.offsetWidth;
        const elements = Array.from(
          containerRef.current.children
        );
        const moreWidth = moreRef.current?.offsetWidth || 10;
        let totalWidth = 0;
        let count = 0;
        for (const element of elements) {
          const elementWidth = element.offsetWidth;
          if (count < performers.length - 1) {
            if (totalWidth + elementWidth + moreWidth <= containerWidth) {
              totalWidth += elementWidth;
              count++;
            } else {
              break;
            }
          } else {
            if (totalWidth + elementWidth <= containerWidth) {
              totalWidth += elementWidth;
              count++;
            }
          }
        }
        setVisibleCount(count);
      };
      const resizeObserver = new ResizeObserver(() => calculateVisible());
      resizeObserver.observe(containerRef.current);
      calculateVisible();
      return () => resizeObserver.disconnect();
    }, [performers]);
    const hiddenCount = performers.length - visibleCount;
    const performerPopover = (performer, props) => {
      return /* @__PURE__ */ React.createElement(
        PerformerHoverPopover_default,
        {
          performers: [performer],
          key: performer.id,
          props
        }
      );
    };
    const showMorePerformersPopover = (props) => {
      if (hiddenCount === 0)
        return null;
      return /* @__PURE__ */ React.createElement(
        PerformerHoverPopover_default,
        {
          performers: performers.slice(visibleCount),
          props
        }
      );
    };
    return /* @__PURE__ */ React.createElement("div", { className: "performers" }, /* @__PURE__ */ React.createElement("div", { className: "list", ref: containerRef }, performers?.slice(0, visibleCount).map((p) => /* @__PURE__ */ React.createElement(
      OverlayTrigger,
      {
        key: p.id,
        placement: "bottom",
        trigger: "hover",
        overlay: (props) => performerPopover(p, props)
      },
      /* @__PURE__ */ React.createElement("span", { className: "performer-name" }, /* @__PURE__ */ React.createElement(PerformerListLink_default, { performer: p, key: p.id }))
    ))), hiddenCount > 0 ? /* @__PURE__ */ React.createElement(
      OverlayTrigger,
      {
        placement: "bottom",
        trigger: "click",
        overlay: (props) => showMorePerformersPopover(props),
        rootClose: true
      },
      /* @__PURE__ */ React.createElement("span", { className: "show-more", ref: moreRef }, "+", hiddenCount)
    ) : /* @__PURE__ */ React.createElement("span", { className: "show-more", ref: moreRef }, " "));
  };

  // src/helpers/FadeWatched.ts
  var SetWatchedProperty = (sceneCardNode, views) => {
    if (!sceneCardNode || views === 0)
      return;
    sceneCardNode.classList.add("watched");
  };
  var FadeWatched_default = SetWatchedProperty;

  // src/helpers/PopoverButtons.ts
  var HideIndividualPopoverButtons = (sceneCardNode, settings) => {
    if (!sceneCardNode || !settings)
      return;
    if (settings.hideMarkers) {
      const markerNode = sceneCardNode.querySelector(".marker-count");
      markerNode?.classList.add("hide");
    }
    if (settings.hideMovies) {
      const movieNode = sceneCardNode.querySelector(".movie-count");
      movieNode?.classList.add("hide");
    }
    if (settings.hideOCounter) {
      const oCounterNode = sceneCardNode.querySelector(".o-count");
      oCounterNode?.classList.add("hide");
    }
    const performerNode = sceneCardNode.querySelector(".performer-count");
    performerNode?.classList.add("hide");
  };
  var PopoverButtons_default = HideIndividualPopoverButtons;

  // src/helpers/StudioLogo.ts
  var HideStudioLogo = (sceneCardNode) => {
    if (!sceneCardNode)
      return;
    const logoNode = sceneCardNode.querySelector(".studio-overlay");
    logoNode?.classList.add("hide");
  };
  var StudioLogo_default = HideStudioLogo;

  // src/hooks/useSettings.ts
  var useSettings = () => {
    const { data } = GQL.useConfigurationQuery();
    const settings = data?.configuration?.plugins?.qxSceneCard;
    return {
      fadeWatched: settings?.fadeWatched,
      hideOCounter: settings?.hideOCounter,
      hideMarkers: settings?.hideMarkers,
      hideMovies: settings?.hideMovies,
      hideStudio: settings?.hideStudio
    };
  };

  // src/components/SceneCardDetails.tsx
  var SceneCardDetails = ({ props }) => {
    const nodeRef = React.useRef(null);
    const scene = props.scene;
    const settings = useSettings();
    React.useEffect(() => {
      const sceneCardNode = nodeRef.current?.parentElement?.parentElement;
      if (settings.hideStudio) {
        StudioLogo_default(sceneCardNode);
      }
      if (settings.fadeWatched) {
        FadeWatched_default(sceneCardNode, scene.play_count);
      }
      PopoverButtons_default(sceneCardNode, settings);
    }, []);
    return /* @__PURE__ */ React.createElement(SceneDateProvider, { date: scene.date }, /* @__PURE__ */ React.createElement("div", { ref: nodeRef }), /* @__PURE__ */ React.createElement(PerformerList, { performers: scene.performers }), /* @__PURE__ */ React.createElement(
      Footer,
      {
        id: scene.id,
        date: scene.date,
        views: scene.play_count,
        studio: scene.studio
      }
    ));
  };
  var SceneCardDetails_default = SceneCardDetails;

  // src/qxSceneCard.tsx
  patch.instead("SceneCard.Details", function(props, _, __) {
    return /* @__PURE__ */ React.createElement(SceneCardDetails_default, { props });
  });
})();
