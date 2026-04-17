import { useEffect } from "react";

import { useAudioController } from "@/features/audio-manager";

type GamePageAudioViewModel = {
	audioState: ReturnType<typeof useAudioController>["audioState"];
	handleAudioMuteToggle: ReturnType<
		typeof useAudioController
	>["handleAudioMuteToggle"];
	isAudioMuted: ReturnType<typeof useAudioController>["isAudioMuted"];
};

export const useGamePageAudio = (): GamePageAudioViewModel => {
	const {
		audioState,
		handleAudioPlayRequest,
		handleAudioMuteToggle,
		isAudioMuted,
	} = useAudioController();

	useEffect(() => {
		handleAudioPlayRequest();
	}, [handleAudioPlayRequest]);

	return {
		audioState,
		handleAudioMuteToggle,
		isAudioMuted,
	};
};

export type { GamePageAudioViewModel };
