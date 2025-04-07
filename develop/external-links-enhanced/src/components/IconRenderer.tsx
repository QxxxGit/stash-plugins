import { components, customAssetPath, IconType, React } from "../globals";

export const IconRenderer: React.FC<{
	icon: IconType;
}> = ({ icon }) => {
	const { Icon } = components;

	if (icon instanceof SVGElement) {
		return <span dangerouslySetInnerHTML={{ __html: icon.outerHTML }} />;
	}

	if (typeof icon === "string" && icon.includes(".")) {
		return <img src={`${customAssetPath}/${icon}`} />;
	}

	return <Icon icon={icon} />;
};
