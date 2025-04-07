import { faLink, IconType, libraries, React } from "../globals";
import { IconRenderer } from "./IconRenderer";
import { LinkDropdownMenu } from "./LinkDropdownMenu";

const ExternalLinkIconButton: React.FC<{
	icon?: IconType;
	urls: string[];
	className?: string;
}> = ({ icon = faLink, urls, className = "" }) => {
	if (!urls.length) return null;

	const { Button, Dropdown } = libraries.Bootstrap;

	return (
		<Dropdown className="external-links-button">
			<Dropdown.Toggle
				as={Button}
				className={`minimal link ${className}`}
			>
				<IconRenderer icon={icon} />
			</Dropdown.Toggle>
			<LinkDropdownMenu urls={urls} />
		</Dropdown>
	);
};

export default ExternalLinkIconButton;
