import { React, patch } from "./globals";
import { NotificationProvider } from "./hooks/useNotifications";
import StashNotificationsButton from "./components/StashNotificationsButton";

(function () {
	patch.before("MainNavBar.UtilityItems", function (props: any) {
		return [
			{
				children: (
					<>
						<NotificationProvider>
							<StashNotificationsButton />
						</NotificationProvider>
						{props.children}
					</>
				),
			},
		];
	});
})();
