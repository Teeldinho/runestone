// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GAME_PAGE_MOBILE_SHEET } from "../config";

import { useGamePageSheet } from "./useGamePageSheet";

describe("useGamePageSheet", () => {
	it("initializes with default tab state", () => {
		const { result } = renderHook(() => useGamePageSheet());

		expect(result.current.isMobileSheetOpen).toBe(false);
		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART,
		);
	});

	it("opens and closes the mobile sheet", () => {
		const { result } = renderHook(() => useGamePageSheet());

		expect(result.current.isMobileSheetOpen).toBe(false);

		act(() => {
			result.current.handleMobileSheetOpenChange(true);
		});

		expect(result.current.isMobileSheetOpen).toBe(true);
	});

	it("changes mobile sheet tab", () => {
		const { result } = renderHook(() => useGamePageSheet());

		act(() => {
			result.current.handleMobileSheetTabChange(
				GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD,
			);
		});

		expect(result.current.mobileSheetTabId).toBe(
			GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD,
		);
	});

	it("ignores invalid tab changes", () => {
		const { result } = renderHook(() => useGamePageSheet());

		const initialTabId = result.current.mobileSheetTabId;

		act(() => {
			result.current.handleMobileSheetTabChange("invalid-tab" as never);
		});

		expect(result.current.mobileSheetTabId).toBe(initialTabId);
	});
});
