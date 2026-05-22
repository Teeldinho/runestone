import type { GamePageMachineState } from "./useGamePageMachineState";

type UseGamePageLayoutSliceInput = {
	layout: GamePageMachineState["layout"];
};

export const useGamePageLayoutSlice = ({
	layout,
}: UseGamePageLayoutSliceInput) => {
	const {
		isDesktopLayout,
		isMobileTabletLandscape,
		isPortraitLayout,
		isTabletLayout,
	} = layout;

	return {
		isDesktopLayout,
		isMobileTabletLandscape,
		isPortraitLayout,
		isTabletLayout,
	};
};

export type { UseGamePageLayoutSliceInput };
