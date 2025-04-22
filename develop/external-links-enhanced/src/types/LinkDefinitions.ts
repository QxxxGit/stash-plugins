import {
	faFacebook,
	faImdb,
	faInstagram,
	faLink,
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
} from "../globals";

export interface IURLSpecs {
	definition: ILinkDefinition;
	urls: string[];
}

export interface ILinkDefinition {
	name: string;
	icon: any; // FontAwesome icon or path
	addresses: string[];
	regex?: string;
}

const DefaultLinkDefinitions: ILinkDefinition[] = [
	{
		name: "facebook",
		icon: faFacebook,
		addresses: ["facebook.com"],
	},
	{
		name: "imdb",
		icon: faImdb,
		addresses: ["imdb.com"],
	},
	{
		name: "instagram",
		icon: faInstagram,
		addresses: ["instagram.com"],
	},
	{
		name: "patreon",
		icon: faPatreon,
		addresses: ["patreon.com"],
	},
	{
		name: "reddit",
		icon: faReddit,
		addresses: ["reddit.com"],
	},
	{
		name: "telegram",
		icon: faTelegram,
		addresses: ["telegram.com", "t.me"],
	},
	{
		name: "tiktok",
		icon: faTiktok,
		addresses: ["tiktok.com"],
	},
	{
		name: "tumblr",
		icon: faTumblr,
		addresses: ["tumblr.com"],
		regex: "^https?\\:\/\/(.+)tumblr\.com\/",
	},
	{
		name: "twitch",
		icon: faTwitch,
		addresses: ["twitch.tv"],
	},
	{
		name: "twitter",
		icon: faTwitter,
		addresses: ["twitter.com", "x.com"],
	},
	{
		name: "vk",
		icon: faVk,
		addresses: ["vk.com"],
	},
	{
		name: "wordpress",
		icon: faWordpress,
		addresses: ["wordpress.com"],
		regex: "^https?\\:\/\/(.+)wordpress\.com\/",
	},
	{
		name: "youtube",
		icon: faYoutube,
		addresses: ["youtube.com"],
	},
	{
		name: "other",
		icon: faLink,
		addresses: [],
	},
];

export default DefaultLinkDefinitions;
