import { React } from "../../../../globals";
import { IFolder } from "../../../stash/models/IFolder";
import { FileItemType } from "../../types/FileItemType";
import { FileGridItem } from "./FileGridItem";

interface IFileGridFolderProps {
	folder: IFolder;
	onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onDoubleClick?: () => void;
}

export const FileGridFolder: React.FC<IFileGridFolderProps> = ({
	folder,
	onContextMenu,
	onDoubleClick,
}) => {
	return (
		<FileGridItem
			type={FileItemType.Folder}
			label={folder.basename}
			description={`${folder.sub_folders?.length} folders`}
			onContextMenu={onContextMenu}
			onDoubleClick={onDoubleClick}
		/>
	);
};
