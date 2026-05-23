// taken from Stash source

type Unit =
	| "byte"
	| "kibibyte"
	| "mebibyte"
	| "gibibyte"
	| "tebibyte"
	| "pebibyte";

const Units: Unit[] = [
	"byte",
	"kibibyte",
	"mebibyte",
	"gibibyte",
	"tebibyte",
	"pebibyte",
];

const shortUnits = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];

const FileSize = (bytes: number = 0) => {
	if (Number.isNaN(parseFloat(String(bytes))) || !Number.isFinite(bytes))
		return { size: 0, unit: Units[0] };

	let unit = 0;
	let count = bytes;
	// calculating base 2 units
	while (count >= 1024 && unit + 1 < Units.length) {
		count /= 1024;
		unit++;
	}

	return {
		size: count,
		unit: Units[unit],
	};
};

const FormatFileSizeUnit = (u: Unit) => {
	const i = Units.indexOf(u);
	return shortUnits[i];
};

// returns the number of fractional digits to use when displaying file sizes
// returns 0 for MB and under, 1 for GB and over.
const FileSizeFractionalDigits = (unit: Unit) => {
	if (Units.indexOf(unit) >= 3) {
		return 1;
	}

	return 0;
};

const GetExtensionFromPath = (path: string) => {
	const parts = path.split(".");
	if (parts.length < 2) return null;

	return parts.pop()!.toLowerCase();
};

export const FileUtils = {
	FileSize,
	FileSizeFractionalDigits,
	FormatFileSizeUnit,
	GetExtensionFromPath,
};
