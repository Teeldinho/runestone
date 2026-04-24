import { useSettingsValues } from "@/features/settings";

import {
	useGamePageAudioContext,
	useGamePageCanvasContext,
	useGamePageHudContext,
	useGamePageLayoutContext,
	useGamePageVisualizerContext,
} from "./useGamePageSliceContexts";

export const useGamePageDesktopLayoutModel = () => {
	const audio = useGamePageAudioContext();
	const canvas = useGamePageCanvasContext();
	const hud = useGamePageHudContext();
	const layout = useGamePageLayoutContext();
	const visualizer = useGamePageVisualizerContext();
	const { postprocessingEnabled } = useSettingsValues();

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
