import React from "react";

export interface IPluginApi {
	React: typeof React;
	GQL: any;
	libraries: {
		Bootstrap: {
			OverlayTrigger: React.FC<any>;
			Popover: React.FC<any>;
			Tooltip: React.FC<any>;
		};
		ReactRouterDOM: {
			Link: React.FC<any>;
		};
		Intl: {
			FormattedDate: React.FC<any>;
			useIntl(): any;
		};
	};
	components: Record<string, React.FC<any>>;
	patch: {
		instead: (target: string, fn: Function) => void;
	};
}
