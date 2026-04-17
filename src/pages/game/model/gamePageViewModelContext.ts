import { createContext } from "react";

import type { GamePageViewModel } from "./useGamePage";

export const gamePageViewModelContext = createContext<GamePageViewModel | null>(
	null,
);
