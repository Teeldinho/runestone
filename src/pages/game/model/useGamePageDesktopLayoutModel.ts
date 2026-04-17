import { useSettingsForm } from "@/features/settings";

import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageDesktopLayoutModel = () => {
	const {
		cameraStateSnapshot,
		canvasMachineRuntime,
		currentRoomLabel,
		graphSections,
		handleAudioMuteToggle,
		handleCameraModeSwitch,
		isAudioMuted,
		isMobileTabletLandscape,
	} = useGamePageViewModelContext();
	const { postprocessingEnabled } = useSettingsForm();

	return {
		cameraStateSnapshot,
		canvasMachineRuntime,
		currentRoomLabel,
		graphSections,
		handleAudioMuteToggle,
		handleCameraModeSwitch,
		isAudioMuted,
		isMobileTabletLandscape,
		postprocessingEnabled,
	};
};
