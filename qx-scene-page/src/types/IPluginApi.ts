import React from "react";

export interface IPluginApi {
    React: typeof React;
    GQL: any;
    libraries: {
        ReactRouterDOM: {
            NavLink: React.FC<any>;
            Link: React.FC<any>;
            Route: React.FC<any>;
        },
        Bootstrap: {
            Button: React.FC<any>;
            Nav: React.FC<any> & {
                Link: React.FC<any>;
                Item: React.FC<any>;
            };
            Tab: React.FC<any> & {
                Container: React.FC<any>;
                Content: React.FC<any>;
                Pane: React.FC<any>;
            };
        },
        FontAwesomeSolid: {
            faEllipsis: any;
            faPencil: any;
        },
        Intl: {
            FormattedDate: React.FC<any>;
            FormattedMessage: React.FC<any>;
        }
    };
    loadableComponents: any;
    components: Record<string, React.FC<any>>;
    patch: {
        instead: (target: string, fn: Function) => void;
    };
    hooks: any;
    utils: {
        loadComponents: any;
    }
}