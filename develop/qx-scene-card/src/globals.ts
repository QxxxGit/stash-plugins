import { IPluginApi } from "./types/IPluginApi";

const api = (window as any).PluginApi as IPluginApi;

export const { React, GQL, libraries, patch, components } = api;
