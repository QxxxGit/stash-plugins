import { IScene } from "../../types/IScene";
import {
	FormattedDate,
	FormattedMessage,
	Link,
	React,
	components,
	hooks,
	libraries,
	loadableComponents,
} from "../../globals";

const Description: React.FC<{
	scene: IScene;
}> = ({ scene }) => {
	const componentsToLoad = [loadableComponents.TagLink];

	const componentsLoading = hooks.useLoadComponents(componentsToLoad);

	const { LoadingIndicator, TagLink } = components;

	const { Nav, Tab } = libraries.Bootstrap;
	const { Icon } = components;
	const { faCalendar, faTags } = libraries.FontAwesomeSolid;

	function maybeRenderTags() {
		if (scene.tags.length <= 0) return;

		return (
			<div className="tags">
				{scene.tags.map((tag: any) => (
					<TagLink key={tag.id} tag={tag} />
				))}
			</div>
		);
	}

	if (componentsLoading) return <LoadingIndicator />;

	return (
		<div className="row">
			<div className="description-container col-5">
				<div className="description">
					{scene.date && (
						<div className="row">
							<h5 className="date">
								<Icon icon={faCalendar} />
								<FormattedDate
									value={scene.date}
									day="numeric"
									month="long"
									year="numeric"
									timeZone="utc"
								/>
							</h5>
						</div>
					)}
					{scene.details && (
						<div className="row">
							<p className="pre">{scene.details}</p>
						</div>
					)}
				</div>
			</div>
			<div className="markers col-4">
				<Tab.Container>
					<Nav variant="tabs" className="mr-auto">
						<Nav.Item>
							<Nav.Link>
								<FormattedMessage id="markers" />
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
			<div className="col-3">
				{scene.studio && (
					<div className="row">
						<Link to={`/studio/${scene.studio.id}`}>
							<img
								className="studio-image"
								src={scene.studio.image_path}
							/>
						</Link>
					</div>
				)}
				{scene.tags && scene.tags.length > 0 && (
					<>
						<h5>
							<Icon icon={faTags} />
							<FormattedMessage id="tags" />
						</h5>
						<div className="row">{maybeRenderTags()}</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Description;
