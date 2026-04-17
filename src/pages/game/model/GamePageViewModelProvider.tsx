import type { ReactNode } from "react";

import {
	gamePageAudioContext,
	gamePageCanvasContext,
	gamePageHudContext,
	gamePageLayoutContext,
	gamePageMobileSheetContext,
	gamePageTouchContext,
	gamePageVisualizerContext,
} from "./gamePageSliceContexts";
import { useGamePageSlices } from "./useGamePageSlices";

type GamePageViewModelProviderProps = {
	children: ReactNode;
};

export function GamePageViewModelProvider({
	children,
}: GamePageViewModelProviderProps) {
	const { audio, canvas, hud, layout, mobileSheet, touch, visualizer } =
		useGamePageSlices();

	return (
		<gamePageAudioContext.Provider value={audio}>
			<gamePageCanvasContext.Provider value={canvas}>
				<gamePageHudContext.Provider value={hud}>
					<gamePageLayoutContext.Provider value={layout}>
						<gamePageMobileSheetContext.Provider value={mobileSheet}>
							<gamePageTouchContext.Provider value={touch}>
								<gamePageVisualizerContext.Provider value={visualizer}>
									{children}
								</gamePageVisualizerContext.Provider>
							</gamePageTouchContext.Provider>
						</gamePageMobileSheetContext.Provider>
					</gamePageLayoutContext.Provider>
				</gamePageHudContext.Provider>
			</gamePageCanvasContext.Provider>
		</gamePageAudioContext.Provider>
	);
}
