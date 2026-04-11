import { useMediaQuery } from "react-responsive";

import { RESPONSIVE_LAYOUT_MEDIA_QUERIES } from "../config";

export interface ResponsiveGameLayout {
	isDesktopLayout: boolean;
	isMobileLayout: boolean;
	isTabletLayout: boolean;
	isLandscape: boolean;
	isPortrait: boolean;
}

export function useResponsiveGameLayout(): ResponsiveGameLayout {
	const isDesktopWidth = useMediaQuery({
		query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH,
	});
	const isTabletWidth = useMediaQuery({
		query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH,
	});
	const isCoarsePointerTabletWidth = useMediaQuery({
		query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH,
	});
	const isMobile = useMediaQuery({
		query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH,
	});
	const isLandscape = useMediaQuery({
		query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE,
	});
	const isPortrait = useMediaQuery({
		query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT,
	});
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
