import { GQL, React } from "../globals";
import { IScene } from "../types/IScene";
import { IStudio } from "../types/IStudio";

function useStudioScenes(studio: IStudio) {
    const [data, setData] = React.useState<IScene[]>([]);

    async function getStudioScenes(){
        const fetchScenes = await GQL.useFindScenesQuery({
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
        });

        const scenes = fetchScenes?.data?.findScenes?.scenes;

        if(scenes) {
            console.log(scenes);
            setData(scenes);
        }
    }

    getStudioScenes();

    return data;
}

export default useStudioScenes;