import { React } from "../globals";
import DefaultLinkDefinitions, { IExpectedUrlSpecs, ILinkDefinition } from "../types/LinkDefinitions";
import { getCustomDefinitions } from "../utils/json";
import { loadSvgIcon } from "../utils/svg";

interface IExternalLinksButtons {
	urls: string[] | undefined;
}

const ExternalLinkButtons: React.FC<{
	props: IExternalLinksButtons;
}> = ({ props }) => {
	return (<></>)
};

export default ExternalLinkButtons;
