import { GQL, libraries, React } from "../../../globals";
import { IFolder } from "../../stash/models/IFolder";
import { IStashes } from "../../stash/models/IStashes";
import { FolderUtils } from "../utils/FolderUtils";

export function useStashes() {
	const { data } = GQL.useConfigurationQuery();
	const apollo = libraries.Apollo;
	const client = apollo.useApolloClient();
	const stashes: IStashes[] = data?.configuration?.general?.stashes ?? [];
	const [folders, setFolders] = React.useState<IFolder[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setErrors] = React.useState<string[]>([]);

	React.useEffect(() => {
		if (!data) return;

		if (!stashes.length) {
			setFolders([]);
			setLoading(false);

			return;
		}

		let cancelled = false;

		FolderUtils.FetchByPath(
			client,
			stashes.map((s) => s.path)
		)
			.then((results) => {
				if (!cancelled) {
					setFolders(results.data);

					// gently handle errors e.g. folder not found
					setErrors((current: any) => [
						...current,
						...results.errors,
					]);
				}
			})
			.catch((errors) =>
				setErrors((current: any) => [...current, ...errors])
			)
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [stashes]);

	return {
		data: folders,
		loading: loading,
		error,
	};
}
