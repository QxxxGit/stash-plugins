import React from "react";
import ReactDOM from "react-dom";

export interface IPluginApi {
	React: typeof React;
	ReactDOM: typeof ReactDOM;
	libraries: {
	};
	components: Record<string, React.FC<any>>;
	patch: {
		instead: (target: string, fn: Function) => void;
	};
}
