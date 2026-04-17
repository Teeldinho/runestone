import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileLayoutShellModel = () => {
	const { mobileSheet } = useGamePageViewModelContext();

	return {
		handleMobileSheetOpenChange: mobileSheet.handleMobileSheetOpenChange,
		isMobileSheetOpen: mobileSheet.isMobileSheetOpen,
	};
};
