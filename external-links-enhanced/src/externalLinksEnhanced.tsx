import { React, components, faLink, patch } from "./globals";
import LinkDefinitions, {
	IExpectedUrlSpecs,
	ILinkDefinition,
} from "./types/LinkDefinitions";

interface IExternalLinksButtons {
	urls: string[] | undefined;
}

(function () {
	const ExternalLinksButtons: React.FC<{
		props: IExternalLinksButtons;
	}> = ({ props }) => {
		const urls = props.urls;
		const { ExternalLinksButton } = components;

		const links = new Map<string, IExpectedUrlSpecs>();

		const urlSpecsBuilder = (link: ILinkDefinition, url: string) => {
			if (links.has(link.name)) {
				links.get(link.name)?.urls.push(url);

				return;
			}

			links.set(link.name, {
				icon: link.icon,
				className: link.name,
				urls: [url],
			});
		};

		const urlSpecs = React.useMemo(() => {
			if (!urls?.length) {
				return [];
			}

			urls.map((url) => {
				const lookup = LinkDefinitions.find((link) =>
					link.baseAddresses.find((addr) => {
						const regex = new RegExp(
							`https?:\/\/(?:www\.)?${addr}\/`
						);

						return url.match(regex);
					})
				);

				if (lookup) {
					urlSpecsBuilder(lookup, url);
				} else {
					urlSpecsBuilder(
						{
							name: "other",
							icon: faLink,
							baseAddresses: [],
						},
						url
					);
				}
			});

			return Array.from(links.values());
		}, [urls]);

		return (
			<>
				{urlSpecs.map((spec, i) => (
					<ExternalLinksButton key={i} {...spec} />
				))}
			</>
		);
	};

	patch.instead(
		"ExternalLinkButtons",
		function (props: any, _: any, orig: any) {
			return <ExternalLinksButtons props={props} />;
		}
	);
})();
