import { customDefinitionsPath } from "../globals";
import { ILinkDefinition } from "../types/LinkDefinitions";

export const getCustomDefinitions = async () => {
	const json = (await fetch(customDefinitionsPath)
		.then((response) => response.json())
		.then((data) => data)) as ILinkDefinition[];

	return json;
};
