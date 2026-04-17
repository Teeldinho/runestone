import { useSettingsForm } from "@/features/settings";

import { useGamePageCanvasContext } from "./useGamePageSliceContexts";

export const useGamePageMobileCanvasStageModel = () => {
	const canvas = useGamePageCanvasContext();
	const { postprocessingEnabled } = useSettingsForm();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		canvasMachineRuntime: canvas.canvasMachineRuntime,
		postprocessingEnabled,
	};
};
