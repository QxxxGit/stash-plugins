import Details from "./components/Details/Details";
import SidePanel from "./components/SidePanel/SidePanel";
import { React, patch } from "./globals";
import { IScene } from "./types/IScene";

interface IScenePageProperties {
	scene: IScene;
	queueScenes: IScene[];
}

(function () {
	const ScenePage: React.FC<{
		props: IScenePageProperties;
	}> = ({ props }) => {
		const scene = props.scene;

		return (
			<div className="scene-container">
				<Details scene={scene} />
				<SidePanel
					queue={props.queueScenes}
					studio={scene.studio}
					performers={scene.performers}
				/>
			</div>
		);
	};

	patch.instead("ScenePage", function (props: any, _: any, original: any) {
		return <ScenePage props={props} />;
	});
})();
