import { IPluginApi } from "./domain/stash/models/IPluginApi";

const api = (window as any).PluginApi as IPluginApi;

export const { React, GQL, libraries, patch, components, register, hooks } =
	api;
export const gql = libraries.Apollo.gql;
export const { Icon } = components;
