import { libraries } from "../../../globals";
import { GET_RECENT_FILES_QUERY } from "../graphql/queries/GetRecentFilesQuery";

export const useRecentFilesQuery = () => {
	const apollo = libraries.Apollo;

	const { loading, error, data } = apollo.useQuery(GET_RECENT_FILES_QUERY);

	return { loading, error, data };
};
