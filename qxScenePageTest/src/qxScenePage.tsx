interface IPluginApi {
    React: typeof React;
    GQL: any;
    libraries: {
        ReactRouterDOM: {
            NavLink: React.FC<any>;
            Link: React.FC<any>;
            Route: React.FC<any>;
        },
        Bootstrap: {
            Button: React.FC<any>;
            Nav: React.FC<any> & {
                Link: React.FC<any>;
                Item: React.FC<any>;
            };
            Tab: React.FC<any> & {
                Container: React.FC<any>;
                Pane: React.FC<any>;
            };
        },
        Intl: {
            FormattedDate: React.FC<any>;
            FormattedMessage: React.FC<any>;
        }
    };
    components: Record<string, React.FC<any>>;
    patch: {
        instead: (target: string, fn: Function) => void;
    };
}

const api = (window as any).PluginApi as IPluginApi;

interface ITag {
    id: number;
    name: string;
}

interface IScene {
    id: number;
    title: string;
    files: any;
    tags: ITag[];
}

interface IScenePageProperties {
    scene: IScene;
    queueScenes: any;
}

(function() {
    const React = api.React;

    const ScenePage: React.FC<{
        props: IScenePageProperties
    }> = ({props}) => {
        const {
            TagLink
        } = api.components;
        
        const scene = props.scene;

        function maybeRenderTags() {
            if(scene.tags.length <= 0) return;

            return (
                <div className="scene-card__tags">
                    {scene.tags.map((tag: any) => (
                        <TagLink key={tag.id} tag={tag} />
                    ))}
                </div>
            )
        }

        return (
            <>
                {maybeRenderTags()}
            </>
        )
    }

    api.patch.instead("ScenePage", function(props: any, _: any, original: any) {
        return <ScenePage props={props} />
    });
})();