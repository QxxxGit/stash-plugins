import { SvgUtils } from "./svg";

const loadIcon = async (file: any) => {
	if (file! instanceof String) return null;

	if ((file as string).includes(".svg")) {
		return await SvgUtils.loadSvgIcon(file);
	}

	return file;
};

export const IconUtils = {
	loadIcon,
};
