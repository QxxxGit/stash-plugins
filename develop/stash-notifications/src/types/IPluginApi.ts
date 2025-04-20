import React from "react";
import ReactDOM from "react-dom";

export interface IPluginApi {
	React: typeof React;
	ReactDOM: typeof ReactDOM;
	GQL: any;
	libraries: {
		Bootstrap: {
			Badge: React.FC<any>;
			Button: React.FC<any>;
			Dropdown: React.FC<any> & {
				Menu: React.FC<any>;
				Item: React.FC<any>;
				Toggle: React.FC<any>;
			};
			Modal: React.FC<any> & {
				Header: React.FC<any>;
				Title: React.FC<any>;
				Body: React.FC<any>;
				Footer: React.FC<any>;
			};
		};
		FontAwesomeSolid: {
			faBell: any;
		};
		Intl: {
			FormattedDate: React.FC<any>;
			FormattedTime: React.FC<any>;
		};
	};
	components: Record<string, React.FC<any>>;
	utils: {
		StashService: any;
	};
	patch: {
		before: (target: string, fn: Function) => void;
	};
}
