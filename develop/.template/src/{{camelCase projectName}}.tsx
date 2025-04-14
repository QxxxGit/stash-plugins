import { React, patch } from "./globals";
import {{pascalCase component}} from "./components/{{pascalCase component}}";

(function () {
    patch.instead(
        "{{pascalCase component}}",
        function (props: any, _: any, orig: any) {
            return <{{pascalCase component}} props={props} />
        }
    )
})