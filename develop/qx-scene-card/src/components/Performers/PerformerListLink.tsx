import { React } from "../../globals";
import { IPerformer } from "../../types/IPerformer";
import { libraries } from "../../globals";

const PerformerListLink: React.FC<{
	performer: IPerformer;
}> = ({ performer }) => {
	const { Link } = libraries.ReactRouterDOM;

	return (
		<Link to={`/performers/${performer.id}`} className={performer.gender}>
			{performer.name}
		</Link>
	);
};

export default PerformerListLink;
