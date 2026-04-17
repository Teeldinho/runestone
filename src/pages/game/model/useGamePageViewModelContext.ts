import { useContext } from "react";

import { gamePageViewModelContext } from "./gamePageViewModelContext";
import type { GamePageViewModel } from "./useGamePage";

const GAME_PAGE_VIEW_MODEL_CONTEXT_ERROR =
	"useGamePageViewModelContext must be used within GamePageViewModelProvider";

export const useGamePageViewModelContext = (): GamePageViewModel => {
	const gamePageViewModel = useContext(gamePageViewModelContext);

	if (gamePageViewModel === null) {
		throw new Error(GAME_PAGE_VIEW_MODEL_CONTEXT_ERROR);
	}

	return gamePageViewModel;
};
