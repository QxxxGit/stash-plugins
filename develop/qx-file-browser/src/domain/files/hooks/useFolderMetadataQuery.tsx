import { libraries } from "../../../globals";
import { GET_FOLDER_METADATA_QUERY } from "../graphql/queries/GetFolderMetadataQuery";

export function useFolderMetadataQuery(id?: string) {
	const apollo = libraries.Apollo;

	const skip = !id || id.trim() === "";

	const { loading, error, data } = apollo.useQuery(
		GET_FOLDER_METADATA_QUERY,
		{
			variables: {
				folderId: id,
			},
			skip: skip,
		}
	);

	return { loading, error, data };
}
