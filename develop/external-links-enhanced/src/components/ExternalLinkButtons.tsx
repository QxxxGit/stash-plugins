import { React } from "../globals";
import DefaultLinkDefinitions, {
	ILinkDefinition,
	IURLSpecs,
} from "../types/LinkDefinitions";
import { IconUtils } from "../utils/icon";
import { JsonUtils } from "../utils/json";
import { SvgUtils } from "../utils/svg";
import ExternalLinkIconButton from "./ExternalLinkIconButton";

interface IExternalLinksButtons {
	urls: string[] | undefined;
}

const ExternalLinkButtons: React.FC<{
	props: IExternalLinksButtons;
}> = ({ props }) => {
	const urls = props.urls;
	const [loading, setLoading] = React.useState(true);
	const [definitions, setDefinitions] = React.useState<ILinkDefinition[]>(
		DefaultLinkDefinitions
	);
	const [urlSpecs, setUrlSpecs] = React.useState<IURLSpecs[]>([]);
	const abortController = new AbortController();

	const updateDefinitions = (definition: ILinkDefinition) => {
		if (definitions.find((d) => d.name === definition.name)) return;

		setDefinitions([...definitions, definition]);
	};

	const updateSpecs = (spec: IURLSpecs, url: string) => {
		setUrlSpecs((prev) => {
			const index = prev.findIndex(
				(s) => s.definition.name === spec.definition.name
			);

			if (index !== -1) {
				const existingSpec = prev[index];

				// stop duplicates
				if (existingSpec.urls.includes(url)) return prev;

				const updatedSpec = {
					...prev[index],
					urls: [...prev[index].urls, url],
				};

				return [
					...prev.slice(0, index),
					updatedSpec,
					...prev.slice(index + 1),
				];
			} else {
				return [...prev, { definition: spec.definition, urls: [url] }];
			}
		});
	};

	const checkForCustomDefinitions = async () => {
		if (!urls?.length) return;

		const customDefinitions = await JsonUtils.getCustomDefinitions();

		if (!customDefinitions?.length) return;

		customDefinitions.map(async (link) => {
			const getIcon = await IconUtils.loadIcon(link.icon);

			if (!getIcon) return;

			updateDefinitions({
				name: link.name,
				icon: getIcon,
				addresses: link.addresses,
				regex: link.regex,
			});
		});

		setLoading(false);
	};

	const pairLinksToDefinitions = () => {
		urls?.map((url) => {
			const lookup = definitions.find((d) =>
				d.addresses.find((addr) => {
					const regex = new RegExp(
						d.regex ?? `https?:\/\/(?:www\.)?${addr}\/`
					);

					return url.match(regex);
				})
			);

			if (lookup) {
				updateSpecs(
					{
						definition: lookup,
						urls: [],
					},
					url
				);
			} else {
				const other = DefaultLinkDefinitions.find(
					(d) => d.name === "other"
				);

				if (!other) return;

				updateSpecs(
					{
						definition: other,
						urls: [],
					},
					url
				);
			}
		});
	};

	React.useEffect(() => {
		checkForCustomDefinitions();

		if (!loading) {
			pairLinksToDefinitions();
		}

		return () => abortController.abort();
	}, [loading, definitions]);

	const renderIconButtons = () => {
		return urlSpecs.map((spec, i) => {
			if (!spec.urls.length) return;

			return (
				<ExternalLinkIconButton
					key={i}
					urls={spec.urls}
					className={spec.definition.name}
					icon={spec.definition.icon}
				/>
			);
		});
	};

	if (loading) return null;

	return <>{renderIconButtons()}</>;
};

export default ExternalLinkButtons;
