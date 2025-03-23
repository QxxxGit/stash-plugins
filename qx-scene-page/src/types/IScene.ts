import { IStudio } from "./IStudio";
import { IPerformer } from "./IPerformer";
import { ITag } from "./ITag";

export interface IScene {
    id: number;
    title: string;
    files: any;
    date?: string;
    details?: string;
    performers?: IPerformer[];
    studio?: IStudio;
    play_count?: number;
    tags: ITag[];
    created_at: string;
    updated_at: string;
    paths: {
        screenshot: string;
    }
}