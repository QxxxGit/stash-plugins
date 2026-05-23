import { React } from "../../../../globals";
import { IVideoFile } from "../../../stash/models/IFile";
import { FileSize } from "../../components/FileSize";
import { FileItemType } from "../../types/FileItemType";
import { FileUtils } from "../../utils/FileUtils";
import { FileGridItem } from "./FileGridItem";

interface IFileGridVideoProps {
	video: IVideoFile;
	onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onDoubleClick?: () => void;
}

export const FileGridVideo: React.FC<IFileGridVideoProps> = ({
	video,
	onContextMenu,
	onDoubleClick,
}) => {
	const fileSize = <FileSize size={video.size} />;

	const description = () => {
		return (
			<>
				{FileUtils.GetExtensionFromPath(video.basename)}
				&nbsp;·&nbsp;
				{fileSize}
			</>
		);
	};

	return (
		<FileGridItem
			type={FileItemType.Video}
			label={video.basename}
			description={description()}
			thumbnail={video.scenes[0]?.paths?.screenshot ?? ""}
			onContextMenu={onContextMenu}
			onDoubleClick={onDoubleClick}
		/>
	);
};
