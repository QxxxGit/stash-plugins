import React from "react";
import ReactDOM from "react-dom";

export interface IPluginApi {
	React: typeof React;
	ReactDOM: typeof ReactDOM;
	libraries: {
		Bootstrap: {
			Button: React.FC<any>;
			Dropdown: React.FC<any> & {
				Menu: React.FC<any>;
				Item: React.FC<any>;
				Toggle: React.FC<any>;
			};
		};
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
