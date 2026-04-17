import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageDesktopHeaderModel = () => {
	const { audio, hud } = useGamePageViewModelContext();

	return {
		currentRoomLabel: hud.currentRoomLabel,
		handleAudioMuteToggle: audio.handleAudioMuteToggle,
		isAudioMuted: audio.isAudioMuted,
	};
};
