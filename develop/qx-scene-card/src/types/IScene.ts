import { IPerformer } from "./IPerformer";
import { IStudio } from "./IStudio";

export interface IScene {
	id: number;
	date?: string;
	performers?: IPerformer[];
	studio?: IStudio;
	play_count?: number;
}
