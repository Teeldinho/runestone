// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";

import { useGamePageMobileSheetState } from "./useGamePageMobileSheetState";

describe("useGamePageMobileSheetState", () => {
	it("tracks open state and ignores unknown tab values", () => {
		const { result } = renderHook(() => useGamePageMobileSheetState());

		expect(result.current.isMobileSheetOpen).toBe(false);
		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);

		act(() => {
			result.current.handleMobileSheetOpenChange(true);
			result.current.handleMobileSheetTabChange(
				GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD,
			);
		});

		expect(result.current.isMobileSheetOpen).toBe(true);
		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD,
		);

		act(() => {
			result.current.handleMobileSheetTabChange("unknown-tab");
		});

		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD,
		);
	});
});
