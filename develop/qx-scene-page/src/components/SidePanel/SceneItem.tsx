import { FormattedDate, Link, React } from "../../globals";
import { IScene } from "../../types/IScene";
import { maybeGetSceneTitle } from "../../utils/TextUtils";

const SceneItem: React.FC<{
	scene: IScene;
}> = ({ scene }) => {
	// comma separated performers
	const performers = scene.performers?.map((performer, index) => {
		return (
			<span key={performer.id}>
				{(index ? ", " : "") + performer.name}
			</span>
		);
	});

	return (
		<Link to={`/scenes/${scene.id}`}>
			<div className={"scene-item"}>
				<div className="thumbnail">
					<img src={scene.paths.screenshot} />
				</div>
				<div className="info">
					<div className="title">
						{maybeGetSceneTitle(scene.title, scene.files)}
					</div>
					<div className="studio">{scene.studio?.name}</div>
					<div className="performers">{performers}</div>
					<div className="date">
						{scene.date && (
							<FormattedDate
								value={scene.date}
								day="numeric"
								month="short"
								year="numeric"
								timeZone="utc"
							/>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
};

export default SceneItem;
