import { React } from "../../globals";
import { IScene } from "../../types/IScene";
import SceneList from "./SceneList";

const QueuePanel: React.FC<{
	queue: IScene[];
}> = ({ queue }) => {
	return <SceneList scenes={queue} />;
};

export default QueuePanel;
