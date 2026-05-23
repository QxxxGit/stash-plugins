import { components, React } from "../../../globals";
import { useURLParams } from "../../url/providers/URLParamsProvider";
import DisplayMode from "../displaymodes/DisplayMode";
import { useRecentFilesQuery } from "../hooks/useRecentFilesQuery";

const RecentView: React.FC<{}> = ({}) => {
	const { params } = useURLParams();
	const { data, loading } = useRecentFilesQuery();
	const { LoadingIndicator } = components;

	if (loading) {
		return <LoadingIndicator />;
	}

	const fileResults = data?.findFiles?.files;
	const folderResults = data?.findFolders?.folders;

	return (
		<DisplayMode
			display={params.display}
			folders={folderResults}
			files={fileResults}
		/>
	);
};

export default RecentView;
