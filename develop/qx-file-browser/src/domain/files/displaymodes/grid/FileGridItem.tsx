import { MouseEventHandler } from "react";
import { components, libraries, React } from "../../../../globals";
import { FileItemType } from "../../types/FileItemType";

export const FileGridItem: React.FC<{
	type: FileItemType;
	label: string;
	description: React.ReactNode;
	thumbnail?: string;
	onDoubleClick?: MouseEventHandler;
	onContextMenu?: MouseEventHandler<HTMLDivElement>;
}> = ({
	type,
	label,
	description,
	thumbnail,
	onDoubleClick,
	onContextMenu,
}) => {
	const { Icon } = components;
	const { faFolderOpen } = libraries.FontAwesomeSolid;

	const typeToString = () => {
		switch (type) {
			case FileItemType.Folder:
				return "folder";
			case FileItemType.Image:
				return "image";
			case FileItemType.Video:
				return "scene";
			default:
				return "unknown";
		}
	};

	return (
		<div
			className={`item ${typeToString()}`}
			onDoubleClick={onDoubleClick}
			onContextMenu={onContextMenu}>
			<div className="thumbnail">
				{type === FileItemType.Folder ? (
					<Icon icon={faFolderOpen} />
				) : (
					<img src={thumbnail} />
				)}
			</div>
			<div className="details">
				<div className="name">{label}</div>
				<div className="desc">{description}</div>
			</div>
		</div>
	);
};
