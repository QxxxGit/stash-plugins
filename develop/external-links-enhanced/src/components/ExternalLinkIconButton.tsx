import { components, faLink, libraries, React, ReactDOM } from "../globals";
import { TextUtils } from "../utils/text";

type FontAwesomeIconDefinition = any;
type IconType = FontAwesomeIconDefinition | SVGElement;
type IExternalLinkProps = JSX.IntrinsicElements["a"];

const ExternalLink: React.FC<IExternalLinkProps> = (props) => {
	return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const ExternalLinkIconButton: React.FC<{
	icon?: IconType;
	urls: string[];
	className?: string;
}> = ({ icon = faLink, urls, className = "" }) => {
	if (!urls.length) return null;

	const { Button, Dropdown } = libraries.Bootstrap;
	const { Icon } = components;

	const Menu = () =>
		ReactDOM.createPortal(
			<Dropdown.Menu>
				{urls.map((url) => (
					<Dropdown.Item
						key={url}
						as={ExternalLink}
						href={TextUtils.sanitiseURL(url)}
						title={url}
					>
						{url}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>,
			document.body
		);

	const renderIcon = () => {
		if (icon instanceof SVGElement) {
			return (
				<span className="custom-definition" dangerouslySetInnerHTML={{ __html: icon.outerHTML }} />
			);
		}

		return <Icon icon={icon} />;
	};

	return (
		<Dropdown className="external-links-button">
			<Dropdown.Toggle
				as={Button}
				className={`minimal link ${className}`}
			>
				{renderIcon()}
			</Dropdown.Toggle>
			<Menu />
		</Dropdown>
	);
};

export default ExternalLinkIconButton;
