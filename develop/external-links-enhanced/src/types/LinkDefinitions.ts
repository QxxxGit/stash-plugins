import {
	faFacebook,
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
	faYoutube,
} from "../globals";

export interface IExpectedUrlSpecs {
	name: string;
	icon: any;
	urls: string[];
}

export interface ILinkDefinition {
	name: string;
	icon: any;
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
