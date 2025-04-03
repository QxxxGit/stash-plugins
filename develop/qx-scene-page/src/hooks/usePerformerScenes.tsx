import { GQL, React } from "../globals";
import { IPerformer } from "../types/IPerformer";

function usePerformerScenes(performer: IPerformer) {
	const props = React.useMemo(() => {
		return {
			variables: {
				scene_filter: {
					performers: {
						value: [performer.id],
						modifier: "INCLUDES",
					},
				},
				filter: {
					sort: "random",
				},
			},
		};
	}, [performer]);

	return GQL.useFindScenesQuery(props);
}

export default usePerformerScenes;
