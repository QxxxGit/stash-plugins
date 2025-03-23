import { FormattedMessage, React, libraries } from "../../globals";
import { IScene } from "../../types/IScene";
import SceneItem from "./SceneItem";

const QueuePanel: React.FC<{
    queue: IScene[]
}> = ({
    queue
}) => {
    const sceneItems = queue.map((scene) => (
        <SceneItem scene={scene}/>
    ));

    return (
        <div className="scene-list">
            {sceneItems}
        </div>
    )
}

export default QueuePanel;