import { LoadingIndicator, React } from "../../globals";
import { IPerformer } from "../../types/IPerformer";
import usePerformerScenes from "../../hooks/usePerformerScenes";
import SceneList from "./SceneList";

const PerformerPanel: React.FC<{
	performer: IPerformer;
}> = ({ performer }) => {
	const { data, loading } = usePerformerScenes(performer);

	const scenes = data?.findScenes?.scenes;

	if (loading) return <LoadingIndicator />;

	return <SceneList scenes={scenes} />;
};

export default PerformerPanel;
