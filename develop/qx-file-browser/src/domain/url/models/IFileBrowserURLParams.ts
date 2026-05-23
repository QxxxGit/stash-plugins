import { DisplayModeType } from "../../files/types/DisplayModeType";
import { FolderId } from "../../files/types/VirtualFolders";

export interface IFileBrowserURLParams {
	folder?: FolderId;
	query?: string;
	display?: DisplayModeType;
}
