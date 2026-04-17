import { useSettingsForm } from "@/features/settings";

import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageDesktopLayoutModel = () => {
	const { audio, canvas, hud, layout, visualizer } =
		useGamePageViewModelContext();
	const { postprocessingEnabled } = useSettingsForm();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		canvasMachineRuntime: canvas.canvasMachineRuntime,
		currentRoomLabel: hud.currentRoomLabel,
		graphSections: visualizer.graphSections,
		handleAudioMuteToggle: audio.handleAudioMuteToggle,
		handleCameraModeSwitch: canvas.handleCameraModeSwitch,
		isAudioMuted: audio.isAudioMuted,
		isMobileTabletLandscape: layout.isMobileTabletLandscape,
		postprocessingEnabled,
	};
};
