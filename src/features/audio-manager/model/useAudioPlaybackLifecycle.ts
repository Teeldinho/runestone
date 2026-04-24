import { useEffect, useRef } from "react";

import { AUDIO_MACHINE_STATES } from "../config";
import { pauseBackgroundMusicLoop, startBackgroundMusicLoop } from "../lib";

import type { AudioMachineState } from "./types";

export const useAudioPlaybackLifecycle = (
	audioState: AudioMachineState,
) => {
	const previousAudioStateRef = useRef(audioState);

	useEffect(() => {
		const wasPlayingBeforeUpdate =
			previousAudioStateRef.current === AUDIO_MACHINE_STATES.PLAYING;

		if (audioState === AUDIO_MACHINE_STATES.PLAYING && !wasPlayingBeforeUpdate) {
			void startBackgroundMusicLoop();
		} else if (
			audioState === AUDIO_MACHINE_STATES.PAUSED ||
			audioState === AUDIO_MACHINE_STATES.MUTED
		) {
			pauseBackgroundMusicLoop();
		}

		previousAudioStateRef.current = audioState;
	}, [audioState]);
};
