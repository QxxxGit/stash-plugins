import { React } from "../../../globals";

export const ContextMenuItem: React.FC<{
	onClick?: () => void;
	children: React.ReactNode;
}> = ({ onClick, children }) => {
	return (
		<div className="menu-item" onClick={onClick}>
			{children}
		</div>
	);
};
