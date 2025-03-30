import React from "react";

export interface IPluginApi {
	React: typeof React;
	libraries: {
		FontAwesomeSolid: {
			faLink: any;
		};
		FontAwesomeBrands: {
			faFacebook: any;
			faInstagram: any;
			faPatreon: any;
			faReddit: any;
			faTelegram: any;
			faTiktok: any;
			faTumblr: any;
			faTwitch: any;
			faTwitter: any;
			faVk: any;
			faYoutube: any;
		};
	};
	components: Record<string, React.FC<any>>;
	patch: {
		instead: (target: string, fn: Function) => void;
	};
}
