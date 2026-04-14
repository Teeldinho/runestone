import { useResponsiveGameLayout } from "@/features/responsive-layout";

export const useGamePageLayout = () => {
	const { isDesktopLayout, isLandscape, isTabletLayout } =
		useResponsiveGameLayout();

	return {
		isDesktopLayout,
		isTabletLayout,
		isMobileTabletLandscape: !isDesktopLayout && isLandscape,
	};
};
