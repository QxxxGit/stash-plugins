import { LoadingIndicator, React } from "../../globals";
import useStudioScenes from "../../hooks/useStudioScenes";
import { IStudio } from "../../types/IStudio";
import SceneList from "./SceneList";

const StudioPanel: React.FC<{
    studio: IStudio
}> = ({
    studio
}) => {
    const queryScenes = useStudioScenes(studio);

    const scenes = React.useMemo(() => {
        return queryScenes;
    }, [queryScenes])

    return (
        !scenes ? (
            <LoadingIndicator />
        ) : (
            <SceneList scenes={scenes} />
        )
    )
}

export default StudioPanel;