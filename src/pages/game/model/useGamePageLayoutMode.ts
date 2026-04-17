import { useGamePageLayoutContext } from "./useGamePageSliceContexts";

export const useGamePageLayoutMode = () => {
	const layout = useGamePageLayoutContext();

	return {
		isDesktopLayout: layout.isDesktopLayout,
		isMobileTabletLandscape: layout.isMobileTabletLandscape,
	};
};
