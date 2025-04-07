import { React, ReactDOM, libraries } from "../globals";
import { TextUtils } from "../utils/text";

const ExternalLink: React.FC<JSX.IntrinsicElements["a"]> = (props) => (
	<a target="_blank" rel="noopener noreferrer" {...props} />
);

export const LinkDropdownMenu: React.FC<{
	urls: string[];
}> = ({ urls }) => {
	const { Dropdown } = libraries.Bootstrap;

	const menu = (
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
		</Dropdown.Menu>
	);

	return ReactDOM.createPortal(menu, document.body);
};
