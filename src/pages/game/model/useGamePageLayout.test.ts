// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useResponsiveGameLayout } from "@/features/responsive-layout";

import { useGamePageLayout } from "./useGamePageLayout";

vi.mock("@/features/responsive-layout", () => ({
	useResponsiveGameLayout: vi.fn(),
}));

describe("useGamePageLayout", () => {
	it("returns responsive layout values", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
			isMobileLayout: false,
			isPortrait: false,
			isTabletLayout: false,
		});

		const { result } = renderHook(() => useGamePageLayout());

		expect(result.current.isDesktopLayout).toBe(true);
		expect(result.current.isTabletLayout).toBe(false);
		expect(result.current.isMobileTabletLandscape).toBe(false);
	});

	it("computes isMobileTabletLandscape correctly for mobile landscape", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
			isMobileLayout: true,
			isPortrait: false,
			isTabletLayout: false,
		});

		const { result } = renderHook(() => useGamePageLayout());

		expect(result.current.isDesktopLayout).toBe(false);
		expect(result.current.isTabletLayout).toBe(false);
		expect(result.current.isMobileTabletLandscape).toBe(true);
	});

	it("computes isMobileTabletLandscape correctly for tablet landscape", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
			isMobileLayout: false,
			isPortrait: false,
			isTabletLayout: true,
		});

		const { result } = renderHook(() => useGamePageLayout());

		expect(result.current.isDesktopLayout).toBe(false);
		expect(result.current.isTabletLayout).toBe(true);
		expect(result.current.isMobileTabletLandscape).toBe(true);
	});

	it("isMobileTabletLandscape is false for portrait mode", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: false,
			isMobileLayout: true,
			isPortrait: true,
			isTabletLayout: false,
		});

		const { result } = renderHook(() => useGamePageLayout());

		expect(result.current.isMobileTabletLandscape).toBe(false);
	});
});
