import type { ReactNode } from "react";

import { gamePageViewModelContext } from "./gamePageViewModelContext";
import { useGamePage } from "./useGamePage";

type GamePageViewModelProviderProps = {
	children: ReactNode;
};

export function GamePageViewModelProvider({
	children,
}: GamePageViewModelProviderProps) {
	const gamePageViewModel = useGamePage();

	return (
		<gamePageViewModelContext.Provider value={gamePageViewModel}>
			{children}
		</gamePageViewModelContext.Provider>
	);
}
