import { React, FormattedMessage, Link } from "../globals";
import { IPerformer } from "../types/IPerformer";

const PerformerList: React.FC<{
    performers?: IPerformer[]
}> = ({
    performers
}) => {
    return (
        <div className="performer-list row">
            {performers?.map((performer) => (
                <Link to={`/performers/${performer.id}`} >
                    <div className="performer row">
                        <div className="picture">
                            <img src={performer.image_path} />
                        </div>
                        <div className="info">
                            <div className="row">
                                {performer.name}
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
            ))}
        </div>
    );
}

export default PerformerList;