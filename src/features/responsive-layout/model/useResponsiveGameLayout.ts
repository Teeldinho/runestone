import { useMediaQuery } from "react-responsive";

export interface ResponsiveGameLayout {
	isDesktopLayout: boolean;
	isMobileLayout: boolean;
	isTabletLayout: boolean;
	isLandscape: boolean;
	isPortrait: boolean;
}

export function useResponsiveGameLayout(): ResponsiveGameLayout {
	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
	const isTablet = useMediaQuery({
		query: "(min-width: 768px) and (max-width: 1023px)",
	});
	const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
	const isLandscape = useMediaQuery({ query: "(orientation: landscape)" });
	const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

	return {
		isDesktopLayout: isDesktop,
		isMobileLayout: isMobile,
		isTabletLayout: isTablet,
		isLandscape,
		isPortrait,
	};
}
