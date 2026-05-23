import { components, React } from "../../../globals";
import { URLParamsProvider } from "../../url/providers/URLParamsProvider";
import { useStashes } from "../hooks/useStashes";
import MainWindow from "./MainWindow";
import SideBar from "./SideBar/SideBar";

const SidebarWidth = {
	min: 250,
	max: 500,
};

const FileBrowser = () => {
	const { LoadingIndicator } = components;
	const [sideBarWidth, setSideBarWidth] = React.useState(SidebarWidth.min);
	const [isDraggingDivider, setIsDraggingDivider] = React.useState(false);
	const { data, loading, error } = useStashes();
	const containerRef = React.useRef<HTMLDivElement>(null);

	if (loading) {
		return <LoadingIndicator />;
	}

	if (error.length > 0) {
		console.error(error);

		return (
			<div>
				Error getting stashes. Check console for more information.
			</div>
		);
	}

	// this is currently broken
	const handleMousePosition = (e: any) => {
		if (!isDraggingDivider || !containerRef?.current) return;

		const bounds = containerRef.current.getBoundingClientRect();
		const x = e.clientX - bounds.left;
		const width = Math.max(SidebarWidth.min, Math.min(x, SidebarWidth.max));

		setSideBarWidth(width);
	};

	const handleMouseClickRelease = () => setIsDraggingDivider(false);

	return (
		<URLParamsProvider>
			<div
				id="qx-file-browser"
				onMouseMove={handleMousePosition}
				onMouseUp={handleMouseClickRelease}>
				<SideBar width={sideBarWidth} stashes={data} />
				<div
					className="divider"
					onMouseDown={() => setIsDraggingDivider(true)}
				/>
				<MainWindow />
			</div>
		</URLParamsProvider>
	);
};

export default FileBrowser;
