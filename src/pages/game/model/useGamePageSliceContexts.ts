import { type Context, useContext } from "react";

import {
	gamePageAudioContext,
	gamePageCanvasContext,
	gamePageHudContext,
	gamePageLayoutContext,
	gamePageMobileSheetContext,
	gamePageTouchContext,
	gamePageVisualizerContext,
} from "./gamePageSliceContexts";

const useRequiredGamePageContext = <T>(
	context: Context<T | null>,
	hookName: string,
): T => {
	const contextValue = useContext(context);

	if (contextValue === null) {
		throw new Error(
			`${hookName} must be used within GamePageViewModelProvider`,
		);
	}

	return contextValue;
};

export const useGamePageAudioContext = () =>
	useRequiredGamePageContext(gamePageAudioContext, "useGamePageAudioContext");

export const useGamePageCanvasContext = () =>
	useRequiredGamePageContext(gamePageCanvasContext, "useGamePageCanvasContext");

export const useGamePageHudContext = () =>
	useRequiredGamePageContext(gamePageHudContext, "useGamePageHudContext");

export const useGamePageLayoutContext = () =>
	useRequiredGamePageContext(gamePageLayoutContext, "useGamePageLayoutContext");

export const useGamePageMobileSheetContext = () =>
	useRequiredGamePageContext(
		gamePageMobileSheetContext,
		"useGamePageMobileSheetContext",
	);

export const useGamePageTouchContext = () =>
	useRequiredGamePageContext(gamePageTouchContext, "useGamePageTouchContext");

export const useGamePageVisualizerContext = () =>
	useRequiredGamePageContext(
		gamePageVisualizerContext,
		"useGamePageVisualizerContext",
	);
