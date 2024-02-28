"use strict";
(() => {
  // src/qxSceneCard.tsx
  (function() {
    const api = window.PluginApi;
    const React = api.React;
    const GQL = api.GQL;
    const { Link, NavLink } = api.libraries.ReactRouterDOM;
    const { FormattedDate } = api.libraries.Intl;
    const RemoveStudioLogo = (sceneCardNode) => {
      if (!sceneCardNode)
        return;
      const logoNode = sceneCardNode.querySelector(".studio-overlay");
      if (logoNode) {
        logoNode.classList.add("hide");
      }
    };
    const SetWatchedProperty = (sceneCardNode, views) => {
      if (!sceneCardNode || views === 0)
        return;
      sceneCardNode.classList.add("watched");
    };
    const isPerformerListOverflowed = (listNode) => {
      return listNode.scrollHeight > listNode.clientHeight || listNode.scrollWidth > listNode.clientWidth;
    };
    const RenderPerformers = (performers) => {
      const nodeRef = React.useRef(null);
      return /* @__PURE__ */ React.createElement("div", { className: "performers" }, /* @__PURE__ */ React.createElement("div", { ref: nodeRef, className: "list" }, performers?.map((performer) => {
        if (nodeRef?.current && isPerformerListOverflowed(nodeRef.current)) {
          console.log("overflow");
          return /* @__PURE__ */ React.createElement(React.Fragment, null);
        }
        return /* @__PURE__ */ React.createElement(
          NavLink,
          {
            to: `/performers/${performer.id}`,
            className: performer.gender
          },
          performer.name
        );
      })));
    };
    const RenderFooter = (date, views, studio) => {
      return /* @__PURE__ */ React.createElement("div", { className: "footer" }, /* @__PURE__ */ React.createElement("span", { className: "studio" }, studio && /* @__PURE__ */ React.createElement(Link, { to: `/studios/${studio.id}` }, studio.name)), /* @__PURE__ */ React.createElement("span", { className: "views" }, views, " ", views === 1 && "view" || "views"), /* @__PURE__ */ React.createElement("span", { className: "date" }, date && /* @__PURE__ */ React.createElement(
        FormattedDate,
        {
          value: date,
          format: "short",
          timeZone: "utc"
        }
      )));
    };
    const SceneCardDetails = ({ props }) => {
      const nodeRef = React.useRef(null);
      const scene = props.scene;
      const { data } = GQL.useConfigurationQuery();
      const qxSceneCardSettings = data?.configuration?.plugins?.qxSceneCard;
      const isRemoveStudioSettingEnabled = qxSceneCardSettings?.studio ?? false;
      const isWatchedSettingEnabled = qxSceneCardSettings?.watched ?? false;
      React.useEffect(() => {
        const sceneCardNode = nodeRef.current?.parentElement?.parentElement;
        if (isRemoveStudioSettingEnabled) {
          RemoveStudioLogo(sceneCardNode);
        }
        if (isWatchedSettingEnabled) {
          SetWatchedProperty(sceneCardNode, scene.play_count);
        }
      }, []);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { ref: nodeRef }), RenderPerformers(scene.performers), RenderFooter(
        scene.date,
        scene.play_count,
        scene.studio
      ));
    };
    api.patch.instead("SceneCard.Details", function(props, _, original) {
      return /* @__PURE__ */ React.createElement(SceneCardDetails, { props });
    });
  })();
})();
