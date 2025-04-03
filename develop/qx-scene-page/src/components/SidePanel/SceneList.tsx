import { LoadingIndicator, React } from "../../globals";
import { IScene } from "../../types/IScene";
import SceneItem from "./SceneItem";

const SceneList: React.FC<{
	scenes: IScene[];
}> = ({ scenes }) => {
	if (!scenes || scenes.length === 0) return <LoadingIndicator />;

	return (
		<div className="scene-list">
			{scenes.map((scene) => (
				<SceneItem scene={scene} />
			))}
		</div>
	);
};

export default SceneList;
