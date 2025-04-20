import { React } from "../globals";
import { INotification } from "../types/INotification";

const NotificationContext = React.createContext({
	notifications: [] as INotification[],
	setNotifications: (n: INotification[]) => {},
});

interface INotificationProviderProps {
	children: React.ReactNode;
}

export const NotificationProvider = ({
	children,
}: INotificationProviderProps) => {
	const [notifications, setNotifications] = React.useState<INotification[]>(
		[]
	);

	return (
		<NotificationContext.Provider
			value={{ notifications, setNotifications }}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => React.useContext(NotificationContext);
