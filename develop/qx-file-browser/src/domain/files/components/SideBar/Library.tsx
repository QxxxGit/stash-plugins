import { libraries, React } from "../../../../globals";
import SideBarButton from "./SideBarButton";

const Library: React.FC<{}> = ({}) => {
	const { FormattedMessage } = libraries.Intl;
	const { faFolder } = libraries.FontAwesomeSolid;

	return (
		<div className="section">
			<div className="header">
				<FormattedMessage id="folders" />
			</div>
			<div className="body">
				<SideBarButton
					icon={faFolder}
					label="Library"
					folderId="library"
				/>
			</div>
		</div>
	);
};

export default Library;
