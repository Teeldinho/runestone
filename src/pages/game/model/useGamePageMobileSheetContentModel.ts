import {
	useGamePageCanvasContext,
	useGamePageMobileSheetContext,
	useGamePageVisualizerContext,
} from "./useGamePageSliceContexts";

export const useGamePageMobileSheetContentModel = () => {
	const canvas = useGamePageCanvasContext();
	const mobileSheet = useGamePageMobileSheetContext();
	const visualizer = useGamePageVisualizerContext();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		graphSections: visualizer.graphSections,
		handleCameraModeSwitch: canvas.handleCameraModeSwitch,
		handleMobileSheetTabChange: mobileSheet.handleMobileSheetTabChange,
		mobileSheetTabId: mobileSheet.mobileSheetTabId,
	};
};
