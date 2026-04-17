import { useCallback, useEffect, useState } from "react";

import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";

type GamePageMobileSheetTabId =
	(typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS)[keyof typeof GAME_PAGE_MOBILE_SHEET.TAB_IDS];

type UseGamePageMobileSheetInput = {
	isMobileTabletLandscape: boolean;
};

type GamePageMobileSheetViewModel = {
	isMobileSheetOpen: boolean;
	mobileSheetTabId: GamePageMobileSheetTabId;
	handleMobileSheetOpenChange: (isOpen: boolean) => void;
	handleMobileSheetTabChange: (tabId: string) => void;
};

const isMobileSheetTabId = (
	tabId: string,
): tabId is GamePageMobileSheetTabId => {
	return (
		tabId === GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART ||
		tabId === GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD
	);
};

export const useGamePageMobileSheet = ({
	isMobileTabletLandscape,
}: UseGamePageMobileSheetInput): GamePageMobileSheetViewModel => {
	const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
	const [mobileSheetTabId, setMobileSheetTabId] =
		useState<GamePageMobileSheetTabId>(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);

	const handleMobileSheetOpenChange = useCallback((isOpen: boolean) => {
		setIsMobileSheetOpen(isOpen);
	}, []);

	const handleMobileSheetTabChange = useCallback((tabId: string) => {
		if (!isMobileSheetTabId(tabId)) {
			return;
		}

		setMobileSheetTabId(tabId);
	}, []);

	useEffect(() => {
		if (!isMobileTabletLandscape) {
			return;
		}

		const previousBodyOverflow = document.body.style.overflow;
		const previousBodyOverscrollBehavior =
			document.body.style.overscrollBehavior;
		const previousHtmlOverflow = document.documentElement.style.overflow;
		const previousHtmlOverscrollBehavior =
			document.documentElement.style.overscrollBehavior;

		document.body.style.overflow = "hidden";
		document.body.style.overscrollBehavior = "none";
		document.documentElement.style.overflow = "hidden";
		document.documentElement.style.overscrollBehavior = "none";

		return () => {
			document.body.style.overflow = previousBodyOverflow;
			document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
			document.documentElement.style.overflow = previousHtmlOverflow;
			document.documentElement.style.overscrollBehavior =
				previousHtmlOverscrollBehavior;
		};
	}, [isMobileTabletLandscape]);

	return {
		isMobileSheetOpen,
		mobileSheetTabId,
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
	};
};

export type {
	GamePageMobileSheetTabId,
	GamePageMobileSheetViewModel,
	UseGamePageMobileSheetInput,
};
