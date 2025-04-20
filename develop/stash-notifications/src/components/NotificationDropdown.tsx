import { React, libraries } from "../globals";
import { INotification, NotificationType } from "../types/INotification";
import PluginNotification from "./modal/PluginNotification";
import NotificationModal from "./modal/NotificationModal";
import ScraperNotification from "./modal/ScraperNotification";

export const NotificationDropdown: React.FC<{
	notifications: INotification[];
}> = ({ notifications }) => {
	const [display, setDisplay] = React.useState(false);
	const [activeNotification, setActiveNotification] =
		React.useState<INotification | null>(null);
	const { Dropdown } = libraries.Bootstrap;

	const onNotificationClick = (notification: INotification) => {
		setActiveNotification(notification);
		setDisplay(true);
	};

	const onClose = () => {
		setDisplay(false);
	};

	// Notification types are registered here
	const renderModal = () => {
		if (!activeNotification) return null;

		const modals: Partial<Record<NotificationType, React.ReactNode>> = {
			[NotificationType.Plugin]: (
				<PluginNotification
					notification={activeNotification}
					onClose={onClose}
				/>
			),
			[NotificationType.Scraper]: (
				<ScraperNotification
					notification={activeNotification}
					onClose={onClose}
				/>
			),
		};

		return modals[activeNotification.type] ?? activeNotification.message;
	};

	return (
		<>
			<Dropdown.Menu className="dropdown-menu-end">
				{notifications.map((n, i) => (
					<Dropdown.Item
						key={i}
						onClick={() => onNotificationClick(n)}
					>
						{n.message}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
			{activeNotification && (
				<NotificationModal
					display={display}
					onClose={onClose}
					content={renderModal()}
				/>
			)}
		</>
	);
};
