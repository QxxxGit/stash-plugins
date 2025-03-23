import { FormattedMessage, Link, React } from "../../globals";
import { IPerformer } from "../../types/IPerformer";
import TextUtils from "../../utils/TextUtils";

const PerformerItem: React.FC<{
    performer: IPerformer
    showAge: boolean
    scene_date?: string
}> = ({
    performer,
    showAge,
    scene_date,
}) => {
    function getAge() {
        if(!showAge) return;

        const age = TextUtils.calculateAge(performer.birthdate, scene_date);

        return (
            <span className="age">
                ({age})
            </span>
        )
    }

    return (
        <Link to={`/performers/${performer.id}`} >
            <div className="performer row">
                <div className="picture">
                    <img src={performer.image_path} />
                </div>
                <div className="info">
                    <div className="row">
                        {performer.name}
                        {getAge()}
                    </div>
                    <div className="scene-count row">
                        {performer.scene_count + " "}
                        <FormattedMessage 
                            id="countables.scenes"
                            values={{ count: performer.scene_count }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PerformerItem;