import { React } from "../../../../globals";
import { useLightbox } from "../../../stash/hooks/useLightbox";
import { IFile } from "../../../stash/models/IFile";
import { IFolder } from "../../../stash/models/IFolder";
import { ContextMenu, ContextMenuData } from "../../contextmenus/ContextMenu";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useInfiniteScroll } from "../../hooks/useInfiniteScrolling";
import { useNavigation } from "../../hooks/useNavigation";
import { FileItemType } from "../../types/FileItemType";
import { FileGridFolder } from "./FileGridFolder";
import { FileGridImage } from "./FileGridImage";
import { FileGridVideo } from "./FileGridVideo";

interface IFileGridProps {
	folders?: IFolder[];
	files?: IFile[];
	isLoadingMore?: boolean;
	hasMore?: boolean;
	onLoadMore?: () => Promise<any>;
}

const FileGrid: React.FC<IFileGridProps> = ({
	folders,
	files,
	isLoadingMore,
	hasMore,
	onLoadMore,
}) => {
	const { openLightbox } = useLightbox(files);
	const { goToFolder, goToRecord } = useNavigation();
	const { contextMenu, openContextMenu } = useContextMenu<ContextMenuData>();
	const containerRef = React.useRef<HTMLDivElement | null>(null);

	const loadMoreRef = useInfiniteScroll({
		isLoading: isLoadingMore,
		hasMore: hasMore,
		onLoadMore,
		container: containerRef,
	});

	const maybeRenderFolders = () => {
		if (!folders?.length) return null;

		return folders.map((f) => {
			return (
				<FileGridFolder
					key={`folder-${f.id}`}
					folder={f}
					onDoubleClick={() => goToFolder(f.id)}
					onContextMenu={(e) =>
						openContextMenu(e, {
							type: FileItemType.Folder,
							item: f,
						})
					}
				/>
			);
		});
	};

	const maybeRenderFiles = () => {
		if (!files?.length) return null;

		return files.map((f) => {
			switch (f.__typename) {
				case "ImageFile":
					return (
						<FileGridImage
							key={`file-${f.id}`}
							image={f}
							onDoubleClick={() =>
								goToRecord(FileItemType.Image, f.images[0].id)
							}
							onContextMenu={(e) =>
								openContextMenu(e, {
									type: FileItemType.Image,
									item: f,
								})
							}
						/>
					);
				case "VideoFile":
					return (
						<FileGridVideo
							key={`file-${f.id}`}
							video={f}
							onDoubleClick={() =>
								goToRecord(FileItemType.Video, f.scenes[0].id)
							}
							onContextMenu={(e) =>
								openContextMenu(e, {
									type: FileItemType.Video,
									item: f,
								})
							}
						/>
					);
				default:
					return null;
			}
		});
	};

	return (
		<>
			<div ref={containerRef} className="file-grid">
				{maybeRenderFolders()}
				{maybeRenderFiles()}
				<div
					ref={loadMoreRef}
					style={{
						height: 1,
					}}
				/>
			</div>
			{contextMenu && (
				<ContextMenu
					state={contextMenu}
					onImagePreview={openLightbox}
				/>
			)}
		</>
	);
};

export default FileGrid;
