import { createContext } from "react";

import type { GamePageViewModel } from "./types";

export const gamePageViewModelContext = createContext<GamePageViewModel | null>(
	null,
);
