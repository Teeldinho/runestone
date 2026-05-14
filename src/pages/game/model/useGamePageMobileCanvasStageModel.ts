import { useSettingsValues } from "@/features/settings";

import { useGamePageCanvasContext } from "./useGamePageSliceContexts";

export const useGamePageMobileCanvasStageModel = () => {
	const canvas = useGamePageCanvasContext();
	const { postprocessingEnabled } = useSettingsValues();

	return {
		cameraActorRef: canvas.cameraActorRef,
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		canvasMachineRuntime: canvas.canvasMachineRuntime,
		postprocessingEnabled,
	};
};
