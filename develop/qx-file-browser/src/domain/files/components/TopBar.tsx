import { React, components, libraries } from "../../../globals";

const TopBar: React.FC<{}> = ({}) => {
	const { Icon } = components;
	const { Button, Form } = libraries.Bootstrap;
	const { faGear } = libraries.FontAwesomeSolid;

	return (
		<div className="top-bar">
			<div className="left-controls">
				<Form.Control
					className="btn-secondary search-input"
					placeholder={`Search...`}
				/>
			</div>
			<div className="right-controls">
				<Button variant="primary">
					<Icon icon={faGear} />
				</Button>
			</div>
			<div className="left-controls">&nbsp;</div>
			<div className="right-controls">&nbsp;</div>
		</div>
	);
};

export default TopBar;
