import { type ReactNode, useLayoutEffect, useState } from "react";

import {
	createGamePageViewModelStore,
	gamePageViewModelContext,
} from "./gamePageSliceContexts";
import { useGamePageSlices } from "./useGamePageSlices";

type GamePageViewModelProviderProps = {
	children: ReactNode;
};

export function GamePageViewModelProvider({
	children,
}: GamePageViewModelProviderProps) {
	const gamePageViewModel = useGamePageSlices();
	const [gamePageViewModelStore] = useState(() =>
		createGamePageViewModelStore(gamePageViewModel),
	);

	useLayoutEffect(() => {
		gamePageViewModelStore.setState(gamePageViewModel, true);
	}, [gamePageViewModel, gamePageViewModelStore]);

	return (
		<gamePageViewModelContext.Provider value={gamePageViewModelStore}>
			{children}
		</gamePageViewModelContext.Provider>
	);
}
