// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RESPONSIVE_LAYOUT_MEDIA_QUERIES } from "../config";

import { useResponsiveGameLayout } from "./useResponsiveGameLayout";

const mockUseMediaQuery = vi.fn();

vi.mock("react-responsive", () => ({
	useMediaQuery: (options: { query?: string }) => mockUseMediaQuery(options),
}));

type QueryMatches = Partial<Record<string, boolean>>;

const setQueryMatches = (queryMatches: QueryMatches) => {
	mockUseMediaQuery.mockImplementation((options: { query?: string } = {}) =>
		options.query ? Boolean(queryMatches[options.query]) : false,
	);
};

describe("useResponsiveGameLayout", () => {
	it("returns desktop layout for fine-pointer desktop viewport", () => {
		setQueryMatches({
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT]: false,
		});

		const { result } = renderHook(() => useResponsiveGameLayout());

		expect(result.current.isDesktopLayout).toBe(true);
		expect(result.current.isTabletLayout).toBe(false);
		expect(result.current.isMobileLayout).toBe(false);
		expect(result.current.isLandscape).toBe(true);
		expect(result.current.isPortrait).toBe(false);
	});

	it("classifies coarse-pointer 1024px landscape viewports as tablet", () => {
		setQueryMatches({
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT]: false,
		});

		const { result } = renderHook(() => useResponsiveGameLayout());

		expect(result.current.isDesktopLayout).toBe(false);
		expect(result.current.isTabletLayout).toBe(true);
		expect(result.current.isMobileLayout).toBe(false);
		expect(result.current.isLandscape).toBe(true);
	});

	it("returns mobile portrait layout for small portrait viewport", () => {
		setQueryMatches({
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH]: true,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE]: false,
			[RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT]: true,
		});

		const { result } = renderHook(() => useResponsiveGameLayout());

		expect(result.current.isDesktopLayout).toBe(false);
		expect(result.current.isTabletLayout).toBe(false);
		expect(result.current.isMobileLayout).toBe(true);
		expect(result.current.isLandscape).toBe(false);
		expect(result.current.isPortrait).toBe(true);
	});
});
