import { type ReactNode, useLayoutEffect, useState } from "react";

import { buildGamePageViewModelPatch } from "../lib/buildGamePageViewModelPatch";
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
		const prev = gamePageViewModelStore.getState();
		const patch = buildGamePageViewModelPatch(prev, gamePageViewModel);
		if (patch !== null) {
			gamePageViewModelStore.setState(patch);
		}
	}, [gamePageViewModel, gamePageViewModelStore]);

	return (
		<gamePageViewModelContext.Provider value={gamePageViewModelStore}>
			{children}
		</gamePageViewModelContext.Provider>
	);
}
