import { useEffect, useState } from "react";

import { RESPONSIVE_LAYOUT_MEDIA_QUERIES } from "../config";
import {
	createResponsiveGameLayoutSnapshot,
	createResponsiveMediaQuerySubscriptions,
	type ResponsiveGameLayoutSnapshot,
	removeResponsiveMediaQuerySubscriptions,
} from "../lib";

export type ResponsiveGameLayout = ResponsiveGameLayoutSnapshot;

export function useResponsiveGameLayout(): ResponsiveGameLayout {
	const [isDesktopWidth, setIsDesktopWidth] = useState(false);
	const [isTabletWidth, setIsTabletWidth] = useState(false);
	const [isCoarsePointerTabletWidth, setIsCoarsePointerTabletWidth] =
		useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isLandscape, setIsLandscape] = useState(true);
	const [isPortrait, setIsPortrait] = useState(false);

	useEffect(() => {
		const subscriptions = createResponsiveMediaQuerySubscriptions([
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.DESKTOP_MIN_WIDTH,
				setMatches: setIsDesktopWidth,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_STANDARD_WIDTH,
				setMatches: setIsTabletWidth,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.TABLET_COARSE_WIDTH,
				setMatches: setIsCoarsePointerTabletWidth,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.MOBILE_MAX_WIDTH,
				setMatches: setIsMobile,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.LANDSCAPE,
				setMatches: setIsLandscape,
			},
			{
				query: RESPONSIVE_LAYOUT_MEDIA_QUERIES.PORTRAIT,
				setMatches: setIsPortrait,
			},
		]);

		return () => {
			removeResponsiveMediaQuerySubscriptions(subscriptions);
		};
	}, []);

	return createResponsiveGameLayoutSnapshot({
		isCoarsePointerTabletWidth,
		isDesktopWidth,
		isLandscape,
		isMobile,
		isPortrait,
		isTabletWidth,
	});
}
