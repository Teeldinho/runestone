import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageLayoutMode = () => {
	const { isDesktopLayout, isMobileTabletLandscape } =
		useGamePageViewModelContext();

	return {
		isDesktopLayout,
		isMobileTabletLandscape,
	};
};
