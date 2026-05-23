import { gql } from "../../../../globals";
import { FILE_FRAGMENT } from "../fragments/FileFragment";
import { FOLDER_FRAGMENT } from "../fragments/FolderFragment";

export const GET_FOLDER_CONTENTS_QUERY = gql`
	${FOLDER_FRAGMENT}
	${FILE_FRAGMENT}

	query GetFolderContents($folderId: ID!, $page: Int!) {
		findFolder(id: $folderId) {
			...FolderFields

			sub_folders {
				...FolderFields
			}
		}
		findFiles(
			file_filter: {
				parent_folder: { value: [$folderId], modifier: EQUALS }
			}
			filter: { per_page: 50, page: $page }
		) {
			count
			files {
				...FileFields
			}
		}
	}
`;

export type GetFolderContentsQueryResults = {
	findFolder: {
		id: string;
		path: string;
		basename: string;
		mod_time: string;
		sub_folders: {
			id: string;
		};
		created_at: string;
		updated_at: string;
	};
	findFiles: {
		files: {
			id: string;
			basename: string;
		}[];
	};
};
