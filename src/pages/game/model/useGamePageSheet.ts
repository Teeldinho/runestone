import { useCallback, useState } from "react";
import { GAME_PAGE_MOBILE_SHEET } from "../config";
import type { GamePageMobileSheetTabId } from "./types";

export const useGamePageSheet = () => {
	const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
	const [mobileSheetTabId, setMobileSheetTabId] =
		useState<GamePageMobileSheetTabId>(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);

	const handleMobileSheetOpenChange = useCallback((isOpen: boolean) => {
		setIsMobileSheetOpen(isOpen);
	}, []);

	const handleMobileSheetTabChange = useCallback((tabId: string) => {
		if (
			tabId !== GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART &&
			tabId !== GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD
		) {
			return;
		}

		setMobileSheetTabId(tabId as GamePageMobileSheetTabId);
	}, []);

	return {
		isMobileSheetOpen,
		mobileSheetTabId,
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
	};
};
