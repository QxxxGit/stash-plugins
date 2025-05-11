import { React, patch } from "./globals";
import SceneCardDetails from "./components/SceneCardDetails";

patch.instead("SceneCard.Details", function (props: any, _: any, __: any) {
	return <SceneCardDetails props={props} />;
});
