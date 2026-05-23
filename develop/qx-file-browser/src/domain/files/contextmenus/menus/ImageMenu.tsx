import { React } from "../../../../globals";
import { IImageFile } from "../../../stash/models/IFile";
import { ContextMenuItem } from "../ContextMenuItem";

export const ImageMenu: React.FC<{
	file: IImageFile;
	goToRecord: () => void;
	onImagePreview: (id: string) => void;
}> = ({ file, goToRecord, onImagePreview }) => {
	const image = file.images[0];

	return (
		<>
			<ContextMenuItem onClick={() => onImagePreview(image.id)}>
				Preview
			</ContextMenuItem>

			<ContextMenuItem onClick={goToRecord}>Go to page</ContextMenuItem>

			<ContextMenuItem>Properties</ContextMenuItem>
		</>
	);
};
