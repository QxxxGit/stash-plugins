import { React } from "../globals";

const SceneDateContext = React.createContext({
	date: {} as string | undefined,
});

interface ISceneProviderProps {
	date: string | undefined;
	children: React.ReactNode;
}

export const SceneDateProvider = ({ date, children }: ISceneProviderProps) => {
	return (
		<SceneDateContext.Provider value={{ date }}>
			{children}
		</SceneDateContext.Provider>
	);
};

export const useSceneDate = () => React.useContext(SceneDateContext);
