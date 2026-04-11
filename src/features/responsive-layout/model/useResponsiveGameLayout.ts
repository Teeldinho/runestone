import { useEffect, useState } from "react";

import { RESPONSIVE_LAYOUT_MEDIA_QUERIES } from "../config";

export interface ResponsiveGameLayout {
	isDesktopLayout: boolean;
	isMobileLayout: boolean;
	isTabletLayout: boolean;
	isLandscape: boolean;
	isPortrait: boolean;
}

export function useResponsiveGameLayout(): ResponsiveGameLayout {
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
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT,
				setter: setIsPortrait,
			},
		];

		const listeners: MediaQueryList[] = [];

		queries.forEach(({ query, setter }) => {
			const mediaQuery = window.matchMedia(query);
			setter(mediaQuery.matches);

			const listener = (event: MediaQueryListEvent) => {
				setter(event.matches);
			};

			mediaQuery.addEventListener("change", listener);
			listeners.push(mediaQuery);
		});

		return () => {
			listeners.forEach((mediaQuery) => {
				mediaQuery.removeEventListener("change", () => {});
			});
		};
	}, []);

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
