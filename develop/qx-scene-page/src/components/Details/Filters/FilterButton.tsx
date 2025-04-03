import {
	Button,
	FormattedMessage,
	Icon,
	libraries,
	React,
} from "../../../globals";
import { DefaultFilters, ISceneFilters } from "../../../types/ISceneFilter";
import FilterOverlay from "./FilterOverlay";

const FilterButton: React.FC<{}> = ({}) => {
	const [filters, setFilters] = React.useState<ISceneFilters>(DefaultFilters);
	const buttonRef = React.useRef<HTMLElement>();
	const { faSliders } = libraries.FontAwesomeSolid;
	const { OverlayTrigger } = libraries.Bootstrap;

	const updateFilters = (newData: any) => {
		setFilters(prevData => ({
			...prevData,
			newData
		}));
	}

	const renderFilterOverlay = (props: any) => {
		return <FilterOverlay props={props} filters={filters} onUpdate={(data: ISceneFilters) => updateFilters(data)}/>;
	};

	return (
		<>
			<OverlayTrigger
				placement="top"
				trigger="click"
				overlay={renderFilterOverlay}
				rootClose
			>
				<Button className="wide-btn" ref={buttonRef}>
					<Icon icon={faSliders} />
					<span className="label">
						<FormattedMessage id="filters" />
					</span>
				</Button>
			</OverlayTrigger>
		</>
	);
};

export default FilterButton;
