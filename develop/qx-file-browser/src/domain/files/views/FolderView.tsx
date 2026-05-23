import { React } from "../../../globals";
import { useURLParams } from "../../url/providers/URLParamsProvider";
import DisplayMode from "../displaymodes/DisplayMode";
import { useFolderContentsQuery } from "../hooks/useFolderContentsQuery";

const FolderView: React.FC<{}> = ({}) => {
	const { params } = useURLParams();
	const { data, hasMore, loadMore } = useFolderContentsQuery(
		String(params.folder)
	);

	const fileResults = data?.findFiles?.files;
	const folderResults = data?.findFolder?.sub_folders;

	return (
		<DisplayMode
			key={`display-mode`}
			display={params.display}
			folders={folderResults}
			files={fileResults}
			hasMore={hasMore}
			onLoadMore={loadMore}
		/>
	);
};

export default FolderView;
