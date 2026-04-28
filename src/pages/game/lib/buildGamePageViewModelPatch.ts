import type { GamePageViewModel } from "../model/types";

export const buildGamePageViewModelPatch = (
	prev: GamePageViewModel,
	next: GamePageViewModel,
): Partial<GamePageViewModel> | null => {
	const patch: Partial<GamePageViewModel> = {};
	let hasChange = false;

	for (const key of Object.keys(next) as Array<keyof GamePageViewModel>) {
		if (prev[key] !== next[key]) {
			(patch as Record<string, unknown>)[key] = next[key];
			hasChange = true;
		}
	}

	return hasChange ? patch : null;
};
