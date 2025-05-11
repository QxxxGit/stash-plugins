import { IQxSceneCardSettings } from "../types/ISceneCard";

const HideIndividualPopoverButtons = (
	sceneCardNode: HTMLElement,
	settings: IQxSceneCardSettings
) => {
	if (!sceneCardNode || !settings) return;

	if (settings.hideMarkers) {
		const markerNode = sceneCardNode.querySelector(".marker-count");
		markerNode?.classList.add("hide");
	}

	if (settings.hideMovies) {
		const movieNode = sceneCardNode.querySelector(".movie-count");
		movieNode?.classList.add("hide");
	}

	if (settings.hideOCounter) {
		const oCounterNode = sceneCardNode.querySelector(".o-count");
		oCounterNode?.classList.add("hide");
	}

	const performerNode = sceneCardNode.querySelector(".performer-count");
	performerNode?.classList.add("hide");
};

export default HideIndividualPopoverButtons;
