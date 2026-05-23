import { React } from "../../../globals";
import { useURLParams } from "../../url/providers/URLParamsProvider";
import FolderView from "../views/FolderView";
import LibraryView from "../views/LibraryView";
import RecentView from "../views/RecentView";
import TopBar from "./TopBar";

const MainWindow: React.FC<{}> = ({}) => {
	const { params } = useURLParams();

	const renderView = () => {
		switch (params.folder) {
			case "library":
				return <LibraryView />;
			case "recent":
				return <RecentView />;
			default:
				return <FolderView />;
		}
	};

	return (
		<div className="main-window">
			<TopBar />
			{renderView()}
		</div>
	);
};

export default MainWindow;
