import { useContext } from "react";
import { useStore } from "zustand";

import { gamePageViewModelContext } from "./gamePageSliceContexts";
import type {
	GamePageAudioSlice,
	GamePageCanvasSlice,
	GamePageHudSlice,
	GamePageInputSlice,
	GamePageLayoutSlice,
	GamePageMobileSheetSlice,
	GamePageTouchSlice,
	GamePageViewModel,
	GamePageVisualizerSlice,
} from "./types";

const useRequiredGamePageStore = (hookName: string) => {
	const contextValue = useContext(gamePageViewModelContext);

	if (contextValue === null) {
		throw new Error(
			`${hookName} must be used within GamePageViewModelProvider`,
		);
	}

	return contextValue;
};

const useGamePageSlice = <Slice>(
	selector: (state: GamePageViewModel) => Slice,
	hookName: string,
): Slice => {
	const gamePageStore = useRequiredGamePageStore(hookName);

	return useStore(gamePageStore, selector);
};

const selectGamePageAudioSlice = (
	state: GamePageViewModel,
): GamePageAudioSlice => state.audio;

const selectGamePageCanvasSlice = (
	state: GamePageViewModel,
): GamePageCanvasSlice => state.canvas;

const selectGamePageInputSlice = (
	state: GamePageViewModel,
): GamePageInputSlice => state.input;

const selectGamePageHudSlice = (state: GamePageViewModel): GamePageHudSlice =>
	state.hud;

const selectGamePageLayoutSlice = (
	state: GamePageViewModel,
): GamePageLayoutSlice => state.layout;

const selectGamePageMobileSheetSlice = (
	state: GamePageViewModel,
): GamePageMobileSheetSlice => state.mobileSheet;

const selectGamePageTouchSlice = (
	state: GamePageViewModel,
): GamePageTouchSlice => state.touch;

const selectGamePageVisualizerSlice = (
	state: GamePageViewModel,
): GamePageVisualizerSlice => state.visualizer;

export const useGamePageAudioContext = () =>
	useGamePageSlice(selectGamePageAudioSlice, "useGamePageAudioContext");

export const useGamePageCanvasContext = () =>
	useGamePageSlice(selectGamePageCanvasSlice, "useGamePageCanvasContext");

export const useGamePageInputContext = () =>
	useGamePageSlice(selectGamePageInputSlice, "useGamePageInputContext");

export const useGamePageHudContext = () =>
	useGamePageSlice(selectGamePageHudSlice, "useGamePageHudContext");

export const useGamePageLayoutContext = () =>
	useGamePageSlice(selectGamePageLayoutSlice, "useGamePageLayoutContext");

export const useGamePageMobileSheetContext = () =>
	useGamePageSlice(
		selectGamePageMobileSheetSlice,
		"useGamePageMobileSheetContext",
	);

export const useGamePageTouchContext = () =>
	useGamePageSlice(selectGamePageTouchSlice, "useGamePageTouchContext");

export const useGamePageVisualizerContext = () =>
	useGamePageSlice(
		selectGamePageVisualizerSlice,
		"useGamePageVisualizerContext",
	);
