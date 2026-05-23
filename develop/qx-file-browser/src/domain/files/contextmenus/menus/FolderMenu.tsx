import { React } from "../../../../globals";
import { IFolder } from "../../../stash/models/IFolder";
import { ContextMenuItem } from "../ContextMenuItem";

export const FolderMenu: React.FC<{
	folder: IFolder;
	goToFolder: (id: string) => void;
}> = ({ folder, goToFolder }) => {
	return (
		<>
			<ContextMenuItem onClick={() => goToFolder(folder.id)}>
				Open
			</ContextMenuItem>
			<ContextMenuItem onClick={() => {}}>Properties</ContextMenuItem>
		</>
	);
};
