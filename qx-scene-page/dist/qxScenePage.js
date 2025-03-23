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
  var {
    LoadingIndicator
  } = components;
  var {
    FormattedDate,
    FormattedMessage
  } = libraries.Intl;
  var {
    Link,
    NavLink
  } = libraries.ReactRouterDOM;

  // src/utils/TextUtils.ts
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

  // src/components/Header.tsx
  var Header = ({
    title,
    files
  }) => {
    const {
      Button
    } = libraries.Bootstrap;
    const {
      Icon
    } = components;
    const {
      faEllipsis,
      faPencil
    } = libraries.FontAwesomeSolid;
    return /* @__PURE__ */ React.createElement("div", { className: "header" }, /* @__PURE__ */ React.createElement("div", { className: "title" }, maybeGetSceneTitle(title, files)), /* @__PURE__ */ React.createElement("div", { className: "buttons" }, /* @__PURE__ */ React.createElement(Button, { className: "wide-btn" }, /* @__PURE__ */ React.createElement(Icon, { icon: faPencil }), /* @__PURE__ */ React.createElement("span", { className: "label" }, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "actions.edit" }))), /* @__PURE__ */ React.createElement(Button, null, /* @__PURE__ */ React.createElement(Icon, { icon: faEllipsis }))));
  };
  var Header_default = Header;

  // src/components/PerformerList.tsx
  var PerformerList = ({
    performers
  }) => {
    return /* @__PURE__ */ React.createElement("div", { className: "performer-list row" }, performers?.map((performer) => /* @__PURE__ */ React.createElement(Link, { to: `/performers/${performer.id}` }, /* @__PURE__ */ React.createElement("div", { className: "performer row" }, /* @__PURE__ */ React.createElement("div", { className: "picture" }, /* @__PURE__ */ React.createElement("img", { src: performer.image_path })), /* @__PURE__ */ React.createElement("div", { className: "info" }, /* @__PURE__ */ React.createElement("div", { className: "row" }, performer.name), /* @__PURE__ */ React.createElement("div", { className: "scene-count row" }, performer.scene_count + " ", /* @__PURE__ */ React.createElement(
      FormattedMessage,
      {
        id: "countables.scenes",
        values: { count: performer.scene_count }
      }
    )))))));
  };
  var PerformerList_default = PerformerList;

  // src/components/Description.tsx
  var Description = ({
    details,
    date,
    tags,
    play_count,
    created_at,
    updated_at,
    studio
  }) => {
    const componentsToLoad = [
      loadableComponents.TagLink
    ];
    const componentsLoading = hooks.useLoadComponents(componentsToLoad);
    const {
      LoadingIndicator: LoadingIndicator2,
      TagLink
    } = components;
    const {
      Nav,
      Tab
    } = libraries.Bootstrap;
    function maybeRenderTags() {
      if (tags.length <= 0)
        return;
      return /* @__PURE__ */ React.createElement("div", { className: "tags" }, tags.map((tag) => /* @__PURE__ */ React.createElement(TagLink, { key: tag.id, tag })));
    }
    if (componentsLoading)
      return /* @__PURE__ */ React.createElement(LoadingIndicator2, null);
    return /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement("div", { className: "description col-9" }, /* @__PURE__ */ React.createElement("div", { className: "row" }, date && /* @__PURE__ */ React.createElement(
      FormattedDate,
      {
        value: date,
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "utc"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "row" }, maybeRenderTags()), /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement("p", { className: "pre" }, studio && /* @__PURE__ */ React.createElement("img", { className: "studio-image", src: studio.image_path }), details), /* @__PURE__ */ React.createElement("p", { className: "pre" }, created_at, updated_at))), /* @__PURE__ */ React.createElement("div", { className: "markers col-3" }, /* @__PURE__ */ React.createElement(Tab.Container, null, /* @__PURE__ */ React.createElement(Nav, { variant: "tabs", className: "mr-auto" }, /* @__PURE__ */ React.createElement(Nav.Item, null, /* @__PURE__ */ React.createElement(Nav.Link, null, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "markers" }))), /* @__PURE__ */ React.createElement(Nav.Item, null, /* @__PURE__ */ React.createElement(Nav.Link, null, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "filters" }))), /* @__PURE__ */ React.createElement(Nav.Item, null, /* @__PURE__ */ React.createElement(Nav.Link, null, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "file_info" }))), /* @__PURE__ */ React.createElement(Nav.Item, null, /* @__PURE__ */ React.createElement(Nav.Link, null, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "history" })))))));
  };
  var Description_default = Description;

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
  var SceneItem = ({
    scene
  }) => {
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
  var PerformerPanel = ({
    performer
  }) => {
    const { data, loading } = usePerformerScenes_default(performer);
    const scenes = data?.findScenes?.scenes;
    if (loading)
      return /* @__PURE__ */ React.createElement(LoadingIndicator, null);
    return /* @__PURE__ */ React.createElement(SceneList_default, { scenes });
  };
  var PerformerPanel_default = PerformerPanel;

  // src/components/SidePanel/QueuePanel.tsx
  var QueuePanel = ({
    queue
  }) => {
    const sceneItems = queue.map((scene) => /* @__PURE__ */ React.createElement(SceneItem_default, { scene }));
    return /* @__PURE__ */ React.createElement("div", { className: "scene-list" }, sceneItems);
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
  var StudioPanel = ({
    studio
  }) => {
    const { data, loading } = useStudioScenes_default(studio);
    const scenes = data?.findScenes?.scenes;
    if (loading)
      return /* @__PURE__ */ React.createElement(LoadingIndicator, null);
    return /* @__PURE__ */ React.createElement(SceneList_default, { scenes });
  };
  var StudioPanel_default = StudioPanel;

  // src/components/SidePanel/SidePanel.tsx
  var SidePanel = ({
    queue,
    studio,
    performers
  }) => {
    const {
      Nav,
      Tab
    } = libraries.Bootstrap;
    const determineDefaultTab = queue && queue.length > 0 ? "side-panel-queue" : studio ? "side-panel-studio" : performers ? `side-panel-performer-${performers[0].id}` : "";
    console.log(determineDefaultTab);
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
      return /* @__PURE__ */ React.createElement("div", { className: "scene-container" }, /* @__PURE__ */ React.createElement("div", { className: "scene-details" }, /* @__PURE__ */ React.createElement(
        Header_default,
        {
          title: scene.title,
          files: scene.files
        }
      ), /* @__PURE__ */ React.createElement(PerformerList_default, { performers: scene.performers }), /* @__PURE__ */ React.createElement(
        Description_default,
        {
          details: scene.details,
          date: scene.date,
          tags: scene.tags,
          play_count: scene.play_count,
          created_at: scene.created_at,
          updated_at: scene.updated_at,
          studio: scene.studio
        }
      )), /* @__PURE__ */ React.createElement(
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
