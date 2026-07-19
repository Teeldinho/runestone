// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RESPONSIVE_LAYOUT_MEDIA_QUERIES } from "../config";

vi.mock("../lib", async (importOriginal) => {
	const original = await importOriginal<typeof import("../lib")>();

	return {
		...original,
		createResponsiveMediaQuerySubscriptions: () => [],
	};
});

import { useResponsiveGameLayout } from "./useResponsiveGameLayout";

describe("useResponsiveGameLayout initial state", () => {
	it("uses current desktop media queries before subscription effects run", () => {
		const mediaQueries = {
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT]: false,
		};

		vi.spyOn(window, "matchMedia").mockImplementation(
			(query) =>
				({
					matches: Boolean(mediaQueries[query as keyof typeof mediaQueries]),
				}) as MediaQueryList,
		);

		const { result } = renderHook(() => useResponsiveGameLayout());

		expect(result.current).toEqual({
			isDesktopLayout: true,
			isMobileLayout: false,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		});
	});
});
