import { React } from "../../../globals";
import { IFile } from "../../stash/models/IFile";
import { IFolder } from "../../stash/models/IFolder";
import { ContextMenuState } from "../hooks/useContextMenu";
import { FileItemType } from "../types/FileItemType";
import { ContextMenuRenderer } from "./ContextMenuRenderer";

export type ContextMenuData =
	| {
			type: FileItemType.Folder;
			item: IFolder;
	  }
	| {
			type: FileItemType.Image;
			item: IFile;
	  }
	| {
			type: FileItemType.Video;
			item: IFile;
	  };

export const ContextMenu: React.FC<{
	state: ContextMenuState<ContextMenuData>;
	onImagePreview: (id: string) => void;
}> = ({ state, onImagePreview }) => {
	if (!state) return null;

	return (
		<div
			className="context-menu"
			style={{
				position: "fixed",
				left: state.x,
				top: state.y,
			}}>
			<ContextMenuRenderer
				data={state.data}
				dependencies={{ onImagePreview }}
			/>
		</div>
	);
};
