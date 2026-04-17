import { useGamePageMobileSheetContext } from "./useGamePageSliceContexts";

export const useGamePageMobileLayoutShellModel = () => {
	const mobileSheet = useGamePageMobileSheetContext();

	return {
		handleMobileSheetOpenChange: mobileSheet.handleMobileSheetOpenChange,
		isMobileSheetOpen: mobileSheet.isMobileSheetOpen,
	};
};
