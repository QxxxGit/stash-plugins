import { components, React } from "../../../../globals";
import { useNavigation } from "../../hooks/useNavigation";

const SideBarButton: React.FC<{
	icon: any;
	label: string;
	folderId: string;
}> = ({ label, icon, folderId }) => {
	const { goToFolder } = useNavigation();
	const { Icon } = components;

	return (
		<div className="button" onClick={() => goToFolder(folderId)}>
			<Icon icon={icon} />
			&nbsp;
			{label}
		</div>
	);
};

export default SideBarButton;
