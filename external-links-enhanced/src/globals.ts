import { IPluginApi } from "./types/IPluginApi";

const api = (window as any).PluginApi as IPluginApi;

export const { React, libraries, patch, components } = api;

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
