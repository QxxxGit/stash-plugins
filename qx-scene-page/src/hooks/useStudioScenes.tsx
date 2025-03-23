import { GQL, React } from "../globals";
import { IScene } from "../types/IScene";
import { IStudio } from "../types/IStudio";

function useStudioScenes(studio: IStudio) {
    const props = React.useMemo(() => {
        return { 
            variables: {
                scene_filter: {
                    studios: {
                        value: [studio.id],
                        modifier: "EQUALS"
                    }
                },
                filter: {
                    sort: "random"
                }
            }
        }
    }, [studio]);

    return GQL.useFindScenesQuery(props);
}

export default useStudioScenes;