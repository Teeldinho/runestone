type CreateResponsiveGameLayoutInput = {
	isCoarsePointerTabletWidth: boolean;
	isDesktopWidth: boolean;
	isLandscape: boolean;
	isMobile: boolean;
	isPortrait: boolean;
	isTabletWidth: boolean;
};

type ResponsiveGameLayoutSnapshot = {
	isDesktopLayout: boolean;
	isMobileLayout: boolean;
	isTabletLayout: boolean;
	isLandscape: boolean;
	isPortrait: boolean;
};

export const createResponsiveGameLayoutSnapshot = ({
	isCoarsePointerTabletWidth,
	isDesktopWidth,
	isLandscape,
	isMobile,
	isPortrait,
	isTabletWidth,
}: CreateResponsiveGameLayoutInput): ResponsiveGameLayoutSnapshot => {
	const isTabletLayout = isTabletWidth || isCoarsePointerTabletWidth;

	return {
		isDesktopLayout: isDesktopWidth && !isCoarsePointerTabletWidth,
		isMobileLayout: isMobile,
		isTabletLayout,
		isLandscape,
		isPortrait,
	};
};

export type { CreateResponsiveGameLayoutInput, ResponsiveGameLayoutSnapshot };
