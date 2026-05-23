import { React } from "../../../../globals";
import { IVideoFile } from "../../../stash/models/IFile";
import { ContextMenuItem } from "../ContextMenuItem";

export const VideoMenu: React.FC<{
	file: IVideoFile;
	goToRecord: () => void;
}> = ({ file, goToRecord }) => {
	const video = file.scenes[0];

	return (
		<>
			<ContextMenuItem onClick={goToRecord}>Go to page</ContextMenuItem>

			<ContextMenuItem>Properties</ContextMenuItem>
		</>
	);
};
