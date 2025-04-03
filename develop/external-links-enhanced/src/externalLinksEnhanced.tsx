import { React, patch } from "./globals";
import ExternalLinkButtons from "./components/ExternalLinkButtons";

(function () {
	patch.instead(
		"ExternalLinkButtons",
		function (props: any, _: any, orig: any) {
			return <ExternalLinkButtons props={props} />;
		}
	);
})();
