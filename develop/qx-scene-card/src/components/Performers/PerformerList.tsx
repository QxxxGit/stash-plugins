import { IPerformer } from "../../types/IPerformer";
import { React, libraries } from "../../globals";
import PerformerListLink from "./PerformerListLink";
import PerformerHoverPopover from "./PerformerHoverPopover";

export const PerformerList: React.FC<{
	performers?: IPerformer[];
}> = ({ performers }) => {
	if (!performers) return null;

	const containerRef = React.useRef<HTMLDivElement>(null);
	const moreRef = React.useRef<HTMLSpanElement>(null);
	const [visibleCount, setVisibleCount] = React.useState(performers.length);
	const { OverlayTrigger } = libraries.Bootstrap;

	React.useLayoutEffect(() => {
		if (!containerRef.current || !performers) return;

		const calculateVisible = () => {
			if (!containerRef.current || !performers) return;

			const containerWidth = containerRef.current.offsetWidth;
			const elements = Array.from(
				containerRef.current.children
			) as HTMLElement[];
			const moreWidth = moreRef.current?.offsetWidth || 10;

			let totalWidth = 0;
			let count = 0;

			for (const element of elements) {
				const elementWidth = element.offsetWidth;

				if (count < performers.length - 1) {
					if (
						totalWidth + elementWidth + moreWidth <=
						containerWidth
					) {
						totalWidth += elementWidth;
						count++;
					} else {
						break;
					}
				} else {
					if (totalWidth + elementWidth <= containerWidth) {
						totalWidth += elementWidth;
						count++;
					}
				}
			}

			setVisibleCount(count);
		};

		const resizeObserver = new ResizeObserver(() => calculateVisible());
		resizeObserver.observe(containerRef.current);

		calculateVisible();

		return () => resizeObserver.disconnect();
	}, [performers]);

	const hiddenCount = performers.length - visibleCount;

	const performerPopover = (performer: IPerformer, props: any) => {
		return (
			<PerformerHoverPopover
				performers={[performer]}
				key={performer.id}
				props={props}
			/>
		);
	};

	const showMorePerformersPopover = (props: any) => {
		if (hiddenCount === 0) return null;

		return (
			<PerformerHoverPopover
				performers={performers.slice(visibleCount)}
				props={props}
			/>
		);
	};

	return (
		<div className="performers">
			<div className="list" ref={containerRef}>
				{performers?.slice(0, visibleCount).map((p) => (
					<OverlayTrigger
						key={p.id}
						placement="bottom"
						trigger="hover"
						overlay={(props: any) => performerPopover(p, props)}>
						<span className="performer-name">
							<PerformerListLink performer={p} key={p.id} />
						</span>
					</OverlayTrigger>
				))}
			</div>
			{hiddenCount > 0 ? (
				<OverlayTrigger
					placement="bottom"
					trigger="click"
					overlay={(props: any) => showMorePerformersPopover(props)}
					rootClose>
					<span className="show-more" ref={moreRef}>
						+{hiddenCount}
					</span>
				</OverlayTrigger>
			) : (
				<span className="show-more" ref={moreRef}>
					{" "}
				</span>
			)}
		</div>
	);
};
