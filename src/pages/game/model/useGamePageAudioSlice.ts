import { useMemo } from "react";

import { useGamePageAudio } from "./useGamePageAudio";

type GamePageAudioSliceViewModel = ReturnType<typeof useGamePageAudio>;

type UseGamePageAudioSliceResult = {
	audio: Pick<
		GamePageAudioSliceViewModel,
		"handleAudioMuteToggle" | "isAudioMuted"
	>;
	audioState: GamePageAudioSliceViewModel["audioState"];
};

export const useGamePageAudioSlice = (): UseGamePageAudioSliceResult => {
	const { audioState, handleAudioMuteToggle, isAudioMuted } =
		useGamePageAudio();

	const audio = useMemo(
		() => ({
			handleAudioMuteToggle,
			isAudioMuted,
		}),
		[handleAudioMuteToggle, isAudioMuted],
	);

	return {
		audio,
		audioState,
	};
};

export type { UseGamePageAudioSliceResult };
