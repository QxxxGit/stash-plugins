import { DisplayModeType } from "../types/DisplayModeType";

const Parse = (value: string | null): DisplayModeType | undefined => {
	if (value === "grid" || value === "list") {
		return value;
	}

	return undefined;
};

export const DisplayModeUtils = {
	Parse,
};
