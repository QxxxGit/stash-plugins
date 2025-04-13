import { React } from "../globals";
import DefaultLinkDefinitions, {
	ILinkDefinition,
	IURLSpecs,
} from "../types/LinkDefinitions";
import { IconUtils } from "../utils/icon";
import { JsonUtils } from "../utils/json";

export const useExternalLinkSpecs = (urls?: string[]) => {
	const [loading, setLoading] = React.useState(true);
	const [urlSpecs, setUrlSpecs] = React.useState<IURLSpecs[]>([]);
	const [definitions, setDefinitions] = React.useState<ILinkDefinition[]>(
		DefaultLinkDefinitions
	);

	React.useEffect(() => {
		setUrlSpecs([]);
		setDefinitions(DefaultLinkDefinitions);
		setLoading(true);
	}, [urls]);

	const updateDefinitions = React.useCallback(
		(definition: ILinkDefinition) => {
			setDefinitions((prev) =>
				prev.find((d) => d.name === definition.name)
					? prev
					: [...prev, definition]
			);
		},
		[]
	);

	const updateSpecs = React.useCallback((spec: IURLSpecs, url: string) => {
		setUrlSpecs((prev) => {
			const index = prev.findIndex(
				(s) => s.definition.name === spec.definition.name
			);

			if (index !== -1) {
				const existingSpec = prev[index];

				if (existingSpec.urls.includes(url)) return prev;

				const updatedSpec = {
					...existingSpec,
					urls: [...existingSpec.urls, url],
				};

				return [
					...prev.slice(0, index),
					updatedSpec,
					...prev.slice(index + 1),
				];
			}

			return [
				...prev,
				{
					definition: spec.definition,
					urls: [url],
				},
			];
		});
	}, []);

	const loadCustomDefinitions = React.useCallback(async () => {
		const customDefinitions = await JsonUtils.getCustomDefinitions();
		if (!customDefinitions?.length) return;

		for (const definition of customDefinitions) {
			const getIcon = await IconUtils.loadIcon(definition.icon);
			if (!getIcon) continue;

			updateDefinitions({
				name: definition.name,
				icon: getIcon,
				addresses: definition.addresses,
				regex: definition.regex,
			});
		}

		setLoading(false);
	}, [updateDefinitions]);

	const pairLinksToDefinitions = React.useCallback(() => {
		if (!urls?.length) return;

		urls.forEach((url) => {
			const matchedDefinition = definitions.find((d) =>
				d.addresses.some((addr) => {
					const regex = new RegExp(
						d.regex ?? `https?:\/\/(?:www\.)?${addr}\/`
					);

					return regex.test(url);
				})
			);

			const definition =
				matchedDefinition ||
				DefaultLinkDefinitions.find((d) => d.name === "other");

			if (definition) {
				updateSpecs({ definition, urls: [] }, url);
			}
		});
	}, [urls, definitions, updateSpecs]);

	React.useEffect(() => {
		if (urls?.length) {
			loadCustomDefinitions();
		} else {
			setLoading(false);
		}
	}, [urls, loadCustomDefinitions]);

	React.useEffect(() => {
		if (!loading) {
			pairLinksToDefinitions();
		}
	}, [loading, pairLinksToDefinitions]);

	return { urlSpecs, loading };
};
