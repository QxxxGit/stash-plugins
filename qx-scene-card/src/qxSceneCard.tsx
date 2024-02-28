import { IPerformers, IPluginApi, ISceneCardProperties, IStudio } from "./types";

(function() {
    const api = (window as any).PluginApi as IPluginApi;
    const React = api.React;
    const GQL = api.GQL;
    const { Link, NavLink } = api.libraries.ReactRouterDOM;
    const { FormattedDate } = api.libraries.Intl;

    const RemoveStudioLogo = (sceneCardNode: HTMLElement) => {
        if(!sceneCardNode) return;

        const logoNode = sceneCardNode.querySelector(".studio-overlay");

        if(logoNode) {
            logoNode.classList.add('hide');
        }
    }

    const SetWatchedProperty = (sceneCardNode: HTMLElement, views: number) => {
        if(!sceneCardNode || views === 0) return;

        sceneCardNode.classList.add('watched');
    }

    const isPerformerListOverflowed = (listNode: HTMLElement): boolean => {
        return listNode.scrollHeight > listNode.clientHeight ||
            listNode.scrollWidth > listNode.clientWidth;
    }

    const RenderPerformers = (performers?: IPerformers[]) => {
        const nodeRef = React.useRef<HTMLDivElement>(null);

        return (
            <div className="performers">
                <div ref={nodeRef} className="list">
                    {performers?.map(performer => {
                        if(nodeRef?.current &&
                            isPerformerListOverflowed(nodeRef.current)) {
                                console.log('overflow');
                            return (<></>)
                        }

                        return (
                            <NavLink 
                                to={`/performers/${performer.id}`}
                                className={performer.gender}
                            >
                                {performer.name}
                            </NavLink>
                        )
                    })}
                </div>
            </div>
        )
    }

    const RenderFooter = (date?: string, views?: number, studio?: IStudio) => {
        return (
            <div className="footer">
                <span className="studio">
                    {studio && (
                        <Link to={`/studios/${studio.id}`}>
                            {studio.name}
                        </Link>
                    )}
                </span>
                <span className="views">
                    {views}{" "}
                    {views === 1 && "view" || "views"}
                </span>
                <span className="date">
                    {date && (
                        <FormattedDate
                            value={date}
                            format="short"
                            timeZone="utc"
                        />
                    )}
                </span>
            </div>
        )
    }

    const SceneCardDetails: React.FC<{
        props: ISceneCardProperties
    }> = ({props}) => {
        const nodeRef = React.useRef<HTMLDivElement>(null);
        const scene = props.scene;

        const { data } = GQL.useConfigurationQuery();
        const qxSceneCardSettings = data?.configuration?.plugins?.qxSceneCard;
        const isRemoveStudioSettingEnabled = qxSceneCardSettings?.studio ?? false;
        const isWatchedSettingEnabled = qxSceneCardSettings?.watched ?? false;

        React.useEffect(() => {
            // Gets the parental .scene-card node so we can manipulate it
            const sceneCardNode = nodeRef.current?.parentElement?.parentElement;

            if(isRemoveStudioSettingEnabled) {
                RemoveStudioLogo(sceneCardNode!);
            }
            
            if(isWatchedSettingEnabled) {
                SetWatchedProperty(sceneCardNode!, scene.play_count!);
            }
        }, []);

        return (
            <>
                <div ref={nodeRef}></div>
                {RenderPerformers(scene.performers)}
                {RenderFooter(
                    scene.date, 
                    scene.play_count, 
                    scene.studio
                )}
            </>
        )
    }

    api.patch.instead("SceneCard.Details", function (props: any, _: any, original: any) {
        return <SceneCardDetails props={props} />
    });
})();