import { IImage } from "./IImage";
import { IScene } from "./IScene";

export type IFile = IImageFile | IVideoFile;

export interface IBaseFile {
	id: string;
	basename: string;
	size: number;
}

export interface IImageFile extends IBaseFile {
	__typename: "ImageFile";

	images: IImage[];
}

export interface IVideoFile extends IBaseFile {
	__typename: "VideoFile";

	scenes: IScene[];
}
