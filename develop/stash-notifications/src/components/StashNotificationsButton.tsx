import { components, libraries, React } from "../globals";
import { useNotifications } from "../hooks/useNotifications";
import { usePackageUpdateChecking } from "../hooks/usePackageUpdateChecking";
import { NotificationDropdown } from "./NotificationDropdown";

const StashNotificationsButton = () => {
	const { Badge, Button, Dropdown } = libraries.Bootstrap;
	const { Icon } = components;
	const { faBell } = libraries.FontAwesomeSolid;

	const { notifications, setNotifications } = useNotifications();
	const { loading, packages } = usePackageUpdateChecking();
	const hasNotifications = !loading && notifications.length > 0;

	React.useEffect(() => {
		if (!loading && packages.length > 0) {
			setNotifications(packages);
		}
	}, [loading]);

	if (!hasNotifications) return null;

	return (
		<span className="notification-btn-container">
			<Dropdown>
				<Dropdown.Toggle
					as={Button}
					className="nav-utility minimal notification-btn"
				>
					<Icon icon={faBell} />
					{hasNotifications && (
						<Badge
							className="notification-badge"
							pill
							variant="danger"
						>
							{notifications.length}
						</Badge>
					)}
				</Dropdown.Toggle>
				<NotificationDropdown notifications={notifications} />
			</Dropdown>
		</span>
	);
};

export default StashNotificationsButton;
