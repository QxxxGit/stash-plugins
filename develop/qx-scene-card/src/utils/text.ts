const stringToDate = (dateString: string) => {
	if (!dateString) return null;

	const parts = dateString.split("-");
	// Invalid date string
	if (parts.length !== 3) return null;

	const year = Number(parts[0]);
	const monthIndex = Math.max(0, Number(parts[1]) - 1);
	const day = Number(parts[2]);

	return new Date(year, monthIndex, day, 0, 0, 0, 0);
};

const getAge = (dateString?: string | null, fromDateString?: string | null) => {
	if (!dateString) return 0;

	const birthdate = stringToDate(dateString);
	const fromDate = fromDateString ? stringToDate(fromDateString) : new Date();

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
};

const TextUtils = {
	stringToDate,
	getAge,
};

export default TextUtils;
