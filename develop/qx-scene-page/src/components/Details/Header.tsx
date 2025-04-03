import {
	Button,
	FormattedMessage,
	Icon,
	React,
	libraries,
} from "../../globals";
import FilterButton from "./Filters/FilterButton";

const Header: React.FC<{
	title: string;
	onClickEdit: () => void;
}> = ({ title, onClickEdit }) => {
	const { faEllipsis, faPencil } = libraries.FontAwesomeSolid;

	return (
		<div className="header">
			<div className="title">{title}</div>
			<div className="buttons">
				<Button className="wide-btn" onClick={onClickEdit}>
					<Icon icon={faPencil} />
					<span className="label">
						<FormattedMessage id="actions.edit" />
					</span>
				</Button>
				<FilterButton />
				<Button>
					<Icon icon={faEllipsis} />
				</Button>
			</div>
		</div>
	);
};

export default Header;
