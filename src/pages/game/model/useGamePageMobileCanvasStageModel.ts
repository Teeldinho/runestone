import { useSettingsForm } from "@/features/settings";

import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileCanvasStageModel = () => {
	const { canvas } = useGamePageViewModelContext();
	const { postprocessingEnabled } = useSettingsForm();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		canvasMachineRuntime: canvas.canvasMachineRuntime,
		postprocessingEnabled,
	};
};
