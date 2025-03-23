function stringToDate(date: string) {
    if (!date) return null;

    const parts = date.split("-");
    // Invalid date string
    if (parts.length !== 3) return null;

    const year = Number(parts[0]);
    const monthIndex = Math.max(0, Number(parts[1]) - 1);
    const day = Number(parts[2]);

    return new Date(year, monthIndex, day, 0, 0, 0, 0);
};

export function maybeGetSceneTitle(title: string, files: any) {
    if(title) return title;

    if(files && files.length > 0) {
        var primaryFilePath = files[0].path;
        primaryFilePath = primaryFilePath.replace(/^.*[\\/]/, "");

        return primaryFilePath;
    }

    return "Scene not found";
}

function calculateAge(dateStr: string | undefined, fromDateStr: string | undefined) {
    if(!dateStr) return 0;

    const birthdate = stringToDate(dateStr);
    const fromDate = fromDateStr ? stringToDate(fromDateStr) : new Date();

    if (!birthdate || !fromDate) return 0;

    let age = fromDate.getFullYear() - birthdate.getFullYear();
    
    if (
        birthdate.getMonth() > fromDate.getMonth() ||
        (birthdate.getMonth() >= fromDate.getMonth() &&
            birthdate.getDate() > fromDate.getDate())
    ) {
        age -= 1;
    }

    return age;
}

const TextUtils = {
    maybeGetSceneTitle,
    calculateAge
}

export default TextUtils;