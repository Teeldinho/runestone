import { useCallback, useState } from "react";

import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import {
	type GamePageMobileSheetTabId,
	isGamePageMobileSheetTabId,
} from "../lib/isGamePageMobileSheetTabId";

type GamePageMobileSheetState = {
	isMobileSheetOpen: boolean;
	mobileSheetTabId: GamePageMobileSheetTabId;
	handleMobileSheetOpenChange: (isOpen: boolean) => void;
	handleMobileSheetTabChange: (tabId: string) => void;
};

export const useGamePageMobileSheetState = (): GamePageMobileSheetState => {
	const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
	const [mobileSheetTabId, setMobileSheetTabId] =
		useState<GamePageMobileSheetTabId>(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);

	const handleMobileSheetOpenChange = useCallback((isOpen: boolean) => {
		setIsMobileSheetOpen(isOpen);
	}, []);

	const handleMobileSheetTabChange = useCallback((tabId: string) => {
		if (!isGamePageMobileSheetTabId(tabId)) {
			return;
		}

		setMobileSheetTabId(tabId);
	}, []);

	return {
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		isMobileSheetOpen,
		mobileSheetTabId,
	};
};

export type { GamePageMobileSheetState, GamePageMobileSheetTabId };
