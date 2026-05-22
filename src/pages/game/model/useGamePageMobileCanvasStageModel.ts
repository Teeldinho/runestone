import { useSettingsValues } from "@/features/settings";

import {
	useGamePageCanvasContext,
	useGamePageLayoutContext,
} from "./useGamePageSliceContexts";

export const useGamePageMobileCanvasStageModel = () => {
	const canvas = useGamePageCanvasContext();
	const layout = useGamePageLayoutContext();
	const { postprocessingEnabled } = useSettingsValues();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		canvasMachineRuntime: canvas.canvasMachineRuntime,
		isInputBlocked: layout.isPortraitLayout,
		postprocessingEnabled,
	};
};
