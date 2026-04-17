import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageDesktopHeaderModel = () => {
	const { currentRoomLabel, handleAudioMuteToggle, isAudioMuted } =
		useGamePageViewModelContext();

	return {
		currentRoomLabel,
		handleAudioMuteToggle,
		isAudioMuted,
	};
};
