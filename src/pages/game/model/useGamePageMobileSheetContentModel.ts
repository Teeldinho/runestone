import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { createGamePageMobileSheetContentHeightClassName } from "../lib/createGamePageMobileSheetContentHeightClassName";
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
		drawerContentHeightClassName:
			createGamePageMobileSheetContentHeightClassName(
				GAME_PAGE_MOBILE_SHEET.HEIGHT_DVH,
			),
		graphSections: visualizer.graphSections,
		handleCameraModeSwitch: canvas.handleCameraModeSwitch,
		handleMobileSheetTabChange: mobileSheet.handleMobileSheetTabChange,
		isTabletLayout: layout.isTabletLayout,
		mobileSheetTabId: mobileSheet.mobileSheetTabId,
	};
};
