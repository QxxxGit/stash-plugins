import { React } from "../../../../globals";
import { IImageFile } from "../../../stash/models/IFile";
import { FileSize } from "../../components/FileSize";
import { FileItemType } from "../../types/FileItemType";
import { FileUtils } from "../../utils/FileUtils";
import { FileGridItem } from "./FileGridItem";

interface IFileGridImageProps {
	image: IImageFile;
	onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onDoubleClick?: () => void;
}

export const FileGridImage: React.FC<IFileGridImageProps> = ({
	image,
	onContextMenu,
	onDoubleClick,
}) => {
	const fileSize = <FileSize size={image.size} />;

	const description = () => {
		return (
			<>
				{FileUtils.GetExtensionFromPath(image.basename)}
				&nbsp;·&nbsp;
				{fileSize}
			</>
		);
	};

	return (
		<FileGridItem
			type={FileItemType.Image}
			label={image.basename}
			description={description()}
			thumbnail={image.images[0].paths?.thumbnail}
			onContextMenu={onContextMenu}
			onDoubleClick={onDoubleClick}
		/>
	);
};
