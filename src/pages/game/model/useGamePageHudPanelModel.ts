import type { GamePageHudSlice } from "./types";
import { useGamePageHudContext } from "./useGamePageSliceContexts";

type GamePageHudPanelModel = GamePageHudSlice;

export const useGamePageHudPanelModel = (): GamePageHudPanelModel => {
	const hud = useGamePageHudContext();

	return hud;
};
