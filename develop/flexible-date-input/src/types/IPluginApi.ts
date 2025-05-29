import React from "react";
import ReactDOM from "react-dom";

export interface IPluginApi {
	React: typeof React;
	ReactDOM: typeof ReactDOM;
	patch: {
		after: (target: string, fn: Function) => void;
	};
}
