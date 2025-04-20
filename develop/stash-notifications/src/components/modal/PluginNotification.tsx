import { libraries, React, utils } from "../../globals";
import { useNotifications } from "../../hooks/useNotifications";
import { INotification, NotificationType } from "../../types/INotification";
import IPackage from "../../types/IPackage";
import PackageModalBody from "./PackageModalBody";

const PluginNotification: React.FC<{
	notification: INotification;
	onClose: () => void;
}> = ({ notification, onClose }) => {
	const pkg = notification.data as IPackage;
	const { Button, Modal } = libraries.Bootstrap;
	const { StashService } = utils;
	const { notifications, setNotifications } = useNotifications();

	const removePluginNotifications = (packageIds: string[]) => {
		setNotifications(
			notifications.filter((n) => {
				const pkg = n.data as IPackage;
				return !packageIds.includes(pkg?.package_id);
			})
		);
	};

	const updatePlugin = async () => {
		const vars = [{ id: pkg.package_id, sourceURL: pkg.sourceURL }];
		await StashService.mutateUpdatePluginPackages(vars);

		removePluginNotifications([pkg.package_id]);
		onClose();
	};

	const updateAllPlugins = async () => {
		await StashService.mutateUpdatePluginPackages([]);

		// should update later to get the actual packages updated
		// in case of failed updates
		setNotifications(
			notifications.filter((n) => n.type !== NotificationType.Plugin)
		);

		onClose();
	};

	return (
		<>
			<Modal.Header closeButton>
				<Modal.Title>Update Plugin</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<PackageModalBody pkg={pkg} />
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={updatePlugin}>
					Update Plugin
				</Button>
				<Button variant="primary" onClick={updateAllPlugins}>
					Update All Plugins
				</Button>
				<Button variant="primary" onClick={onClose}>
					Cancel
				</Button>
			</Modal.Footer>
		</>
	);
};

export default PluginNotification;
