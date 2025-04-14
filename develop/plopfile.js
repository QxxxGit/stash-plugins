export default function (plop) {
    plop.setGenerator('plugin', {
        description: 'create a new plugin for Stash',
        prompts: [
            {
                type: "input",
                name: "projectName",
                message: "enter the name of the plugin"
            },
            {
                type: "input",
                name: "description",
                message: "describe the plugin"
            },
            {
                type: "input",
                name: "component",
                message: "enter the exact name of the component to be patched"
            }
        ],
        actions: [
            {
                type: "addMany",
                destination: "{{dashCase projectName}}",
                base: ".template",
                templateFiles: ".template/**/*"
            }
        ]
    });
};