import { useEffect } from "react";

import { useAudioController } from "@/features/audio-manager";

export const useGamePageAudio = () => {
	const { handleAudioPlayRequest, handleAudioMuteToggle, isAudioMuted } =
		useAudioController();

	useEffect(() => {
		handleAudioPlayRequest();
	}, [handleAudioPlayRequest]);

	return {
		isAudioMuted,
		handleAudioMuteToggle,
		handleAudioPlayRequest,
	};
};
