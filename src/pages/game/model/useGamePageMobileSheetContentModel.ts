import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileSheetContentModel = () => {
	const {
		cameraStateSnapshot,
		graphSections,
		handleCameraModeSwitch,
		handleMobileSheetTabChange,
		mobileSheetTabId,
	} = useGamePageViewModelContext();

	return {
		cameraStateSnapshot,
		graphSections,
		handleCameraModeSwitch,
		handleMobileSheetTabChange,
		mobileSheetTabId,
	};
};
