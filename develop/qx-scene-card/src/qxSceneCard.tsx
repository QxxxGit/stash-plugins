import { IQxSceneCardSettings, ISceneCardProperties } from "./types";
import { GQL, React, patch } from "./globals";
import { PerformerList } from "./components/PerformerList";
import { Footer } from "./components/Footer";

const HideStudioLogo = (sceneCardNode: HTMLElement) => {
    if(!sceneCardNode) return;

    const logoNode = sceneCardNode.querySelector(".studio-overlay");
    logoNode?.classList.add('hide');
}

const HideIndividualPopoverButtons = (sceneCardNode: HTMLElement, settings: IQxSceneCardSettings) => {
    if(!sceneCardNode || !settings) return;

    if(settings.hideMarkers) {
        const markerNode = sceneCardNode.querySelector('.marker-count');
        markerNode?.classList.add('hide');
    }
    
    if(settings.hideMovies) {
        const movieNode = sceneCardNode.querySelector('.movie-count');
        movieNode?.classList.add('hide');
    }

    if(settings.hideOCounter) {
        const oCounterNode = sceneCardNode.querySelector('.o-count');
        oCounterNode?.classList.add('hide');
    }
}

const SetWatchedProperty = (sceneCardNode: HTMLElement, views: number) => {
    if(!sceneCardNode || views === 0) return;

    sceneCardNode.classList.add('watched');
}

const SceneCardDetails: React.FC<{
    props: ISceneCardProperties
}> = ({props}) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    const scene = props.scene;

    const { data } = GQL.useConfigurationQuery();
    const qxSceneCardSettings: IQxSceneCardSettings = data?.configuration?.plugins?.qxSceneCard;
    const isHideStudioSettingEnabled = qxSceneCardSettings?.hideStudio;
    const isWatchedSettingEnabled = qxSceneCardSettings?.fadeWatched;

    React.useEffect(() => {
        // Gets the parental .scene-card node so we can manipulate it
        const sceneCardNode = nodeRef.current?.parentElement?.parentElement;

        if(isHideStudioSettingEnabled) {
            HideStudioLogo(sceneCardNode!);
        }
        
        if(isWatchedSettingEnabled) {
            SetWatchedProperty(sceneCardNode!, scene.play_count!);
        }

        HideIndividualPopoverButtons(sceneCardNode!, qxSceneCardSettings);
    }, []);

    return (
        <>
            <div ref={nodeRef}></div>
            {PerformerList(scene.performers)}
            {Footer(
                scene.date, 
                scene.play_count, 
                scene.studio
            )}
        </>
    )
}

patch.instead("SceneCard.Details", function(props: any, _: any, original: any) {
    return <SceneCardDetails props={props} />
});