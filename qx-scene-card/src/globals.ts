import { IPluginApi } from "./types";

const api = (window as any).PluginApi as IPluginApi;

export const {
    React,
    GQL,
    libraries,
    patch
} = api;