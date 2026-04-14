import type { GAME_PAGE_MOBILE_SHEET } from "../config";

export type GamePageMobileSheetTabId =
	(typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS)[keyof typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS];
