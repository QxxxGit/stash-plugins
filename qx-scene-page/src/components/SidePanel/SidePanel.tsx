import { FormattedMessage, React, libraries } from "../../globals";
import { IPerformer } from "../../types/IPerformer";
import { IScene } from "../../types/IScene";
import { IStudio } from "../../types/IStudio";
import QueuePanel from "./QueuePanel";
import StudioPanel from "./StudioPanel";

const SidePanel: React.FC<{
    queue: IScene[],
    studio?: IStudio,
    performers?: IPerformer[]
}> = ({
    queue,
    studio,
    performers
}) => {
    const {
        Nav,
        Tab
    } = libraries.Bootstrap;

    const [activeTabKey, setActiveTabKey] = React.useState("side-panel-queue");

    return (
        <div className="side-panel">
            {studio && (
                <StudioPanel studio={studio} />
            )}
            {/* <Tab.Container
                activeKey={activeTabKey}
                onSelect={(tab: any) => tab && setActiveTabKey(tab)}
            >
                <Nav variant="tabs" className="mr-auto">
                    {queue.length > 0 && (
                        <Nav.Item>
                            <Nav.Link eventKey="side-panel-queue">
                                <FormattedMessage id="queue"/>
                            </Nav.Link>
                        </Nav.Item>
                    )}
                    {studio && (
                        <Nav.Item>
                            <Nav.Link eventKey="side-panel-studio">
                                {studio.name}
                            </Nav.Link>
                        </Nav.Item>
                    )}
                </Nav>
                <Tab.Content>
                    {queue.length > 0 && (
                        <Tab.Pane eventKey="side-panel-queue">
                            <QueuePanel queue={queue}/>
                        </Tab.Pane>
                    )}
                    {studio && (
                        <Tab.Pane eventKey="side-panel-studio">
                            <StudioPanel studio={studio} />
                        </Tab.Pane>
                    )}
                </Tab.Content>
            </Tab.Container> */}
        </div>
    )
}

export default SidePanel;