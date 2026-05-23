import { gql } from "../../../../globals";

export const FILE_FRAGMENT = gql`
	fragment FileFields on BaseFile {
		__typename
		id
		basename
		size

		... on ImageFile {
			images {
				id

				paths {
					image
					preview
					thumbnail
				}
			}
		}

		... on VideoFile {
			scenes {
				id

				paths {
					screenshot
				}
			}
		}
	}
`;
