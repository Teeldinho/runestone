import { useSettingsForm } from "@/features/settings";

import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileCanvasStageModel = () => {
	const { cameraStateSnapshot, canvasMachineRuntime } =
		useGamePageViewModelContext();
	const { postprocessingEnabled } = useSettingsForm();

	return {
		cameraStateSnapshot,
		canvasMachineRuntime,
		postprocessingEnabled,
	};
};
