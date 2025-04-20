import { GQL } from "../globals";
import { INotification, NotificationType } from "../types/INotification";
import IPackage from "../types/IPackage";

const getUpdateNotifications = (
	packages: IPackage[] | undefined,
	type: NotificationType
): INotification[] => {
	if (!packages) return [];

	return packages
		.filter(
			(pkg) =>
				pkg.source_package && pkg.version !== pkg.source_package.version
		)
		.map((pkg) => ({
			message: `${NotificationType[type]} ${pkg.name} can be updated to version ${pkg.source_package?.version}`,
			data: pkg,
			type,
		}));
};

export const usePackageUpdateChecking = () => {
	const plugins = GQL.useInstalledPluginPackagesStatusQuery();
	const scrapers = GQL.useInstalledScraperPackagesStatusQuery();

	const loading = plugins.loading || scrapers.loading;

	const pluginNotifications = getUpdateNotifications(
		plugins.data?.installedPackages as IPackage[] | undefined,
		NotificationType.Plugin
	);

	const scraperNotifications = getUpdateNotifications(
		scrapers.data?.installedPackages as IPackage[] | undefined,
		NotificationType.Scraper
	);

	return {
		loading,
		packages: [...pluginNotifications, ...scraperNotifications],
	};
};
