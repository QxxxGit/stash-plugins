import { customAssetPath } from "../globals";

const loadSvgIcon = async (file: any): Promise<SVGElement | string | null> => {
	try {
		const svg = await fetch(`${customAssetPath}/${file}`, {
			cache: "no-store",
		})
			.then((response) => response.text())
			.then((str) => {
				const domParser = new DOMParser();
				const doc = domParser.parseFromString(str, "image/svg+xml");
				const svgElement = doc.querySelector("svg");

				return svgElement;
			});

		return svg;
	} catch (e) {
		console.error(`Error loading svg: ${file}, ${e}`);

		return null;
	}
};

export const SvgUtils = {
	loadSvgIcon,
};
