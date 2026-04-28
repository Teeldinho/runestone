import { useEffect } from "react";

import { GAME_PAGE_SCROLL_LOCK } from "@/pages/game/config";

export const useGamePageScrollLock = (isEnabled: boolean) => {
	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		const previousBodyOverflow = document.body.style.overflow;
		const previousBodyOverscrollBehavior =
			document.body.style.overscrollBehavior;
		const previousHtmlOverflow = document.documentElement.style.overflow;
		const previousHtmlOverscrollBehavior =
			document.documentElement.style.overscrollBehavior;

		document.body.style.overflow = GAME_PAGE_SCROLL_LOCK.OVERFLOW_LOCKED;
		document.body.style.overscrollBehavior =
			GAME_PAGE_SCROLL_LOCK.OVERSCROLL_BEHAVIOR_LOCKED;
		document.documentElement.style.overflow =
			GAME_PAGE_SCROLL_LOCK.OVERFLOW_LOCKED;
		document.documentElement.style.overscrollBehavior =
			GAME_PAGE_SCROLL_LOCK.OVERSCROLL_BEHAVIOR_LOCKED;

		return () => {
			document.body.style.overflow = previousBodyOverflow;
			document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
			document.documentElement.style.overflow = previousHtmlOverflow;
			document.documentElement.style.overscrollBehavior =
				previousHtmlOverscrollBehavior;
		};
	}, [isEnabled]);
};
