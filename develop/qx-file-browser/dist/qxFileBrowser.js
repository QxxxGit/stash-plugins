"use strict";
(() => {
  // src/globals.ts
  var api = window.PluginApi;
  var { React, GQL, libraries, patch, components, register, hooks } = api;
  var gql = libraries.Apollo.gql;
  var { Icon } = components;

  // src/domain/files/types/VirtualFolders.ts
  var VIRTUAL_FOLDER_IDS = [
    "favorites",
    "library",
    "recent",
    "trash"
  ];
  var DEFAULT_VIRTUAL_FOLDER = "library";

  // src/domain/files/utils/DisplayModeUtils.ts
  var Parse = (value) => {
    if (value === "grid" || value === "list") {
      return value;
    }
    return void 0;
  };
  var DisplayModeUtils = {
    Parse
  };

  // src/domain/files/graphql/fragments/FolderFragment.ts
  var FOLDER_FRAGMENT = gql`
	fragment FolderFields on Folder {
		id
		path
		basename
		mod_time
		sub_folders {
			id
		}
		created_at
		updated_at
	}
`;

  // src/domain/files/graphql/queries/GetFolderMetadataQuery.ts
  var GET_FOLDER_METADATA_QUERY = gql`
	${FOLDER_FRAGMENT}

	query GetFolderData($folderId: ID, $folderPath: String) {
		findFolder(id: $folderId, path: $folderPath) {
			...FolderFields

			parent_folders {
				id
				basename
			}

			sub_folders {
				...FolderFields
			}
		}
	}
`;

  // src/domain/files/utils/FolderUtils.ts
  var IsVirtualFolder = (value) => {
    return VIRTUAL_FOLDER_IDS.includes(value);
  };
  var ParseFolderId = (value) => {
    if (!value)
      return void 0;
    if (IsVirtualFolder(value))
      return value;
    const parseNumber = Number(value);
    if (!Number.isNaN(parseNumber))
      return parseNumber;
    return void 0;
  };
  async function FetchByPath(client, paths) {
    const results = await Promise.all(
      paths.map(
        (path) => client.query({
          query: GET_FOLDER_METADATA_QUERY,
          variables: { folderPath: path },
          errorPolicy: "all"
        })
      )
    );
    let folderErrors = [];
    const convertResults = results.flatMap((r, i) => {
      if (r.errors?.length) {
        folderErrors.push(`GQL error for ${paths[i]}`, r.errors);
        return [];
      }
      return r.data?.findFolder ? [r.data.findFolder] : [];
    });
    return {
      data: convertResults,
      errors: folderErrors
    };
  }
  var FolderUtils = {
    IsVirtualFolder,
    ParseFolderId,
    FetchByPath
  };

  // src/domain/url/providers/URLParamsProvider.tsx
  var URLParamsContext = React.createContext(null);
  var URLParamsProvider = ({ children }) => {
    const location2 = libraries.ReactRouterDOM.useLocation();
    const history = libraries.ReactRouterDOM.useHistory();
    const searchParams = React.useMemo(
      () => new URLSearchParams(location2.search),
      [location2.search]
    );
    const params = {
      folder: FolderUtils.ParseFolderId(searchParams.get("folder")),
      display: DisplayModeUtils.Parse(searchParams.get("display")),
      query: searchParams.get("search") ?? void 0
    };
    React.useEffect(() => {
      if (!searchParams.get("folder")) {
        const next = new URLSearchParams(location2.search);
        next.set("folder", DEFAULT_VIRTUAL_FOLDER);
        history.replace({
          ...location2,
          search: next.toString()
        });
      }
    }, [location2, history, searchParams]);
    const setParam = (key, value) => {
      const next = new URLSearchParams(location2.search);
      if (!value)
        next.delete(key);
      else
        next.set(key, value);
      history.push({
        ...location2,
        search: next.toString()
      });
    };
    return /* @__PURE__ */ React.createElement(URLParamsContext.Provider, { value: { params, setParam } }, children);
  };
  var useURLParams = () => {
    const context = React.useContext(URLParamsContext);
    if (!context)
      throw new Error(
        "Issue using URLParamsContext, make sure it's within provider"
      );
    return context;
  };

  // src/domain/files/hooks/useStashes.tsx
  function useStashes() {
    const { data } = GQL.useConfigurationQuery();
    const apollo = libraries.Apollo;
    const client = apollo.useApolloClient();
    const stashes = data?.configuration?.general?.stashes ?? [];
    const [folders, setFolders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setErrors] = React.useState([]);
    React.useEffect(() => {
      if (!data)
        return;
      if (!stashes.length) {
        setFolders([]);
        setLoading(false);
        return;
      }
      let cancelled = false;
      FolderUtils.FetchByPath(
        client,
        stashes.map((s) => s.path)
      ).then((results) => {
        if (!cancelled) {
          setFolders(results.data);
          setErrors((current) => [
            ...current,
            ...results.errors
          ]);
        }
      }).catch(
        (errors) => setErrors((current) => [...current, ...errors])
      ).finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [stashes]);
    return {
      data: folders,
      loading,
      error
    };
  }

  // src/domain/stash/hooks/useLightbox.tsx
  var useLightbox = (files) => {
    const images = React.useMemo(() => {
      return files?.filter((f) => f.__typename === "ImageFile").flatMap((f) => f.images) ?? [];
    }, [files]);
    const lightboxState = React.useMemo(() => {
      return {
        images
      };
    }, [images]);
    const showLightbox = hooks.useLightbox(lightboxState, []);
    const openLightbox = React.useCallback(
      (imageId) => {
        const index = images.findIndex((img) => img.id === imageId);
        if (index === -1)
          return;
        showLightbox({ initialIndex: index });
      },
      [images, showLightbox]
    );
    return { openLightbox };
  };

  // src/domain/files/hooks/useNavigation.tsx
  var useNavigation = () => {
    const history = libraries.ReactRouterDOM.useHistory();
    const goToFolder = (id) => {
      const params = new URLSearchParams(location.search);
      params.set("folder", id);
      history.push({
        search: params.toString()
      });
    };
    const goToRecord = (type, id) => {
      switch (type) {
        case 1 /* Image */:
          history.push(`/images/${id}`);
          break;
        case 2 /* Video */:
          history.push(`/scenes/${id}`);
          break;
      }
    };
    return {
      goToFolder,
      goToRecord
    };
  };

  // src/domain/files/contextmenus/ContextMenuItem.tsx
  var ContextMenuItem = ({ onClick, children }) => {
    return /* @__PURE__ */ React.createElement("div", { className: "menu-item", onClick }, children);
  };

  // src/domain/files/contextmenus/menus/FolderMenu.tsx
  var FolderMenu = ({ folder, goToFolder }) => {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContextMenuItem, { onClick: () => goToFolder(folder.id) }, "Open"), /* @__PURE__ */ React.createElement(ContextMenuItem, { onClick: () => {
    } }, "Properties"));
  };

  // src/domain/files/contextmenus/menus/ImageMenu.tsx
  var ImageMenu = ({ file, goToRecord, onImagePreview }) => {
    const image = file.images[0];
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContextMenuItem, { onClick: () => onImagePreview(image.id) }, "Preview"), /* @__PURE__ */ React.createElement(ContextMenuItem, { onClick: goToRecord }, "Go to page"), /* @__PURE__ */ React.createElement(ContextMenuItem, null, "Properties"));
  };

  // src/domain/files/contextmenus/menus/VideoMenu.tsx
  var VideoMenu = ({ file, goToRecord }) => {
    const video = file.scenes[0];
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContextMenuItem, { onClick: goToRecord }, "Go to page"), /* @__PURE__ */ React.createElement(ContextMenuItem, null, "Properties"));
  };

  // src/domain/files/contextmenus/ContextMenuRenderer.tsx
  var ContextMenuRenderer = ({ data, dependencies }) => {
    const { goToFolder, goToRecord } = useNavigation();
    switch (data.type) {
      case 0 /* Folder */:
        return /* @__PURE__ */ React.createElement(
          FolderMenu,
          {
            folder: data.item,
            goToFolder: () => goToFolder(data.item.id)
          }
        );
      case 1 /* Image */:
        const imageFile = data.item;
        return /* @__PURE__ */ React.createElement(
          ImageMenu,
          {
            file: imageFile,
            goToRecord: () => goToRecord(1 /* Image */, imageFile.images[0].id),
            onImagePreview: dependencies.onImagePreview
          }
        );
      case 2 /* Video */:
        const videoFile = data.item;
        return /* @__PURE__ */ React.createElement(
          VideoMenu,
          {
            file: videoFile,
            goToRecord: () => goToRecord(2 /* Video */, videoFile.scenes[0].id)
          }
        );
      default:
        return null;
    }
  };

  // src/domain/files/contextmenus/ContextMenu.tsx
  var ContextMenu = ({ state, onImagePreview }) => {
    if (!state)
      return null;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "context-menu",
        style: {
          position: "fixed",
          left: state.x,
          top: state.y
        }
      },
      /* @__PURE__ */ React.createElement(
        ContextMenuRenderer,
        {
          data: state.data,
          dependencies: { onImagePreview }
        }
      )
    );
  };

  // src/domain/files/hooks/useContextMenu.tsx
  var useContextMenu = () => {
    const [contextMenu, setContextMenu] = React.useState(null);
    const openContextMenu = (e, data) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        data
      });
    };
    const closeContextMenu = () => {
      setContextMenu(null);
    };
    React.useEffect(() => {
      window.addEventListener("click", closeContextMenu);
      return () => {
        window.removeEventListener("click", closeContextMenu);
      };
    }, []);
    return {
      contextMenu,
      openContextMenu,
      closeContextMenu
    };
  };

  // src/domain/files/hooks/useInfiniteScrolling.tsx
  var useInfiniteScroll = ({
    container,
    isLoading,
    hasMore,
    onLoadMore
  }) => {
    const ref = React.useRef(null);
    const loadingRef = React.useRef(false);
    React.useEffect(() => {
      const target = ref.current;
      if (!target)
        return;
      const observer = new IntersectionObserver(
        async (entries) => {
          const first = entries[0];
          if (!first.isIntersecting)
            return;
          if (!hasMore)
            return;
          if (loadingRef.current)
            return;
          loadingRef.current = true;
          try {
            await onLoadMore?.();
          } finally {
            loadingRef.current = false;
          }
        },
        {
          root: null,
          rootMargin: "300px"
        }
      );
      observer.observe(target);
      return () => {
        observer.disconnect();
      };
    }, [container, hasMore, isLoading, onLoadMore]);
    return ref;
  };

  // src/domain/files/displaymodes/grid/FileGridItem.tsx
  var FileGridItem = ({
    type,
    label,
    description,
    thumbnail,
    onDoubleClick,
    onContextMenu
  }) => {
    const { Icon: Icon2 } = components;
    const { faFolderOpen } = libraries.FontAwesomeSolid;
    const typeToString = () => {
      switch (type) {
        case 0 /* Folder */:
          return "folder";
        case 1 /* Image */:
          return "image";
        case 2 /* Video */:
          return "scene";
        default:
          return "unknown";
      }
    };
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `item ${typeToString()}`,
        onDoubleClick,
        onContextMenu
      },
      /* @__PURE__ */ React.createElement("div", { className: "thumbnail" }, type === 0 /* Folder */ ? /* @__PURE__ */ React.createElement(Icon2, { icon: faFolderOpen }) : /* @__PURE__ */ React.createElement("img", { src: thumbnail })),
      /* @__PURE__ */ React.createElement("div", { className: "details" }, /* @__PURE__ */ React.createElement("div", { className: "name" }, label), /* @__PURE__ */ React.createElement("div", { className: "desc" }, description))
    );
  };

  // src/domain/files/displaymodes/grid/FileGridFolder.tsx
  var FileGridFolder = ({
    folder,
    onContextMenu,
    onDoubleClick
  }) => {
    return /* @__PURE__ */ React.createElement(
      FileGridItem,
      {
        type: 0 /* Folder */,
        label: folder.basename,
        description: `${folder.sub_folders?.length} folders`,
        onContextMenu,
        onDoubleClick
      }
    );
  };

  // src/domain/files/utils/FileUtils.ts
  var Units = [
    "byte",
    "kibibyte",
    "mebibyte",
    "gibibyte",
    "tebibyte",
    "pebibyte"
  ];
  var shortUnits = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
  var FileSize = (bytes = 0) => {
    if (Number.isNaN(parseFloat(String(bytes))) || !Number.isFinite(bytes))
      return { size: 0, unit: Units[0] };
    let unit = 0;
    let count = bytes;
    while (count >= 1024 && unit + 1 < Units.length) {
      count /= 1024;
      unit++;
    }
    return {
      size: count,
      unit: Units[unit]
    };
  };
  var FormatFileSizeUnit = (u) => {
    const i = Units.indexOf(u);
    return shortUnits[i];
  };
  var FileSizeFractionalDigits = (unit) => {
    if (Units.indexOf(unit) >= 3) {
      return 1;
    }
    return 0;
  };
  var GetExtensionFromPath = (path) => {
    const parts = path.split(".");
    if (parts.length < 2)
      return null;
    return parts.pop().toLowerCase();
  };
  var FileUtils = {
    FileSize,
    FileSizeFractionalDigits,
    FormatFileSizeUnit,
    GetExtensionFromPath
  };

  // src/domain/files/components/FileSize.tsx
  var FileSize2 = ({ size: fileSize }) => {
    const { size, unit } = FileUtils.FileSize(fileSize);
    const { FormattedNumber } = libraries.Intl;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      FormattedNumber,
      {
        value: size,
        maximumFractionDigits: FileUtils.FileSizeFractionalDigits(unit)
      }
    ), ` ${FileUtils.FormatFileSizeUnit(unit)}`);
  };

  // src/domain/files/displaymodes/grid/FileGridImage.tsx
  var FileGridImage = ({
    image,
    onContextMenu,
    onDoubleClick
  }) => {
    const fileSize = /* @__PURE__ */ React.createElement(FileSize2, { size: image.size });
    const description = () => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, FileUtils.GetExtensionFromPath(image.basename), "\xA0\xB7\xA0", fileSize);
    };
    return /* @__PURE__ */ React.createElement(
      FileGridItem,
      {
        type: 1 /* Image */,
        label: image.basename,
        description: description(),
        thumbnail: image.images[0].paths?.thumbnail,
        onContextMenu,
        onDoubleClick
      }
    );
  };

  // src/domain/files/displaymodes/grid/FileGridVideo.tsx
  var FileGridVideo = ({
    video,
    onContextMenu,
    onDoubleClick
  }) => {
    const fileSize = /* @__PURE__ */ React.createElement(FileSize2, { size: video.size });
    const description = () => {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, FileUtils.GetExtensionFromPath(video.basename), "\xA0\xB7\xA0", fileSize);
    };
    return /* @__PURE__ */ React.createElement(
      FileGridItem,
      {
        type: 2 /* Video */,
        label: video.basename,
        description: description(),
        thumbnail: video.scenes[0]?.paths?.screenshot ?? "",
        onContextMenu,
        onDoubleClick
      }
    );
  };

  // src/domain/files/displaymodes/grid/FileGrid.tsx
  var FileGrid = ({
    folders,
    files,
    isLoadingMore,
    hasMore,
    onLoadMore
  }) => {
    const { openLightbox } = useLightbox(files);
    const { goToFolder, goToRecord } = useNavigation();
    const { contextMenu, openContextMenu } = useContextMenu();
    const containerRef = React.useRef(null);
    const loadMoreRef = useInfiniteScroll({
      isLoading: isLoadingMore,
      hasMore,
      onLoadMore,
      container: containerRef
    });
    const maybeRenderFolders = () => {
      if (!folders?.length)
        return null;
      return folders.map((f) => {
        return /* @__PURE__ */ React.createElement(
          FileGridFolder,
          {
            key: `folder-${f.id}`,
            folder: f,
            onDoubleClick: () => goToFolder(f.id),
            onContextMenu: (e) => openContextMenu(e, {
              type: 0 /* Folder */,
              item: f
            })
          }
        );
      });
    };
    const maybeRenderFiles = () => {
      if (!files?.length)
        return null;
      return files.map((f) => {
        switch (f.__typename) {
          case "ImageFile":
            return /* @__PURE__ */ React.createElement(
              FileGridImage,
              {
                key: `file-${f.id}`,
                image: f,
                onDoubleClick: () => goToRecord(1 /* Image */, f.images[0].id),
                onContextMenu: (e) => openContextMenu(e, {
                  type: 1 /* Image */,
                  item: f
                })
              }
            );
          case "VideoFile":
            return /* @__PURE__ */ React.createElement(
              FileGridVideo,
              {
                key: `file-${f.id}`,
                video: f,
                onDoubleClick: () => goToRecord(2 /* Video */, f.scenes[0].id),
                onContextMenu: (e) => openContextMenu(e, {
                  type: 2 /* Video */,
                  item: f
                })
              }
            );
          default:
            return null;
        }
      });
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { ref: containerRef, className: "file-grid" }, maybeRenderFolders(), maybeRenderFiles(), /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: loadMoreRef,
        style: {
          height: 1
        }
      }
    )), contextMenu && /* @__PURE__ */ React.createElement(
      ContextMenu,
      {
        state: contextMenu,
        onImagePreview: openLightbox
      }
    ));
  };
  var FileGrid_default = FileGrid;

  // src/domain/files/displaymodes/DisplayMode.tsx
  var DisplayMode = ({
    display,
    files,
    folders,
    hasMore,
    onLoadMore
  }) => {
    display ??= "grid";
    if (display === "grid") {
      return /* @__PURE__ */ React.createElement(
        FileGrid_default,
        {
          key: `file-grid`,
          files,
          folders,
          hasMore,
          onLoadMore
        }
      );
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  };
  var DisplayMode_default = DisplayMode;

  // src/domain/files/graphql/fragments/FileFragment.ts
  var FILE_FRAGMENT = gql`
	fragment FileFields on BaseFile {
		__typename
		id
		basename
		size

		... on ImageFile {
			images {
				id

				paths {
					image
					preview
					thumbnail
				}
			}
		}

		... on VideoFile {
			scenes {
				id

				paths {
					screenshot
				}
			}
		}
	}
`;

  // src/domain/files/graphql/queries/GetFolderContentsQuery.ts
  var GET_FOLDER_CONTENTS_QUERY = gql`
	${FOLDER_FRAGMENT}
	${FILE_FRAGMENT}

	query GetFolderContents($folderId: ID!, $page: Int!) {
		findFolder(id: $folderId) {
			...FolderFields

			sub_folders {
				...FolderFields
			}
		}
		findFiles(
			file_filter: {
				parent_folder: { value: [$folderId], modifier: EQUALS }
			}
			filter: { per_page: 50, page: $page }
		) {
			count
			files {
				...FileFields
			}
		}
	}
`;

  // src/domain/files/hooks/useFolderContentsQuery.tsx
  function useFolderContentsQuery(id) {
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    const apollo = libraries.Apollo;
    const skip = !id || id.trim() === "";
    const { loading, error, data, fetchMore } = apollo.useQuery(
      GET_FOLDER_CONTENTS_QUERY,
      {
        variables: {
          folderId: id,
          page: 1
        },
        skip,
        notifyOnNetworkStatusChange: true
      }
    );
    async function loadMore() {
      const nextPage = page + 1;
      fetchMore({
        variables: {
          page: nextPage
        },
        updateQuery: (previousResult, {
          fetchMoreResult
        }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return {
            findFolder: fetchMoreResult.findFolder ?? previousResult.findFolder,
            findFiles: {
              ...previousResult.findFiles ?? {},
              ...fetchMoreResult.findFiles ?? {},
              files: [
                ...previousResult.findFiles?.files ?? [],
                ...fetchMoreResult.findFiles?.files ?? []
              ]
            }
          };
        }
      }).then((result) => {
        const newFiles = result.data?.findFiles?.files ?? [];
        if (newFiles.length === 0) {
          setHasMore(false);
          return;
        }
        setPage(nextPage);
      });
    }
    React.useEffect(() => {
      setPage(1);
      setHasMore(true);
    }, [id]);
    return {
      loading,
      error,
      data,
      hasMore,
      loadMore
    };
  }

  // src/domain/files/views/FolderView.tsx
  var FolderView = ({}) => {
    const { params } = useURLParams();
    const { data, hasMore, loadMore } = useFolderContentsQuery(
      String(params.folder)
    );
    const fileResults = data?.findFiles?.files;
    const folderResults = data?.findFolder?.sub_folders;
    return /* @__PURE__ */ React.createElement(
      DisplayMode_default,
      {
        key: `display-mode`,
        display: params.display,
        folders: folderResults,
        files: fileResults,
        hasMore,
        onLoadMore: loadMore
      }
    );
  };
  var FolderView_default = FolderView;

  // src/domain/files/views/LibraryView.tsx
  var LibraryView = ({}) => {
    const { params } = useURLParams();
    const displayMode = params.display;
    const { data, loading } = useStashes();
    const { LoadingIndicator } = components;
    if (loading) {
      return /* @__PURE__ */ React.createElement(LoadingIndicator, null);
    }
    return /* @__PURE__ */ React.createElement(DisplayMode_default, { display: displayMode, folders: data });
  };
  var LibraryView_default = LibraryView;

  // src/domain/files/graphql/queries/GetRecentFilesQuery.ts
  var GET_RECENT_FILES_QUERY = gql`
	${FOLDER_FRAGMENT}
	${FILE_FRAGMENT}

	query GetRecentFiles {
		findFolders(
			filter: { per_page: 10, sort: "created_at", direction: DESC }
		) {
			folders {
				...FolderFields
			}
		}
		findFiles(
			filter: { per_page: 100, sort: "created_at", direction: DESC }
		) {
			count
			files {
				...FileFields
			}
		}
	}
`;

  // src/domain/files/hooks/useRecentFilesQuery.tsx
  var useRecentFilesQuery = () => {
    const apollo = libraries.Apollo;
    const { loading, error, data } = apollo.useQuery(GET_RECENT_FILES_QUERY);
    return { loading, error, data };
  };

  // src/domain/files/views/RecentView.tsx
  var RecentView = ({}) => {
    const { params } = useURLParams();
    const { data, loading } = useRecentFilesQuery();
    const { LoadingIndicator } = components;
    if (loading) {
      return /* @__PURE__ */ React.createElement(LoadingIndicator, null);
    }
    const fileResults = data?.findFiles?.files;
    const folderResults = data?.findFolders?.folders;
    return /* @__PURE__ */ React.createElement(
      DisplayMode_default,
      {
        display: params.display,
        folders: folderResults,
        files: fileResults
      }
    );
  };
  var RecentView_default = RecentView;

  // src/domain/files/components/TopBar.tsx
  var TopBar = ({}) => {
    const { Icon: Icon2 } = components;
    const { Button, Form } = libraries.Bootstrap;
    const { faGear } = libraries.FontAwesomeSolid;
    return /* @__PURE__ */ React.createElement("div", { className: "top-bar" }, /* @__PURE__ */ React.createElement("div", { className: "left-controls" }, /* @__PURE__ */ React.createElement(
      Form.Control,
      {
        className: "btn-secondary search-input",
        placeholder: `Search...`
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "right-controls" }, /* @__PURE__ */ React.createElement(Button, { variant: "primary" }, /* @__PURE__ */ React.createElement(Icon2, { icon: faGear }))), /* @__PURE__ */ React.createElement("div", { className: "left-controls" }, "\xA0"), /* @__PURE__ */ React.createElement("div", { className: "right-controls" }, "\xA0"));
  };
  var TopBar_default = TopBar;

  // src/domain/files/components/MainWindow.tsx
  var MainWindow = ({}) => {
    const { params } = useURLParams();
    const renderView = () => {
      switch (params.folder) {
        case "library":
          return /* @__PURE__ */ React.createElement(LibraryView_default, null);
        case "recent":
          return /* @__PURE__ */ React.createElement(RecentView_default, null);
        default:
          return /* @__PURE__ */ React.createElement(FolderView_default, null);
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "main-window" }, /* @__PURE__ */ React.createElement(TopBar_default, null), renderView());
  };
  var MainWindow_default = MainWindow;

  // src/domain/files/components/SideBar/SideBarButton.tsx
  var SideBarButton = ({ label, icon, folderId }) => {
    const { goToFolder } = useNavigation();
    const { Icon: Icon2 } = components;
    return /* @__PURE__ */ React.createElement("div", { className: "button", onClick: () => goToFolder(folderId) }, /* @__PURE__ */ React.createElement(Icon2, { icon }), "\xA0", label);
  };
  var SideBarButton_default = SideBarButton;

  // src/domain/files/components/SideBar/Library.tsx
  var Library = ({}) => {
    const { FormattedMessage } = libraries.Intl;
    const { faFolder } = libraries.FontAwesomeSolid;
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "header" }, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "folders" })), /* @__PURE__ */ React.createElement("div", { className: "body" }, /* @__PURE__ */ React.createElement(
      SideBarButton_default,
      {
        icon: faFolder,
        label: "Library",
        folderId: "library"
      }
    )));
  };
  var Library_default = Library;

  // src/domain/files/components/SideBar/Sources.tsx
  var Sources = ({ sources }) => {
    if (!sources)
      return;
    const { FormattedMessage } = libraries.Intl;
    const { faHardDrive } = libraries.FontAwesomeRegular;
    const displayPath = (stash) => {
      const parts = stash.path.split("/").filter(Boolean);
      const lastTwo = parts.slice(-2);
      return `.../${lastTwo.join("/")}`;
    };
    return /* @__PURE__ */ React.createElement("div", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "header" }, /* @__PURE__ */ React.createElement(FormattedMessage, { id: "stashes" })), /* @__PURE__ */ React.createElement("div", { className: "body" }, sources.map((s) => /* @__PURE__ */ React.createElement(
      SideBarButton_default,
      {
        icon: faHardDrive,
        label: displayPath(s),
        folderId: s.id
      }
    ))));
  };
  var Sources_default = Sources;

  // src/domain/files/components/SideBar/SideBar.tsx
  var SideBar = ({ width, stashes }) => {
    const { faClock, faHeart } = libraries.FontAwesomeRegular;
    const { faTrash } = libraries.FontAwesomeSolid;
    return /* @__PURE__ */ React.createElement("div", { className: "sidebar", style: { flexBasis: width } }, /* @__PURE__ */ React.createElement(
      SideBarButton_default,
      {
        icon: faClock,
        label: "Recently Added",
        folderId: "recent"
      }
    ), /* @__PURE__ */ React.createElement(SideBarButton_default, { icon: faHeart, label: "Favorites", folderId: "" }), /* @__PURE__ */ React.createElement(SideBarButton_default, { icon: faTrash, label: "Trash", folderId: "" }), /* @__PURE__ */ React.createElement(Sources_default, { sources: stashes }), /* @__PURE__ */ React.createElement(Library_default, null));
  };
  var SideBar_default = SideBar;

  // src/domain/files/components/FileBrowser.tsx
  var SidebarWidth = {
    min: 250,
    max: 500
  };
  var FileBrowser = () => {
    const { LoadingIndicator } = components;
    const [sideBarWidth, setSideBarWidth] = React.useState(SidebarWidth.min);
    const [isDraggingDivider, setIsDraggingDivider] = React.useState(false);
    const { data, loading, error } = useStashes();
    const containerRef = React.useRef(null);
    if (loading) {
      return /* @__PURE__ */ React.createElement(LoadingIndicator, null);
    }
    if (error.length > 0) {
      console.error(error);
      return /* @__PURE__ */ React.createElement("div", null, "Error getting stashes. Check console for more information.");
    }
    const handleMousePosition = (e) => {
      if (!isDraggingDivider || !containerRef?.current)
        return;
      const bounds = containerRef.current.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const width = Math.max(SidebarWidth.min, Math.min(x, SidebarWidth.max));
      setSideBarWidth(width);
    };
    const handleMouseClickRelease = () => setIsDraggingDivider(false);
    return /* @__PURE__ */ React.createElement(URLParamsProvider, null, /* @__PURE__ */ React.createElement(
      "div",
      {
        id: "qx-file-browser",
        onMouseMove: handleMousePosition,
        onMouseUp: handleMouseClickRelease
      },
      /* @__PURE__ */ React.createElement(SideBar_default, { width: sideBarWidth, stashes: data }),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "divider",
          onMouseDown: () => setIsDraggingDivider(true)
        }
      ),
      /* @__PURE__ */ React.createElement(MainWindow_default, null)
    ));
  };
  var FileBrowser_default = FileBrowser;

  // src/domain/files/components/MainNavBarButton.tsx
  var MainNavBarButton = () => {
    const { NavLink } = libraries.ReactRouterDOM;
    const { Icon: Icon2 } = components;
    const { Button } = libraries.Bootstrap;
    const { faFolder } = libraries.FontAwesomeSolid;
    return /* @__PURE__ */ React.createElement(NavLink, { className: "nav-link", exact: true, to: "/plugins/qx-file-browser" }, /* @__PURE__ */ React.createElement(
      Button,
      {
        className: "minimal d-flex align-items-center h-100",
        title: "File Browser"
      },
      /* @__PURE__ */ React.createElement(Icon2, { icon: faFolder }),
      /* @__PURE__ */ React.createElement("span", null, "File Browser")
    ));
  };
  var MainNavBarButton_default = MainNavBarButton;

  // src/qxFileBrowser.tsx
  patch.instead("MainNavBar.MenuItems", (props, _, original) => {
    return /* @__PURE__ */ React.createElement("div", { className: "navbar-nav" }, props.children, /* @__PURE__ */ React.createElement(MainNavBarButton_default, null));
  });
  register.route("/plugins/qx-file-browser", FileBrowser_default);
})();
