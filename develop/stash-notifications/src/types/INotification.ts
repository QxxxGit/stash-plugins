export enum NotificationType {
	Plugin,
	Scraper,
}

export interface INotification {
	type: NotificationType;
	message: string;
	data: any;
}
