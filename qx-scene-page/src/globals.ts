import { IPluginApi } from "./types/IPluginApi";

const api = (window as any).PluginApi as IPluginApi;

export const {
    React,
    GQL,
    libraries,
    patch,
    components,
    loadableComponents,
    utils,
    hooks
} = api;

export const {
    LoadingIndicator
} = components;

export const {
    FormattedDate,
    FormattedMessage
} = libraries.Intl;

export const {
    Link,
    NavLink
} = libraries.ReactRouterDOM;