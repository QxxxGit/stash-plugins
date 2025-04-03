import { customAssetPath } from "../globals";

export const loadSvgIcon = async (file: any): Promise<SVGElement | null> => {
	const svg = await fetch(`${customAssetPath}/${file}`)
		.then((response) => response.text())
		.then((str) => {
			const domParser = new DOMParser();
			const doc = domParser.parseFromString(str, "image/svg+xml");
			const svgElement = doc.querySelector("svg");

			return svgElement;
		});

	return svg;
};