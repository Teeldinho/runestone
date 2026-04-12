// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";
import { useResponsiveGameLayout } from "@/features/responsive-layout";

vi.mock("@/features/responsive-layout", () => ({
	useResponsiveGameLayout: vi.fn(),
}));

import { useFirstPersonLockHint } from "./useFirstPersonLockHint";

describe("useFirstPersonLockHint", () => {
	it("shows the hint in first-person until pointer lock is active", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: true,
			isMobileLayout: false,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		});

		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: null,
		});

		const { result } = renderHook(() =>
			useFirstPersonLockHint({ mode: CAMERA_MODES.FIRST_PERSON }),
		);

		expect(result.current).toBe(true);

		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: document.body,
		});

		act(() => {
			document.dispatchEvent(new Event("pointerlockchange"));
		});

		expect(result.current).toBe(false);
	});

	it("does not show the hint outside first-person mode", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: true,
			isMobileLayout: false,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		});

		const { result } = renderHook(() =>
			useFirstPersonLockHint({ mode: CAMERA_MODES.FREE_ORBITAL }),
		);

		expect(result.current).toBe(false);
	});

	it("does not show the hint on touch devices even in first-person without pointer lock", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: false,
			isMobileLayout: true,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		});

		Object.defineProperty(document, "pointerLockElement", {
			configurable: true,
			value: null,
		});

		const { result } = renderHook(() =>
			useFirstPersonLockHint({ mode: CAMERA_MODES.FIRST_PERSON }),
		);

		expect(result.current).toBe(false);
	});
});
