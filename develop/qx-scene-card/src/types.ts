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
        Intl: {
            FormattedDate: React.FC<any>;
        }
    }
    components: Record<string, React.FC<any>>;
    patch: {
        instead: (target: string, fn: Function) => void;
    }
}

export enum GenderEnum {
    MALE,
    FEMALE,
    TRANSGENDER_MALE,
    TRANSGENDER_FEMALE,
    INTERSEX,
    NON_BINARY
}

export interface IPerformer {
    id: number;
    name: string;
    gender?: GenderEnum
}

export interface IStudio {
    id: number;
    name: string;
}

export interface IScene {
    id: number;
    date?: string;
    performers?: IPerformer[];
    studio?: IStudio;
    play_count?: number;
}

export interface ISceneCardProperties {
    scene: IScene;
}

export interface IQxSceneCardSettings {
    fadeWatched: boolean;
    hideOCounter: boolean;
    hideMarkers: boolean;
    hideMovies: boolean;
    hideStudio: boolean;
}