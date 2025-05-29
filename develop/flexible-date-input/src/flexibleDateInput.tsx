import { React, patch } from "./globals";
import DateInputHelper from "./components/DateInputHelper";

(function () {
	patch.after("DateInput", function (props: any, _: any, result: any) {
		return (
			<>
				{result}
				<DateInputHelper {...props} />
			</>
		);
	});
})();
