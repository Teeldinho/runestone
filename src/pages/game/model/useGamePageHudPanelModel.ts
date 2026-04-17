import type { GamePageViewModel } from "./types";
import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

type GamePageHudPanelModel = GamePageViewModel["hud"];

export const useGamePageHudPanelModel = (): GamePageHudPanelModel => {
	const { hud } = useGamePageViewModelContext();

	return hud;
};
