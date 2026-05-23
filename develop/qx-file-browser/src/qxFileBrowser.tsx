import { patch, register, React } from "./globals";
import FileBrowser from "./domain/files/components/FileBrowser";
import MainNavBarButton from "./domain/files/components/MainNavBarButton";

patch.instead("MainNavBar.MenuItems", (props: any, _: any, original: any) => {
	return (
		<div className="navbar-nav">
			{props.children}
			<MainNavBarButton />
		</div>
	);
});

register.route("/plugins/qx-file-browser", FileBrowser);
