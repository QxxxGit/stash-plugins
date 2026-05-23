import { React } from "../../../globals";

interface IUseInfiniteScrollProps {
	container?: React.RefObject<Element | null>;
	isLoading?: boolean;
	hasMore?: boolean;
	onLoadMore?: Function;
}

export const useInfiniteScroll = ({
	container,
	isLoading,
	hasMore,
	onLoadMore,
}: IUseInfiniteScrollProps) => {
	const ref = React.useRef<HTMLDivElement | null>(null);
	const loadingRef = React.useRef(false);

	React.useEffect(() => {
		const target = ref.current;

		if (!target) return;

		const observer = new IntersectionObserver(
			async (entries) => {
				const first = entries[0];

				if (!first.isIntersecting) return;
				if (!hasMore) return;
				if (loadingRef.current) return;

				loadingRef.current = true;

				try {
					await onLoadMore?.();
				} finally {
					loadingRef.current = false;
				}
			},
			{
				root: null,
				rootMargin: "300px",
			}
		);

		observer.observe(target);

		return () => {
			observer.disconnect();
		};
	}, [container, hasMore, isLoading, onLoadMore]);

	return ref;
};
