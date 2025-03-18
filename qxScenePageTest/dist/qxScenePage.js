"use strict";
(() => {
  // src/qxScenePage.tsx
  var api = window.PluginApi;
  (function() {
    const React = api.React;
    const ScenePage = ({ props }) => {
      const {
        TagLink
      } = api.components;
      const scene = props.scene;
      function maybeRenderTags() {
        if (scene.tags.length <= 0)
          return;
        return /* @__PURE__ */ React.createElement("div", { className: "scene-card__tags" }, scene.tags.map((tag) => /* @__PURE__ */ React.createElement(TagLink, { key: tag.id, tag })));
      }
      return /* @__PURE__ */ React.createElement(React.Fragment, null, maybeRenderTags());
    };
    api.patch.instead("ScenePage", function(props, _, original) {
      return /* @__PURE__ */ React.createElement(ScenePage, { props });
    });
  })();
})();
