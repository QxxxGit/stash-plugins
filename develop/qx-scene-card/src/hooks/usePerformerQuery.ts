import { GQL, React } from "../globals";
import { IPerformer } from "../types/IPerformer";

export const usePerformerQuery = (performers: IPerformer[]) => {
	const props = React.useMemo(() => {
		return {
			variables: {
				performer_ids: performers.map((p) => p.id),
			},
		};
	}, [performers]);

	return GQL.useFindPerformersQuery(props);
};
