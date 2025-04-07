import { IPluginApi } from "./types/IPluginApi";

const api = (window as any).PluginApi as IPluginApi;

export const { React, ReactDOM, libraries, patch, components } = api;

export const { faLink } = libraries.FontAwesomeSolid;
export const {
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
	faYoutube,
} = libraries.FontAwesomeBrands;

export const customAssetPath = "./plugin/externalLinksEnhanced/assets/custom";
export const customDefinitionsPath = `${customAssetPath}/custom.json`;

type FontAwesomeIconDefinition = any;
export type IconType = FontAwesomeIconDefinition | SVGElement;
