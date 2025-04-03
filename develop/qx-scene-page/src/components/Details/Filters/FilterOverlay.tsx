import {
	FormattedMessage,
	libraries,
	React,
	VIDEO_PLAYER_ID,
} from "../../../globals";
import { ISceneFilters } from "../../../types/ISceneFilter";
import Slider from "./Slider";

const FilterOverlay: React.FC<{
	props: any;
	filters: ISceneFilters;
	onUpdate: (filter: ISceneFilters) => void
}> = ({ 
	props,
	filters,
	onUpdate
}) => {
	const popoverRef = React.useRef(null);
	const { Popover } = libraries.Bootstrap;

	// const [contrastValue, setContrastValue] = React.useState(
	// 	contrastRange.default
	// );

	// const [gammaValue, setGammaValue] = React.useState(gammaRange.default);
	// const [rotateValue, setRotateValue] = React.useState(rotateRange.default);
	// const [scaleValue, setScaleValue] = React.useState(scaleRange.default);
	// const [aspectRatioValue, setAspectRatioValue] = React.useState(
	// 	aspectRatioRange.default
	// );
	// const [xposValue, setXPosValue] = React.useState(xposRange.default);
	// const [yposValue, setYPosValue] = React.useState(yposRange.default);

	function getVideoElement(playerVideoContainer: any) {
		let videoElements = playerVideoContainer.getElementsByTagName("canvas");

		if (videoElements.length == 0) {
			videoElements = playerVideoContainer.getElementsByTagName("video");
		}

		if (videoElements.length > 0) {
			return videoElements[0];
		}
	}

	function updateVideoStyle() {
		const playerVideoContainer = document.getElementById(VIDEO_PLAYER_ID)!;
		if (!playerVideoContainer) {
			return;
		}

		const playerVideoElement = getVideoElement(playerVideoContainer);
		if (playerVideoElement != null) {
			let styleString = "filter:";
			let style = playerVideoElement.attributes.getNamedItem("style");

			if (style == null) {
				style = document.createAttribute("style");
				playerVideoElement.attributes.setNamedItem(style);
			}

			// if (gammaValue !== gammaRange.default) {
			// 	styleString += " url(#videoFilter)";
			// }

			if (filters.brightness.value !== filters.brightness.slider.default) {
				styleString += ` brightness(${filters.brightness.value}%)`;
			}

			// if (contrastValue !== contrastRange.default) {
			// 	styleString += ` contrast(${contrastValue}%)`;
			// }

			styleString += "; transform: ";

			// if (rotateValue !== rotateRange.default) {
			// 	styleString += ` rotate(${
			// 		(rotateValue - rotateRange.default) / rotateRange.divider
			// 	}deg)`;
			// }

			// if (
			// 	scaleValue !== scaleRange.default ||
			// 	aspectRatioValue !== aspectRatioRange.default
			// ) {
			// 	let xScale = scaleValue / scaleRange.divider / 100.0;
			// 	let yScale = scaleValue / scaleRange.divider / 100.0;

			// 	if (aspectRatioValue > aspectRatioRange.default) {
			// 		xScale *=
			// 			(aspectRatioRange.divider +
			// 				aspectRatioValue -
			// 				aspectRatioRange.default) /
			// 			aspectRatioRange.divider;
			// 	} else if (aspectRatioValue < aspectRatioRange.default) {
			// 		yScale *=
			// 			(aspectRatioRange.divider +
			// 				aspectRatioRange.default -
			// 				aspectRatioValue) /
			// 			aspectRatioRange.divider;
			// 	}

			// 	styleString += ` scale(${xScale},${yScale});`;
			// }

			if (playerVideoElement.tagName == "CANVAS") {
				styleString +=
					"; width: 100%; height: 100%; position: absolute;";
			}

			// if (xposValue !== xposRange.default) {
			// 	styleString += `left: ${xposValue}%;`;
			// }

			// if (yposValue !== yposRange.default) {
			// 	styleString += `top: ${yposValue}%`;
			// }

			style.value = `${styleString};`;
		}
	}

	// function updateVideoFilters() {
	// 	const filterContainer = document.getElementById(
	// 		"video-filter-container"
	// 	);

	// 	if (filterContainer == null) {
	// 		return;
	// 	}

	// 	const svg1 = document.createElementNS(
	// 		"http://www.w3.org/2000/svg",
	// 		"svg"
	// 	);
	// 	const videoFilter = document.createElementNS(
	// 		"http://www.w3.org/2000/svg",
	// 		"filter"
	// 	);

	// 	videoFilter.setAttribute("id", "videoFilter");

	// 	if (gammaValue !== gammaRange.default) {
	// 		const feComponentTransfer = document.createElementNS(
	// 			"http://www.w3.org/2000/svg",
	// 			"feComponentTransfer"
	// 		);

	// 		const feFuncR = document.createElementNS(
	// 			"http://www.w3.org/2000/svg",
	// 			"feFuncR"
	// 		);

	// 		feFuncR.setAttribute("type", "gamma");
	// 		feFuncR.setAttribute("amplitude", "1.0");
	// 		feFuncR.setAttribute(
	// 			"exponent",
	// 			`${1 + (gammaRange.default - gammaValue) / gammaRange.divider}`
	// 		);
	// 		feFuncR.setAttribute("offset", "0.0");

	// 		feComponentTransfer.appendChild(feFuncR);

	// 		const feFuncG = document.createElementNS(
	// 			"http://www.w3.org/2000/svg",
	// 			"feFuncG"
	// 		);

	// 		feFuncG.setAttribute("type", "gamma");
	// 		feFuncG.setAttribute("amplitude", "1.0");
	// 		feFuncG.setAttribute(
	// 			"exponent",
	// 			`${1 + (gammaRange.default - gammaValue) / gammaRange.divider}`
	// 		);
	// 		feFuncG.setAttribute("offset", "0.0");

	// 		feComponentTransfer.appendChild(feFuncG);

	// 		const feFuncB = document.createElementNS(
	// 			"http://www.w3.org/2000/svg",
	// 			"feFuncB"
	// 		);

	// 		feFuncB.setAttribute("type", "gamma");
	// 		feFuncB.setAttribute("amplitude", "1.0");
	// 		feFuncB.setAttribute(
	// 			"exponent",
	// 			`${1 + (gammaRange.default - gammaValue) / gammaRange.divider}`
	// 		);
	// 		feFuncB.setAttribute("offset", "0.0");

	// 		feComponentTransfer.appendChild(feFuncB);

	// 		const feFuncA = document.createElementNS(
	// 			"http://www.w3.org/2000/svg",
	// 			"feFuncA"
	// 		);

	// 		feFuncA.setAttribute("type", "gamma");
	// 		feFuncA.setAttribute("amplitude", "1.0");
	// 		feFuncA.setAttribute("exponent", "1.0");
	// 		feFuncA.setAttribute("offset", "0.0");

	// 		feComponentTransfer.appendChild(feFuncA);

	// 		videoFilter.appendChild(feComponentTransfer);
	// 	}

	// 	svg1.appendChild(videoFilter);

	// 	// Add or Replace existing svg
	// 	const filterContainerSvgs = filterContainer.getElementsByTagNameNS(
	// 		"http://www.w3.org/2000/svg",
	// 		"svg"
	// 	);
	// 	if (filterContainerSvgs.length === 0) {
	// 		// attach container to document
	// 		filterContainer.appendChild(svg1);
	// 	} else {
	// 		// assume only one svg... maybe issue
	// 		filterContainer.replaceChild(svg1, filterContainerSvgs[0]);
	// 	}
	// }

	function renderFilterContainer() {
		return <div id="video-filter-container" />;
	}

	// updateVideoFilters();
	updateVideoStyle();

	return (
		<div ref={popoverRef}>
			<Popover id="popover-trigger-click-root-close" {...props}>
				<div className="filter-overlay">
					<h5>
						<FormattedMessage id="effect_filters.name" />
					</h5>
					<Slider
						title="Brightness"
						className="brightness-slider"
						filter={filters.brightness}
						setValue={onUpdate}
						displayValue={`${brightnessValue / filters.brightness.slider.divider}%`}
					/>
					{/* <Slider
						title="Contrast"
						className="contrast-slider"
						range={contrastRange}
						value={contrastValue}
						setValue={setContrastValue}
						displayValue={`${contrastValue / contrastRange.divider}%`}
					/>
					<Slider
						title="Gamma"
						className="gamma-slider"
						range={gammaRange}
						value={gammaValue}
						setValue={setGammaValue}
						displayValue={`${gammaValue / gammaRange.divider}%`}
					/>
					<h5>
						<FormattedMessage id="effect_filters.name_transforms" />
					</h5>
					<Slider
						title="Rotate"
						className="rotate-slider"
						range={rotateRange}
						value={rotateValue}
						setValue={setRotateValue}
						displayValue={`${rotateValue / rotateRange.divider}%`}
					/>
					<Slider
						title="Scale"
						className="scale-slider"
						range={scaleRange}
						value={scaleValue}
						setValue={setScaleValue}
						displayValue={`${scaleValue / scaleRange.divider}%`}
					/>
					<Slider
						title="Aspect"
						className="aspect-slider"
						range={aspectRatioRange}
						value={aspectRatioValue}
						setValue={setAspectRatioValue}
						displayValue={`${aspectRatioValue / aspectRatioRange.divider}%`}
					/>
					<h5>Position</h5>
					<Slider
						title="X"
						className="xpos-slider"
						range={xposRange}
						value={xposValue}
						setValue={setXPosValue}
						displayValue={`${xposValue / xposRange.divider}%`}
					/>
					<Slider
						title="Y"
						className="ypos-slider"
						range={yposRange}
						value={yposValue}
						setValue={setYPosValue}
						displayValue={`${yposValue / yposRange.divider}%`}
					/> */}
				</div>
			</Popover>
			{renderFilterContainer()}
		</div>
	);
};

export default FilterOverlay;
