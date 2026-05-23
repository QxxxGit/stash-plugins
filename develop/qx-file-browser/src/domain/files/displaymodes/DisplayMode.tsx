import { React } from "../../../globals";
import { IFile } from "../../stash/models/IFile";
import { IFolder } from "../../stash/models/IFolder";
import { DisplayModeType } from "../types/DisplayModeType";
import FileGrid from "./grid/FileGrid";

interface IDisplayModeProps {
	display?: DisplayModeType;
	files?: IFile[];
	folders?: IFolder[];
	hasMore?: boolean;
	onLoadMore?: () => Promise<any>;
}

const DisplayMode: React.FC<IDisplayModeProps> = ({
	display,
	files,
	folders,
	hasMore,
	onLoadMore,
}) => {
	display ??= "grid";

	if (display === "grid") {
		return (
			<FileGrid
				key={`file-grid`}
				files={files}
				folders={folders}
				hasMore={hasMore}
				onLoadMore={onLoadMore}
			/>
		);
	}

	return <></>;
};

export default DisplayMode;
