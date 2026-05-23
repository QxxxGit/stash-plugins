import { libraries } from "../../../globals";
import { FileItemType } from "../types/FileItemType";

export const useNavigation = () => {
	const history = libraries.ReactRouterDOM.useHistory();

	const goToFolder = (id: string) => {
		const params = new URLSearchParams(location.search);

		params.set("folder", id);

		history.push({
			search: params.toString(),
		});
	};

	const goToRecord = (type: FileItemType, id: string) => {
		switch (type) {
			case FileItemType.Image:
				history.push(`/images/${id}`);
				break;
			case FileItemType.Video:
				history.push(`/scenes/${id}`);
				break;
		}
	};

	return {
		goToFolder,
		goToRecord,
	};
};
