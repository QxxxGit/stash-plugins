import {
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
} from "../globals";

export interface IExpectedUrlSpecs {
	icon: any;
	className: string;
	urls: string[];
}

export interface ILinkDefinition {
	name: string;
	icon: any;
	baseAddresses: string[];
}

const LinkDefinitions: ILinkDefinition[] = [
	{
		name: "facebook",
		icon: faFacebook,
		baseAddresses: ["facebook.com"],
	},
	{
		name: "instagram",
		icon: faInstagram,
		baseAddresses: ["instagram.com"],
	},
	{
		name: "patreon",
		icon: faPatreon,
		baseAddresses: ["patreon.com"],
	},
	{
		name: "reddit",
		icon: faReddit,
		baseAddresses: ["reddit.com"],
	},
	{
		name: "telegram",
		icon: faTelegram,
		baseAddresses: ["telegram.com", "t.me"],
	},
	{
		name: "tiktok",
		icon: faTiktok,
		baseAddresses: ["tiktok.com"],
	},
	{
		name: "tumblr",
		icon: faTumblr,
		baseAddresses: ["tumblr.com"],
	},
	{
		name: "twitch",
		icon: faTwitch,
		baseAddresses: ["twitch.tv"],
	},
	{
		name: "twitter",
		icon: faTwitter,
		baseAddresses: ["twitter.com", "x.com"],
	},
	{
		name: "vk",
		icon: faVk,
		baseAddresses: ["vk.com"],
	},
	{
		name: "youtube",
		icon: faYoutube,
		baseAddresses: ["youtube.com"],
	},
];

export default LinkDefinitions;
