import { React } from "../../../globals";

export interface ContextMenuPosition {
	x: number;
	y: number;
}

export interface ContextMenuState<T> extends ContextMenuPosition {
	data: T;
}

export const useContextMenu = <T,>() => {
	const [contextMenu, setContextMenu] =
		React.useState<ContextMenuState<T> | null>(null);

	const openContextMenu = (e: React.MouseEvent, data: T) => {
		e.preventDefault();

		setContextMenu({
			x: e.clientX,
			y: e.clientY,
			data,
		});
	};

	const closeContextMenu = () => {
		setContextMenu(null);
	};

	React.useEffect(() => {
		window.addEventListener("click", closeContextMenu);

		return () => {
			window.removeEventListener("click", closeContextMenu);
		};
	}, []);

	return {
		contextMenu,
		openContextMenu,
		closeContextMenu,
	};
};
