import type { GamePageMachineState } from "./useGamePageMachineState";

type UseGamePageLayoutSliceInput = {
	layout: GamePageMachineState["layout"];
};

export const useGamePageLayoutSlice = ({
	layout,
}: UseGamePageLayoutSliceInput) => {
	const { isDesktopLayout, isMobileTabletLandscape, isTabletLayout } = layout;

	return {
		isDesktopLayout,
		isMobileTabletLandscape,
		isTabletLayout,
	};
};

export type { UseGamePageLayoutSliceInput };
