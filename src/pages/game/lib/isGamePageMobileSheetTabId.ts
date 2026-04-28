import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";

type GamePageMobileSheetTabId =
	(typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS)[keyof typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS];

export const isGamePageMobileSheetTabId = (
	tabId: string,
): tabId is GamePageMobileSheetTabId => {
	return (
		tabId === GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART ||
		tabId === GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD
	);
};

export type { GamePageMobileSheetTabId };
