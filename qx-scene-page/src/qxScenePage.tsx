import { GQL, React, patch } from "./globals";
import { IScene } from "./types/IScene";
import Header from "./components/Header";
import PerformerList from "./components/PerformerList";
import Description from "./components/Description";
import SidePanel from "./components/SidePanel/SidePanel";

interface IScenePageProperties {
    scene: IScene;
    queueScenes: IScene[];
}
(function() {
    const ScenePage: React.FC<{
        props: IScenePageProperties
    }> = ({props}) => {
        const scene = props.scene;

        return (
            <div className="scene-container">
                <div className="scene-details">
                    <Header 
                        title={scene.title}
                        files={scene.files}
                    />
                    <PerformerList performers={scene.performers} />
                    <Description
                        details={scene.details}
                        date={scene.date}
                        tags={scene.tags}
                        play_count={scene.play_count}
                        created_at={scene.created_at}
                        updated_at={scene.updated_at}
                        studio={scene.studio}
                    />
                </div>
                <SidePanel
                    queue={props.queueScenes}
                    studio={scene.studio}
                    performers={scene.performers}
                />
            </div>
        )
    }

    patch.instead("ScenePage", function(props: any, _: any, original: any) {
        return <ScenePage props={props} />
    });
})();