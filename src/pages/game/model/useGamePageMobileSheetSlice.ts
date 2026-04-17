import { useMemo } from "react";

import { useGamePageMobileSheet } from "./useGamePageMobileSheet";

type UseGamePageMobileSheetSliceInput = {
	isMobileTabletLandscape: boolean;
};

export const useGamePageMobileSheetSlice = ({
	isMobileTabletLandscape,
}: UseGamePageMobileSheetSliceInput) => {
	const {
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		isMobileSheetOpen,
		mobileSheetTabId,
	} = useGamePageMobileSheet({
		isMobileTabletLandscape,
	});

	return useMemo(
		() => ({
			handleMobileSheetOpenChange,
			handleMobileSheetTabChange,
			isMobileSheetOpen,
			mobileSheetTabId,
		}),
		[
			handleMobileSheetOpenChange,
			handleMobileSheetTabChange,
			isMobileSheetOpen,
			mobileSheetTabId,
		],
	);
};

export type { UseGamePageMobileSheetSliceInput };
