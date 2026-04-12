import { useEffect, useState } from "react";

const RESPONSIVE_LAYOUT_MEDIA_QUERIES = {
	DESKTOP_MIN_WIDTH: "(min-width: 1024px)",
	MOBILE_MAX_WIDTH: "(max-width: 767px)",
	TABLET_STANDARD_WIDTH: "(min-width: 768px) and (max-width: 1023px)",
	TABLET_COARSE_WIDTH:
		"(min-width: 1024px) and (max-width: 1366px) and (pointer: coarse)",
	LANDSCAPE: "(orientation: landscape)",
} as const;

export interface ResponsiveLayoutState {
	isDesktopLayout: boolean;
	isMobileLayout: boolean;
	isTabletLayout: boolean;
	isLandscape: boolean;
	isPortrait: boolean;
}

export function useResponsiveLayout(): ResponsiveLayoutState {
	const [isDesktopWidth, setIsDesktopWidth] = useState(false);
	const [isTabletWidth, setIsTabletWidth] = useState(false);
	const [isCoarsePointerTabletWidth, setIsCoarsePointerTabletWidth] =
		useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isLandscape, setIsLandscape] = useState(true);
	const [isPortrait, setIsPortrait] = useState(false);

	useEffect(() => {
		const queries = [
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH,
				setter: setIsDesktopWidth,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH,
				setter: setIsTabletWidth,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH,
				setter: setIsCoarsePointerTabletWidth,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH,
				setter: setIsMobile,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE,
				setter: setIsLandscape,
			},
		];

		queries.forEach(({ query, setter }) => {
			const mediaQuery = window.matchMedia(query);
			setter(mediaQuery.matches);
		});

		setIsPortrait(!isLandscape);
	}, [isLandscape]);

	const isTablet = isTabletWidth || isCoarsePointerTabletWidth;
	const isDesktop = isDesktopWidth && !isCoarsePointerTabletWidth;

	return {
		isDesktopLayout: isDesktop,
		isMobileLayout: isMobile,
		isTabletLayout: isTablet,
		isLandscape,
		isPortrait,
	};
}
