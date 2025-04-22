import { customDefinitionsPath } from "../globals";
import { ILinkDefinition } from "../types/LinkDefinitions";

const getCustomDefinitions = async () => {
	try {
		const json = (await fetch(customDefinitionsPath, { cache: "no-store" })
			.then((response) => response.json())
			.then((data) => data)) as ILinkDefinition[];

		return json;
	} catch (e) {
		console.error(`Error loading custom definitions: ${e}`);
	}
};

export const JsonUtils = {
	getCustomDefinitions,
};
