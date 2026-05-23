import { gql } from "../../../../globals";
import { FILE_FRAGMENT } from "../fragments/FileFragment";
import { FOLDER_FRAGMENT } from "../fragments/FolderFragment";

export const GET_RECENT_FILES_QUERY = gql`
	${FOLDER_FRAGMENT}
	${FILE_FRAGMENT}

	query GetRecentFiles {
		findFolders(
			filter: { per_page: 10, sort: "created_at", direction: DESC }
		) {
			folders {
				...FolderFields
			}
		}
		findFiles(
			filter: { per_page: 100, sort: "created_at", direction: DESC }
		) {
			count
			files {
				...FileFields
			}
		}
	}
`;
