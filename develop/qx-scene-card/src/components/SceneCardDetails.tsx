import { React } from "../globals";
import { SceneDateProvider } from "../hooks/useSceneDate";
import { ISceneCardProperties } from "../types/ISceneCard";
import { Footer } from "./Footer";
import { PerformerList } from "./Performers/PerformerList";
import SetWatchedProperty from "../helpers/FadeWatched";
import HideIndividualPopoverButtons from "../helpers/PopoverButtons";
import HideStudioLogo from "../helpers/StudioLogo";
import { useSettings } from "../hooks/useSettings";

const SceneCardDetails: React.FC<{
	props: ISceneCardProperties;
}> = ({ props }) => {
	const nodeRef = React.useRef<HTMLDivElement>(null);
	const scene = props.scene;
	const settings = useSettings();

	React.useEffect(() => {
		// Gets the parental .scene-card node so we can manipulate it
		const sceneCardNode = nodeRef.current?.parentElement?.parentElement;

		if (settings.hideStudio) {
			HideStudioLogo(sceneCardNode!);
		}

		if (settings.fadeWatched) {
			SetWatchedProperty(sceneCardNode!, scene.play_count!);
		}

		HideIndividualPopoverButtons(sceneCardNode!, settings);
	}, []);

	return (
		<SceneDateProvider date={scene.date}>
			<div ref={nodeRef}></div>
			<PerformerList performers={scene.performers} />
			<Footer
				id={scene.id}
				date={scene.date}
				views={scene.play_count}
				studio={scene.studio}
			/>
		</SceneDateProvider>
	);
};

export default SceneCardDetails;
