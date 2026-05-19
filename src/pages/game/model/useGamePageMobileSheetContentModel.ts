import {
	useGamePageCanvasContext,
	useGamePageLayoutContext,
	useGamePageMobileSheetContext,
	useGamePageVisualizerContext,
} from "./useGamePageSliceContexts";

export const useGamePageMobileSheetContentModel = () => {
	const canvas = useGamePageCanvasContext();
	const layout = useGamePageLayoutContext();
	const mobileSheet = useGamePageMobileSheetContext();
	const visualizer = useGamePageVisualizerContext();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		graphSections: visualizer.graphSections,
		handleCameraModeSwitch: canvas.handleCameraModeSwitch,
		handleMobileSheetTabChange: mobileSheet.handleMobileSheetTabChange,
		isTabletLayout: layout.isTabletLayout,
		mobileSheetTabId: mobileSheet.mobileSheetTabId,
	};
};
