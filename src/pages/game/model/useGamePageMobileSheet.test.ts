// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";

import { useGamePageMobileSheet } from "./useGamePageMobileSheet";

describe("useGamePageMobileSheet", () => {
	it("tracks open state and validates tab changes", () => {
		const { result } = renderHook(() =>
			useGamePageMobileSheet({ isMobileTabletLandscape: false }),
		);

		expect(result.current.isMobileSheetOpen).toBe(false);
		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);

		act(() => {
			result.current.handleMobileSheetOpenChange(true);
		});
		expect(result.current.isMobileSheetOpen).toBe(true);

		act(() => {
			result.current.handleMobileSheetTabChange(
				GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD,
			);
		});
		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD,
		);

		act(() => {
			result.current.handleMobileSheetTabChange("invalid");
		});
		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD,
		);
	});

	it("locks scroll in mobile landscape mode and restores it on cleanup", () => {
		document.body.style.overflow = "auto";
		document.body.style.overscrollBehavior = "auto";
		document.documentElement.style.overflow = "auto";
		document.documentElement.style.overscrollBehavior = "auto";

		const { unmount } = renderHook(() =>
			useGamePageMobileSheet({ isMobileTabletLandscape: true }),
		);

		expect(document.body.style.overflow).toBe("hidden");
		expect(document.body.style.overscrollBehavior).toBe("none");
		expect(document.documentElement.style.overflow).toBe("hidden");
		expect(document.documentElement.style.overscrollBehavior).toBe("none");

		unmount();

		expect(document.body.style.overflow).toBe("auto");
		expect(document.body.style.overscrollBehavior).toBe("auto");
		expect(document.documentElement.style.overflow).toBe("auto");
		expect(document.documentElement.style.overscrollBehavior).toBe("auto");
	});
});
