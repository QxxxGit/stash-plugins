import { IPluginApi } from "./types/IPluginApi";

const api = (window as any).PluginApi as IPluginApi;

export const { React, ReactDOM, GQL, utils, libraries, patch, components } =
	api;
