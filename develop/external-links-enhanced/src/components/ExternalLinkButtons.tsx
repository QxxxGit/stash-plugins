import { React } from "../globals";
import { useExternalLinkSpecs } from "../hooks/useExternalLinkSpecs";
import ExternalLinkIconButton from "./ExternalLinkIconButton";

interface IExternalLinksButtons {
	urls: string[] | undefined;
}

const ExternalLinkButtons: React.FC<{
	props: IExternalLinksButtons;
}> = ({ props }) => {
	const urls = props.urls;
	const { urlSpecs, loading } = useExternalLinkSpecs(urls);

	if (loading) return null;

	return (
		<>
			{urlSpecs.map((spec, i) =>
				spec.urls.length ? (
					<ExternalLinkIconButton
						key={i}
						urls={spec.urls}
						className={spec.definition.name}
						icon={spec.definition.icon}
					/>
				) : null
			)}
		</>
	);
};

export default ExternalLinkButtons;
