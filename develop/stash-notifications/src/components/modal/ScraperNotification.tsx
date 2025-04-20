import { libraries, React, utils } from "../../globals";
import { useNotifications } from "../../hooks/useNotifications";
import { INotification, NotificationType } from "../../types/INotification";
import IPackage from "../../types/IPackage";
import PackageModalBody from "./PackageModalBody";

const ScraperNotification: React.FC<{
	notification: INotification;
	onClose: () => void;
}> = ({ notification, onClose }) => {
	const pkg = notification.data as IPackage;
	const { Button, Modal } = libraries.Bootstrap;
	const { StashService } = utils;
	const { notifications, setNotifications } = useNotifications();

	const removeScraperNotifications = (packageIds: string[]) => {
		setNotifications(
			notifications.filter((n) => {
				const pkg = n.data as IPackage;
				return !packageIds.includes(pkg?.package_id);
			})
		);
	};

	const updateScraper = async () => {
		const vars = [{ id: pkg.package_id, sourceURL: pkg.sourceURL }];
		await StashService.mutateUpdateScraperPackages(vars);

		removeScraperNotifications([pkg.package_id]);
		onClose();
	};

	const updateAllScrapers = async () => {
		await StashService.mutateUpdateScraperPackages([]);

		// should update later to get the actual packages updated
		// in case of failed updates
		setNotifications(
			notifications.filter((n) => n.type !== NotificationType.Scraper)
		);

		onClose();
	};

	return (
		<>
			<Modal.Header closeButton>
				<Modal.Title>Update Scraper</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<PackageModalBody pkg={pkg} />
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={updateScraper}>
					Update Scraper
				</Button>
				<Button variant="primary" onClick={updateAllScrapers}>
					Update All Scrapers
				</Button>
				<Button variant="primary" onClick={onClose}>
					Cancel
				</Button>
			</Modal.Footer>
		</>
	);
};

export default ScraperNotification;
