import { IScene } from "./IScene";

export interface ISceneMarker {
	id: number;
	scene: IScene;
	title: string;
	seconds: number;
	preview: string;
	screenshot: string;
}
