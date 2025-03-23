import { GQL, React } from "../globals";
import { IPerformer } from "../types/IPerformer";

function useConfiguration(): IQxScenePageSettings {
    const { data } = GQL.useConfigurationQuery();

    return data?.configuration?.plugins?.qxScenePage;
}

export default useConfiguration;