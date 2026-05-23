import { components, libraries, React } from "../../../globals";

const MainNavBarButton = () => {
	const { NavLink } = libraries.ReactRouterDOM;
	const { Icon } = components;
	const { Button } = libraries.Bootstrap;
	const { faFolder } = libraries.FontAwesomeSolid;

	return (
		<NavLink className="nav-link" exact to="/plugins/qx-file-browser">
			<Button
				className="minimal d-flex align-items-center h-100"
				title="File Browser">
				<Icon icon={faFolder} />
				<span>File Browser</span>
			</Button>
		</NavLink>
	);
};

export default MainNavBarButton;
