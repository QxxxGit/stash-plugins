import { React } from "../../globals";
import { IScene } from "../../types/IScene";
import { maybeGetSceneTitle } from "../../utils/TextUtils";
import Description from "./Description";
import Editor from "./Editor";
import Header from "./Header";
import PerformerList from "./Performers/PerformerList";

const Details: React.FC<{
	scene: IScene;
}> = ({ scene }) => {
	const [isEditing, setIsEditing] = React.useState(false);
	const detailsRef = React.useRef<HTMLDivElement>(null);
	const title = maybeGetSceneTitle(scene.title, scene.files);

	const toggleEditing = () => setIsEditing((value) => !value);

	React.useEffect(() => {
		if (isEditing) {
			detailsRef?.current?.scrollIntoView();
		} else {
			window.scrollTo(0, 0);
		}
	}, [isEditing]);

	return (
		<div className="scene-details" ref={detailsRef}>
			<Header title={title} onClickEdit={() => toggleEditing()} />
			<PerformerList
				performers={scene.performers}
				scene_date={scene.date}
			/>
			{!isEditing ? (
				// <Description scene={scene} />
				<></>
			) : (
				<Editor scene={scene} />
			)}
		</div>
	);
};

export default Details;
