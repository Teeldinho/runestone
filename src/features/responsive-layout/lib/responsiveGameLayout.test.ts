import { describe, expect, it } from "vitest";

import { createResponsiveGameLayoutSnapshot } from "./responsiveGameLayout";

describe("createResponsiveGameLayoutSnapshot", () => {
	it("derives desktop layout for fine-pointer desktop width", () => {
		expect(
			createResponsiveGameLayoutSnapshot({
				isCoarsePointerTabletWidth: false,
				isDesktopWidth: true,
				isLandscape: true,
				isMobile: false,
				isPortrait: false,
				isTabletWidth: false,
			}),
		).toEqual({
			isDesktopLayout: true,
			isMobileLayout: false,
			isTabletLayout: false,
			isLandscape: true,
			isPortrait: false,
		});
	});

	it("treats coarse pointer desktop-width devices as tablet layout", () => {
		expect(
			createResponsiveGameLayoutSnapshot({
				isCoarsePointerTabletWidth: true,
				isDesktopWidth: true,
				isLandscape: true,
				isMobile: false,
				isPortrait: false,
				isTabletWidth: false,
			}),
		).toEqual({
			isDesktopLayout: false,
			isMobileLayout: false,
			isTabletLayout: true,
			isLandscape: true,
			isPortrait: false,
		});
	});

	it("preserves mobile and portrait flags from media-query state", () => {
		expect(
			createResponsiveGameLayoutSnapshot({
				isCoarsePointerTabletWidth: false,
				isDesktopWidth: false,
				isLandscape: false,
				isMobile: true,
				isPortrait: true,
				isTabletWidth: false,
			}),
		).toEqual({
			isDesktopLayout: false,
			isMobileLayout: true,
			isTabletLayout: false,
			isLandscape: false,
			isPortrait: true,
		});
	});
});
