import { IPluginApi } from "./types/IPluginApi";

const api = (window as any).PluginApi as IPluginApi;

export const {
	React,
	GQL,
	libraries,
	patch,
	components,
	loadableComponents,
	utils,
	hooks,
} = api;

export const VIDEO_PLAYER_ID = "VideoJsPlayer";

export const { Icon, LoadingIndicator } = components;

export const { FormattedDate, FormattedMessage } = libraries.Intl;

export const { Link, NavLink } = libraries.ReactRouterDOM;

export const { Button } = libraries.Bootstrap;
