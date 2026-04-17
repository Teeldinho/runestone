import { createContext } from "react";

import type {
	GamePageAudioSlice,
	GamePageCanvasSlice,
	GamePageHudSlice,
	GamePageLayoutSlice,
	GamePageMobileSheetSlice,
	GamePageTouchSlice,
	GamePageVisualizerSlice,
} from "./types";

export const gamePageAudioContext = createContext<GamePageAudioSlice | null>(
	null,
);

export const gamePageCanvasContext = createContext<GamePageCanvasSlice | null>(
	null,
);

export const gamePageHudContext = createContext<GamePageHudSlice | null>(null);

export const gamePageLayoutContext = createContext<GamePageLayoutSlice | null>(
	null,
);

export const gamePageMobileSheetContext =
	createContext<GamePageMobileSheetSlice | null>(null);

export const gamePageTouchContext = createContext<GamePageTouchSlice | null>(
	null,
);

export const gamePageVisualizerContext =
	createContext<GamePageVisualizerSlice | null>(null);
