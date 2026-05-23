import { libraries, React } from "../../../../globals";
import { IFolder } from "../../../stash/models/IFolder";
import SideBarButton from "./SideBarButton";

const Sources: React.FC<{
	sources?: IFolder[];
}> = ({ sources }) => {
	if (!sources) return;

	const { FormattedMessage } = libraries.Intl;
	const { faHardDrive } = libraries.FontAwesomeRegular;

	const displayPath = (stash: IFolder) => {
		const parts = stash.path.split("/").filter(Boolean);
		const lastTwo = parts.slice(-2);

		return `.../${lastTwo.join("/")}`;
	};

	return (
		<div className="section">
			<div className="header">
				<FormattedMessage id="stashes" />
			</div>
			<div className="body">
				{sources.map((s) => (
					<SideBarButton
						icon={faHardDrive}
						label={displayPath(s)}
						folderId={s.id}
					/>
				))}
			</div>
		</div>
	);
};

export default Sources;
