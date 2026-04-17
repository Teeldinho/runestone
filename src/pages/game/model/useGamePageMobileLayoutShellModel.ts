import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileLayoutShellModel = () => {
	const { handleMobileSheetOpenChange, isMobileSheetOpen } =
		useGamePageViewModelContext();

	return {
		handleMobileSheetOpenChange,
		isMobileSheetOpen,
	};
};
