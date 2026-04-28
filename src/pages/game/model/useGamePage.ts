import type { GamePageViewModel } from "./types";
import { useGamePageSlices } from "./useGamePageSlices";

export const useGamePage = (): GamePageViewModel => useGamePageSlices();
