export const deriveIsMobileTabletLandscape = (
	isDesktopLayout: boolean,
	isLandscape: boolean,
) => !isDesktopLayout && isLandscape;
