import { GQL } from "../globals";
import { IQxSceneCardSettings } from "../types/ISceneCard";

export const useSettings = (): IQxSceneCardSettings => {
	const { data } = GQL.useConfigurationQuery();
	const settings: IQxSceneCardSettings =
		data?.configuration?.plugins?.qxSceneCard;

	return {
		fadeWatched: settings?.fadeWatched,
		hideOCounter: settings?.hideOCounter,
		hideMarkers: settings?.hideMarkers,
		hideMovies: settings?.hideMovies,
		hideStudio: settings?.hideStudio,
	};
};
