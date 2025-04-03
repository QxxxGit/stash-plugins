import { LoadingIndicator, React } from "../../globals";
import useStudioScenes from "../../hooks/useStudioScenes";
import { IStudio } from "../../types/IStudio";
import SceneList from "./SceneList";

const StudioPanel: React.FC<{
	studio: IStudio;
}> = ({ studio }) => {
	const { data, loading } = useStudioScenes(studio);

	const scenes = data?.findScenes?.scenes;

	if (loading) return <LoadingIndicator />;

	return <SceneList scenes={scenes} />;
};

export default StudioPanel;
