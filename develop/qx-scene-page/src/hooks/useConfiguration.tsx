import { GQL } from "../globals";

function useConfiguration(): IQxScenePageSettings {
	const { data } = GQL.useConfigurationQuery();

	return data?.configuration?.plugins?.qxScenePage;
}

export default useConfiguration;
