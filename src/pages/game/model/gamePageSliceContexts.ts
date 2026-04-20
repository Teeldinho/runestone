import { createContext } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";

import type { GamePageViewModel } from "./types";

type GamePageViewModelStore = StoreApi<GamePageViewModel>;

export const gamePageViewModelContext =
	createContext<GamePageViewModelStore | null>(null);

export const createGamePageViewModelStore = (
	viewModel: GamePageViewModel,
): GamePageViewModelStore => createStore<GamePageViewModel>()(() => viewModel);

export type { GamePageViewModelStore };
