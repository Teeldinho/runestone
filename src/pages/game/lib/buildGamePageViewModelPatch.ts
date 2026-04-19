import type { GamePageViewModel } from "../model/types";

export const buildGamePageViewModelPatch = (
	prev: GamePageViewModel,
	next: GamePageViewModel,
): Partial<GamePageViewModel> | null => {
	throw new Error("not implemented");
};
