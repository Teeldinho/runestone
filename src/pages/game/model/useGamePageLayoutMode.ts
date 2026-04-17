import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageLayoutMode = () => {
	const { layout } = useGamePageViewModelContext();

	return {
		isDesktopLayout: layout.isDesktopLayout,
		isMobileTabletLandscape: layout.isMobileTabletLandscape,
	};
};
