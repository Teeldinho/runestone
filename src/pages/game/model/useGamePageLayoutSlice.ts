import { useMemo } from "react";

import type { GamePageMachineState } from "./useGamePageMachineState";

type UseGamePageLayoutSliceInput = {
	layout: GamePageMachineState["layout"];
};

export const useGamePageLayoutSlice = ({
	layout,
}: UseGamePageLayoutSliceInput) => {
	const { isDesktopLayout, isMobileTabletLandscape, isTabletLayout } = layout;

	return useMemo(
		() => ({
			isDesktopLayout,
			isMobileTabletLandscape,
			isTabletLayout,
		}),
		[isDesktopLayout, isMobileTabletLandscape, isTabletLayout],
	);
};

export type { UseGamePageLayoutSliceInput };
