import {
	useGamePageAudioContext,
	useGamePageHudContext,
} from "./useGamePageSliceContexts";

export const useGamePageDesktopHeaderModel = () => {
	const audio = useGamePageAudioContext();
	const hud = useGamePageHudContext();

	return {
		currentRoomLabel: hud.currentRoomLabel,
		handleAudioMuteToggle: audio.handleAudioMuteToggle,
		isAudioMuted: audio.isAudioMuted,
	};
};
