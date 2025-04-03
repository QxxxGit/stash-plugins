import { FormattedMessage, React, libraries } from "../../globals";
import { IPerformer } from "../../types/IPerformer";
import { IScene } from "../../types/IScene";
import { IStudio } from "../../types/IStudio";
import PerformerPanel from "./PerformerPanel";
import QueuePanel from "./QueuePanel";
import StudioPanel from "./StudioPanel";

const SidePanel: React.FC<{
	queue?: IScene[];
	studio?: IStudio;
	performers?: IPerformer[];
}> = ({ queue, studio, performers }) => {
	const { Nav, Tab } = libraries.Bootstrap;

	const determineDefaultTab =
		queue && queue.length > 0
			? "side-panel-queue"
			: studio
				? "side-panel-studio"
				: performers
					? `side-panel-performer-${performers[0].id}`
					: "";

	const [activeTabKey, setActiveTabKey] = React.useState(determineDefaultTab);

	const maybeRenderPerformerTabs = () => {
		return (
			<>
				{performers?.map((p) => (
					<Nav.Item>
						<Nav.Link eventKey={`side-panel-performer-${p.id}`}>
							{p.name}
						</Nav.Link>
					</Nav.Item>
				))}
			</>
		);
	};

	const maybeRenderPerformerTabPanes = () => {
		return (
			<>
				{performers?.map((p) => (
					<Tab.Pane eventKey={`side-panel-performer-${p.id}`}>
						<PerformerPanel performer={p} />
					</Tab.Pane>
				))}
			</>
		);
	};

	return (
		<div className="side-panel">
			<Tab.Container
				activeKey={activeTabKey}
				onSelect={(tab: any) => tab && setActiveTabKey(tab)}
			>
				<Nav variant="tabs" className="mr-auto">
					{queue && queue.length > 0 && (
						<Nav.Item>
							<Nav.Link eventKey="side-panel-queue">
								<FormattedMessage id="queue" />
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
					{maybeRenderPerformerTabs()}
				</Nav>
				<Tab.Content>
					{queue && queue.length > 0 && (
						<Tab.Pane eventKey="side-panel-queue">
							<QueuePanel queue={queue} />
						</Tab.Pane>
					)}
					{studio && (
						<Tab.Pane eventKey="side-panel-studio">
							<StudioPanel studio={studio} />
						</Tab.Pane>
					)}
					{maybeRenderPerformerTabPanes()}
				</Tab.Content>
			</Tab.Container>
		</div>
	);
};

export default SidePanel;
