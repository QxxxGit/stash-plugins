import { libraries, React } from "../../../globals";
import {
	GET_FOLDER_CONTENTS_QUERY,
	GetFolderContentsQueryResults,
} from "../graphql/queries/GetFolderContentsQuery";

export function useFolderContentsQuery(id?: string) {
	const [page, setPage] = React.useState<number>(1);
	const [hasMore, setHasMore] = React.useState(true);

	const apollo = libraries.Apollo;
	const skip = !id || id.trim() === "";

	const { loading, error, data, fetchMore } = apollo.useQuery(
		GET_FOLDER_CONTENTS_QUERY,
		{
			variables: {
				folderId: id,
				page: 1,
			},
			skip,
			notifyOnNetworkStatusChange: true,
		}
	);

	async function loadMore() {
		const nextPage = page + 1;

		fetchMore({
			variables: {
				page: nextPage,
			},

			updateQuery: (
				previousResult: GetFolderContentsQueryResults,
				{
					fetchMoreResult,
				}: {
					fetchMoreResult?: GetFolderContentsQueryResults;
				}
			) => {
				if (!fetchMoreResult) {
					return previousResult;
				}

				return {
					findFolder:
						fetchMoreResult.findFolder ?? previousResult.findFolder,

					findFiles: {
						...(previousResult.findFiles ?? {}),
						...(fetchMoreResult.findFiles ?? {}),

						files: [
							...(previousResult.findFiles?.files ?? []),
							...(fetchMoreResult.findFiles?.files ?? []),
						],
					},
				};
			},
		}).then((result: any) => {
			const newFiles = result.data?.findFiles?.files ?? [];

			if (newFiles.length === 0) {
				setHasMore(false);
				return;
			}

			setPage(nextPage);
		});
	}

	React.useEffect(() => {
		setPage(1);
		setHasMore(true);
	}, [id]);

	return {
		loading,
		error,
		data,
		hasMore,
		loadMore,
	};
}
