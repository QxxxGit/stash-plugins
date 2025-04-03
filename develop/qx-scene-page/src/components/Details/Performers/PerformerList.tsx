import { React } from "../../../globals";
import useConfiguration from "../../../hooks/useConfiguration";
import { IPerformer } from "../../../types/IPerformer";
import PerformerItem from "./PerformerItem";

const PerformerList: React.FC<{
	performers?: IPerformer[];
	scene_date?: string;
}> = ({ performers, scene_date }) => {
	const config = useConfiguration();

	function maybeShowAge() {
		if (!scene_date) return false;

		return config?.showPerformerAge;
	}

	return (
		<div className="performer-list row">
			{performers?.map((performer) => (
				<PerformerItem
					performer={performer}
					scene_date={scene_date}
					showAge={maybeShowAge()}
				/>
			))}
		</div>
	);
};

export default PerformerList;
