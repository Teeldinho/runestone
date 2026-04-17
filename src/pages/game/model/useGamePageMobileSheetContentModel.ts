import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileSheetContentModel = () => {
	const { canvas, mobileSheet, visualizer } = useGamePageViewModelContext();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		graphSections: visualizer.graphSections,
		handleCameraModeSwitch: canvas.handleCameraModeSwitch,
		handleMobileSheetTabChange: mobileSheet.handleMobileSheetTabChange,
		mobileSheetTabId: mobileSheet.mobileSheetTabId,
	};
};
