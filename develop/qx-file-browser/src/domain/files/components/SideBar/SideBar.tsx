import { libraries, React } from "../../../../globals";
import { IFolder } from "../../../stash/models/IFolder";
import Library from "./Library";
import SideBarButton from "./SideBarButton";
import Sources from "./Sources";

const SideBar: React.FC<{
	width?: number;
	stashes?: IFolder[];
}> = ({ width, stashes }) => {
	const { faClock, faHeart } = libraries.FontAwesomeRegular;
	const { faTrash } = libraries.FontAwesomeSolid;

	return (
		<div className="sidebar" style={{ flexBasis: width }}>
			<SideBarButton
				icon={faClock}
				label="Recently Added"
				folderId="recent"
			/>
			<SideBarButton icon={faHeart} label="Favorites" folderId="" />
			<SideBarButton icon={faTrash} label="Trash" folderId="" />
			<Sources sources={stashes} />
			<Library />
		</div>
	);
};

export default SideBar;
