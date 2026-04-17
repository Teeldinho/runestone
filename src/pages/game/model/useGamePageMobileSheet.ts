import {
	type GamePageMobileSheetState,
	type GamePageMobileSheetTabId,
	useGamePageMobileSheetState,
} from "./useGamePageMobileSheetState";
import { useGamePageScrollLock } from "./useGamePageScrollLock";

type UseGamePageMobileSheetInput = {
	isMobileTabletLandscape: boolean;
};

type GamePageMobileSheetViewModel = GamePageMobileSheetState;

export const useGamePageMobileSheet = ({
	isMobileTabletLandscape,
}: UseGamePageMobileSheetInput): GamePageMobileSheetViewModel => {
	const mobileSheetState = useGamePageMobileSheetState();

	useGamePageScrollLock(isMobileTabletLandscape);

	return mobileSheetState;
};

export type {
	GamePageMobileSheetTabId,
	GamePageMobileSheetViewModel,
	UseGamePageMobileSheetInput,
};
