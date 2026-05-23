import { components, React } from "../../../globals";
import { useURLParams } from "../../url/providers/URLParamsProvider";
import DisplayMode from "../displaymodes/DisplayMode";
import { useStashes } from "../hooks/useStashes";

const LibraryView: React.FC<{}> = ({}) => {
	const { params } = useURLParams();
	const displayMode = params.display;
	const { data, loading } = useStashes();
	const { LoadingIndicator } = components;

	if (loading) {
		return <LoadingIndicator />;
	}

	return <DisplayMode display={displayMode} folders={data} />;
};

export default LibraryView;
