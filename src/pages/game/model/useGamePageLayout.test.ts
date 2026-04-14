// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useResponsiveGameLayout } from "@/features/responsive-layout";

import { useGamePageLayout } from "./useGamePageLayout";

afterEach(() => {
	document.body.style.overflow = "";
	document.body.style.overscrollBehavior = "";
	document.documentElement.style.overflow = "";
	document.documentElement.style.overscrollBehavior = "";
});

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

	it("applies scroll lock when isMobileTabletLandscape is true", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
			isMobileLayout: true,
			isPortrait: false,
			isTabletLayout: false,
		});

		renderHook(() => useGamePageLayout());

		expect(document.body.style.overflow).toBe("hidden");
		expect(document.body.style.overscrollBehavior).toBe("none");
		expect(document.documentElement.style.overflow).toBe("hidden");
		expect(document.documentElement.style.overscrollBehavior).toBe("none");
	});

	it("does not apply scroll lock when isMobileTabletLandscape is false", () => {
		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: true,
			isLandscape: true,
			isMobileLayout: false,
			isPortrait: false,
			isTabletLayout: false,
		});

		renderHook(() => useGamePageLayout());

		expect(document.body.style.overflow).toBe("");
		expect(document.body.style.overscrollBehavior).toBe("");
		expect(document.documentElement.style.overflow).toBe("");
		expect(document.documentElement.style.overscrollBehavior).toBe("");
	});

	it("restores previous overflow values on cleanup", () => {
		const previousBodyOverflow = "auto";
		const previousBodyOverscrollBehavior = "auto";
		const previousHtmlOverflow = "scroll";
		const previousHtmlOverscrollBehavior = "smooth";

		document.body.style.overflow = previousBodyOverflow;
		document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
		document.documentElement.style.overflow = previousHtmlOverflow;
		document.documentElement.style.overscrollBehavior =
			previousHtmlOverscrollBehavior;

		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
			isMobileLayout: true,
			isPortrait: false,
			isTabletLayout: false,
		});

		const { unmount } = renderHook(() => useGamePageLayout());

		expect(document.body.style.overflow).toBe("hidden");
		expect(document.body.style.overscrollBehavior).toBe("none");
		expect(document.documentElement.style.overflow).toBe("hidden");
		expect(document.documentElement.style.overscrollBehavior).toBe("none");

		unmount();

		expect(document.body.style.overflow).toBe(previousBodyOverflow);
		expect(document.body.style.overscrollBehavior).toBe(
			previousBodyOverscrollBehavior,
		);
		expect(document.documentElement.style.overflow).toBe(previousHtmlOverflow);
		expect(document.documentElement.style.overscrollBehavior).toBe(
			previousHtmlOverscrollBehavior,
		);
	});
});
