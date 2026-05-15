import type { Achievement } from "@/features/achievements";
import type { CameraStateSnapshot } from "@/features/camera-system";
import { useSettingsValues } from "@/features/settings";

import type { CanvasMachineSettingsViewModel } from "./canvasSettingsTypes";
import { useAchievementTracker } from "./useAchievementTracker";
import type { CanvasMachineRuntime } from "./useCanvasMachineSettings";
import { useCanvasMachineSettings } from "./useCanvasMachineSettings";
import { useGameOverState } from "./useGameOverState";
import { useGameSideEffects } from "./useGameSideEffects";
import { usePlayerSceneController } from "./usePlayerSceneController";

type UseGameCanvasViewModelInput = {
	cameraStateSnapshot?: CameraStateSnapshot;
	machineRuntime: CanvasMachineRuntime;
	postprocessingEnabled: boolean;
};

type UseGameCanvasViewModelResult = {
	canvasSettings: CanvasMachineSettingsViewModel;
	isGameOver: boolean;
	handleGameRestart: () => void;
	activeAchievement: Achievement | null;
};

export const useGameCanvasViewModel = ({
	cameraStateSnapshot,
	machineRuntime,
	postprocessingEnabled,
}: UseGameCanvasViewModelInput): UseGameCanvasViewModelResult => {
	const { hapticsEnabled } = useSettingsValues();
	const canvasSettings = useCanvasMachineSettings(
		machineRuntime,
		cameraStateSnapshot,
		postprocessingEnabled,
	);

	usePlayerSceneController();
	useGameSideEffects({ hapticsEnabled });

	const { isGameOver, handleGameRestart } = useGameOverState();
	const { activeAchievement } = useAchievementTracker({ hapticsEnabled });

	return {
		canvasSettings,
		isGameOver,
		handleGameRestart,
		activeAchievement,
	};
};

export type { UseGameCanvasViewModelInput, UseGameCanvasViewModelResult };
