// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RESPONSIVE_LAYOUT_MEDIA_QUERIES } from "../config";

import { useResponsiveGameLayout } from "./useResponsiveGameLayout";

const createMockMediaQueryList = (matches: boolean) => ({
	matches,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
});

describe("useResponsiveGameLayout", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns responsive layout state from media queries", () => {
		const mediaQueries = {
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT]: true,
		};

		vi.spyOn(window, "matchMedia").mockImplementation((query) => {
			const matches = Boolean(mediaQueries[query as keyof typeof mediaQueries]);

			return createMockMediaQueryList(matches) as unknown as MediaQueryList;
		});

		const { result } = renderHook(() => useResponsiveGameLayout());

		expect(result.current).toEqual({
			isDesktopLayout: false,
			isMobileLayout: true,
			isTabletLayout: false,
			isLandscape: false,
			isPortrait: true,
		});
	});

	it("removes media query listeners when unmounted", () => {
		const mediaQueries = {
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT]: true,
		};

		const mediaQueryLists = new Map<
			string,
			ReturnType<typeof createMockMediaQueryList>
		>();

		vi.spyOn(window, "matchMedia").mockImplementation((query) => {
			const matches = Boolean(mediaQueries[query as keyof typeof mediaQueries]);
			const mediaQueryList = createMockMediaQueryList(matches);

			mediaQueryLists.set(query, mediaQueryList);

			return mediaQueryList as unknown as MediaQueryList;
		});

		const { unmount } = renderHook(() => useResponsiveGameLayout());

		unmount();

		for (const mediaQueryList of mediaQueryLists.values()) {
			const listener = mediaQueryList.addEventListener.mock.calls[0]?.[1];

			expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith(
				"change",
				listener,
			);
		}
	});
});
