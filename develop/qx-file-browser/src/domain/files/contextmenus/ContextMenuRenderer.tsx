import { React } from "../../../globals";
import { IImageFile, IVideoFile } from "../../stash/models/IFile";
import { useNavigation } from "../hooks/useNavigation";
import { FileItemType } from "../types/FileItemType";
import { ContextMenuData } from "./ContextMenu";
import { FolderMenu } from "./menus/FolderMenu";
import { ImageMenu } from "./menus/ImageMenu";
import { VideoMenu } from "./menus/VideoMenu";

export const ContextMenuRenderer: React.FC<{
	data: ContextMenuData;
	dependencies: {
		onImagePreview: (id: string) => void;
	};
}> = ({ data, dependencies }) => {
	const { goToFolder, goToRecord } = useNavigation();

	switch (data.type) {
		case FileItemType.Folder:
			return (
				<FolderMenu
					folder={data.item}
					goToFolder={() => goToFolder(data.item.id)}
				/>
			);

		case FileItemType.Image:
			const imageFile = data.item as IImageFile;

			return (
				<ImageMenu
					file={imageFile}
					goToRecord={() =>
						goToRecord(FileItemType.Image, imageFile.images[0].id)
					}
					onImagePreview={dependencies.onImagePreview}
				/>
			);

		case FileItemType.Video:
			const videoFile = data.item as IVideoFile;

			return (
				<VideoMenu
					file={videoFile}
					goToRecord={() =>
						goToRecord(FileItemType.Video, videoFile.scenes[0].id)
					}
				/>
			);

		default:
			return null;
	}
};
