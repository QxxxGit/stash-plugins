import React from "react";

export interface IPluginApi {
	React: typeof React;
	GQL: any;
	libraries: {
		Apollo: any;
		Bootstrap: {
			OverlayTrigger: React.FC<any>;
			Popover: React.FC<any>;
			Tooltip: React.FC<any>;
			Button: React.FC<any>;
			Form: React.FC<any> & {
				Control: React.FC<any>;
			};
		};
		ReactRouterDOM: {
			Link: React.FC<any>;
			NavLink: React.FC<any>;
			useHistory: any;
			useLocation: any;
		};
		FontAwesomeRegular: {
			faFolder: any;
			faClock: any;
			faHeart: any;
			faHardDrive: any;
		};
		FontAwesomeSolid: {
			faFolder: any;
			faArrowRotateRight: any;
			faTrash: any;
			faGear: any;
			faFolderOpen: any;
		};
		Intl: {
			FormattedDate: React.FC<any>;
			FormattedMessage: React.FC<any>;
			FormattedNumber: React.FC<any>;
			useIntl(): any;
		};
	};
	components: Record<string, React.FC<any>>;
	patch: {
		before: (target: string, fn: Function) => void;
		instead: (target: string, fn: Function) => void;
		after: (target: string, fn: Function) => void;
	};
	register: {
		route: (path: string, component: React.FC<any>) => void;
	};
	hooks: {
		useLightbox: (
			state: any,
			chapters: any
		) => (options: { initialIndex: number }) => void;
	};
}
