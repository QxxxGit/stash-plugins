import { gql } from "../../../../globals";
import { FOLDER_FRAGMENT } from "../fragments/FolderFragment";

export const GET_FOLDER_METADATA_QUERY = gql`
	${FOLDER_FRAGMENT}

	query GetFolderData($folderId: ID, $folderPath: String) {
		findFolder(id: $folderId, path: $folderPath) {
			...FolderFields

			parent_folders {
				id
				basename
			}

			sub_folders {
				...FolderFields
			}
		}
	}
`;
