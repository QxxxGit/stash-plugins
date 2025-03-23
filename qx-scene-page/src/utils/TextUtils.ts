export function maybeGetSceneTitle(title: string, files: any) {
    if(title) return title;

    if(files && files.length > 0) {
        var primaryFilePath = files[0].path;
        primaryFilePath = primaryFilePath.replace(/^.*[\\/]/, "");

        return primaryFilePath;
    }

    return "Scene not found";
}