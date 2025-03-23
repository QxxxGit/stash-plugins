import { React, components, loadableComponents, utils, hooks, FormattedDate, libraries, FormattedMessage, Link } from "../globals";
import { IStudio } from "../types/IStudio";
import { ITag } from "../types/ITag";

const Description: React.FC<{
    details?: string,
    date?: string,
    tags: ITag[],
    play_count?: number,
    created_at: string,
    updated_at: string,
    studio?: IStudio
}> = ({
    details,
    date,
    tags,
    play_count,
    created_at,
    updated_at,
    studio
}) => {
    const componentsToLoad = [
        loadableComponents.TagLink
    ];

    const componentsLoading = hooks.useLoadComponents(componentsToLoad);

    const {
        LoadingIndicator,
        TagLink
    } = components;

    const {
        Nav,
        Tab
    } = libraries.Bootstrap;

    function maybeRenderTags() {
        if(tags.length <= 0) return;

        return (
            <div className="tags">
                {tags.map((tag: any) => (
                    <TagLink key={tag.id} tag={tag} />
                ))}
            </div>
        )
    }

    if(componentsLoading) return (
        <LoadingIndicator />
    );

    return (
        <div className="row">
            <div className="description col-9">
                <div className="row">
                    {date && (
                        <FormattedDate
                            value={date}
                            day="numeric"
                            month="short"
                            year="numeric"
                            timeZone="utc"
                        />
                    )}
                </div>
                <div className="row">
                    {maybeRenderTags()}
                </div>
                <div className="row">
                    <p className="pre">
                        {studio && (
                            <Link to={`/studio/${studio.id}`}>
                                <img className="studio-image" src={studio.image_path} />
                            </Link>
                        )}
                        {details}
                    </p>
                    <p className="pre">
                        <div>
                            <span>
                                <FormattedMessage id="created_at" />{": "}
                            </span>
                            <span>
                                <FormattedDate value={created_at} format="short" timeZone="utc" />
                            </span>
                        </div>
                        <div>
                            <span>
                                <FormattedMessage id="updated_at" />{": "}
                            </span>
                            <span>
                                <FormattedDate value={updated_at} format="short" timeZone="utc" />
                            </span>
                        </div>
                    </p>
                </div>
            </div>
            <div className="markers col-3">
                <Tab.Container>
                    <Nav variant="tabs" className="mr-auto">
                        <Nav.Item>
                            <Nav.Link>
                                <FormattedMessage id="markers" />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link>
                                <FormattedMessage id="filters" />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link>
                                <FormattedMessage id="file_info" />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link>
                                <FormattedMessage id="history" />
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Tab.Container>
            </div>
        </div>
    );
}

export default Description;