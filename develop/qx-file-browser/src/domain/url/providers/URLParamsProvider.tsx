import { libraries, React } from "../../../globals";
import { DEFAULT_VIRTUAL_FOLDER } from "../../files/types/VirtualFolders";
import { DisplayModeUtils } from "../../files/utils/DisplayModeUtils";
import { FolderUtils } from "../../files/utils/FolderUtils";
import { IFileBrowserURLParams } from "../models/IFileBrowserURLParams";

const URLParamsContext = React.createContext<{
	params: IFileBrowserURLParams;
	setParam: (key: keyof IFileBrowserURLParams, value?: string) => void;
} | null>(null);

export const URLParamsProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const location = libraries.ReactRouterDOM.useLocation();
	const history = libraries.ReactRouterDOM.useHistory();

	const searchParams = React.useMemo(
		() => new URLSearchParams(location.search),
		[location.search]
	);

	const params: IFileBrowserURLParams = {
		folder: FolderUtils.ParseFolderId(searchParams.get("folder")),
		display: DisplayModeUtils.Parse(searchParams.get("display")),
		query: searchParams.get("search") ?? undefined,
	};

	React.useEffect(() => {
		if (!searchParams.get("folder")) {
			const next = new URLSearchParams(location.search);
			next.set("folder", DEFAULT_VIRTUAL_FOLDER);

			history.replace({
				...location,
				search: next.toString(),
			});
		}
	}, [location, history, searchParams]);

	const setParam = (key: keyof IFileBrowserURLParams, value?: string) => {
		const next = new URLSearchParams(location.search);

		if (!value) next.delete(key);
		else next.set(key, value);

		history.push({
			...location,
			search: next.toString(),
		});
	};

	return (
		<URLParamsContext.Provider value={{ params, setParam }}>
			{children}
		</URLParamsContext.Provider>
	);
};

export const useURLParams = () => {
	const context = React.useContext(URLParamsContext);

	if (!context)
		throw new Error(
			"Issue using URLParamsContext, make sure it's within provider"
		);

	return context;
};
