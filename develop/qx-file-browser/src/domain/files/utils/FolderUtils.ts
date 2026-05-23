import { GET_FOLDER_METADATA_QUERY } from "../graphql/queries/GetFolderMetadataQuery";
import {
	FolderId,
	VIRTUAL_FOLDER_IDS,
	VirtualFolderId,
} from "../types/VirtualFolders";

const IsVirtualFolder = (value: string): value is VirtualFolderId => {
	return VIRTUAL_FOLDER_IDS.includes(value as VirtualFolderId);
};

const ParseFolderId = (value: string | null): FolderId | undefined => {
	if (!value) return undefined;
	if (IsVirtualFolder(value)) return value;

	const parseNumber = Number(value);
	if (!Number.isNaN(parseNumber)) return parseNumber;

	return undefined;
};

async function FetchByPath(client: any, paths: string[]) {
	const results = await Promise.all(
		paths.map((path) =>
			client.query({
				query: GET_FOLDER_METADATA_QUERY,
				variables: { folderPath: path },
				errorPolicy: "all",
			})
		)
	);

	let folderErrors: string[] = [];

	const convertResults = results.flatMap((r, i) => {
		if (r.errors?.length) {
			folderErrors.push(`GQL error for ${paths[i]}`, r.errors);

			return [];
		}

		return r.data?.findFolder ? [r.data.findFolder] : [];
	});

	return {
		data: convertResults,
		errors: folderErrors,
	};
}

export const FolderUtils = {
	IsVirtualFolder,
	ParseFolderId,
	FetchByPath,
};
