import { hooks, React } from "../../../globals";
import { IFile, IImageFile } from "../models/IFile";
import { IImage } from "../models/IImage";

export const useLightbox = (files?: IFile[]) => {
	const images: IImage[] = React.useMemo(() => {
		return (
			files
				?.filter((f): f is IImageFile => f.__typename === "ImageFile")
				.flatMap((f) => f.images) ?? []
		);
	}, [files]);

	const lightboxState = React.useMemo(() => {
		return {
			images,
		};
	}, [images]);

	const showLightbox = hooks.useLightbox(lightboxState, []);

	const openLightbox = React.useCallback(
		(imageId: string) => {
			const index = images.findIndex((img) => img.id === imageId);

			if (index === -1) return;

			showLightbox({ initialIndex: index });
		},
		[images, showLightbox]
	);

	return { openLightbox };
};
