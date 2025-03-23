import { FormattedMessage, React, components, libraries } from "../globals"
import { maybeGetSceneTitle } from "../utils/TextUtils";

const Header: React.FC<{
    title: string,
    files: any
}> = ({
    title,
    files
}) => {
    const {
        Button
    } = libraries.Bootstrap;

    const {
        Icon
    } = components;

    const {
        faEllipsis,
        faPencil
    } = libraries.FontAwesomeSolid;

    return (
        <div className="header">
            <div className="title">
                {maybeGetSceneTitle(title, files)}
            </div>
            <div className="buttons">
                <Button className="wide-btn">
                    <Icon icon={faPencil} />
                    <span className="label">
                        <FormattedMessage id="actions.edit" />
                    </span>
                </Button>
                <Button>
                    <Icon icon={faEllipsis} />
                </Button>
            </div>
        </div>
    )
}

export default Header;