import { gql } from "../../../../globals";

export const FOLDER_FRAGMENT = gql`
	fragment FolderFields on Folder {
		id
		path
		basename
		mod_time
		sub_folders {
			id
		}
		created_at
		updated_at
	}
`;
