import { useMachine } from "@xstate/react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { AUDIO_EVENTS, AUDIO_MACHINE_STATES } from "../config";
import {
	pauseBackgroundMusicLoop,
	startBackgroundMusicLoop,
	stopBackgroundMusicLoop,
} from "../lib";

import { audioMachine } from "./audioMachine";

export const useAudio = () => {
	const [audioSnapshot, sendAudioEvent] = useMachine(audioMachine);
	const previousAudioStateRef = useRef(audioSnapshot.value);
	const isAudioMutedRef = useRef(
		audioSnapshot.matches(AUDIO_MACHINE_STATES.MUTED),
	);

	useEffect(() => {
		isAudioMutedRef.current = audioSnapshot.matches(AUDIO_MACHINE_STATES.MUTED);
	}, [audioSnapshot]);

	useEffect(() => {
		const wasPlayingBeforeUpdate =
			previousAudioStateRef.current === AUDIO_MACHINE_STATES.PLAYING;

		if (
			audioSnapshot.matches(AUDIO_MACHINE_STATES.PLAYING) &&
			!wasPlayingBeforeUpdate
		) {
			void startBackgroundMusicLoop();
		} else if (
			audioSnapshot.matches(AUDIO_MACHINE_STATES.PAUSED) ||
			audioSnapshot.matches(AUDIO_MACHINE_STATES.MUTED)
		) {
			pauseBackgroundMusicLoop();
		}

		previousAudioStateRef.current = audioSnapshot.value;
	}, [audioSnapshot]);

	const handleAudioPlayRequest = useCallback(() => {
		sendAudioEvent({
			type: AUDIO_EVENTS.PLAY_REQUESTED,
		});
	}, [sendAudioEvent]);

	const handleAudioPauseRequest = useCallback(() => {
		sendAudioEvent({
			type: AUDIO_EVENTS.PAUSE_REQUESTED,
		});
	}, [sendAudioEvent]);

	const handleAudioStopRequest = useCallback(() => {
		sendAudioEvent({
			type: AUDIO_EVENTS.STOP_REQUESTED,
		});
		stopBackgroundMusicLoop();
	}, [sendAudioEvent]);

	const handleAudioMuteToggle = useCallback(() => {
		isAudioMutedRef.current = !isAudioMutedRef.current;

		sendAudioEvent({
			type: AUDIO_EVENTS.TOGGLE_MUTE_REQUESTED,
		});
	}, [sendAudioEvent]);

	return useMemo(
		() => ({
			audioState: audioSnapshot.value,
			isAudioMuted: audioSnapshot.matches(AUDIO_MACHINE_STATES.MUTED),
			isAudioPlaying: audioSnapshot.matches(AUDIO_MACHINE_STATES.PLAYING),
			handleAudioMuteToggle,
			handleAudioPauseRequest,
			handleAudioPlayRequest,
			handleAudioStopRequest,
		}),
		[
			audioSnapshot,
			handleAudioMuteToggle,
			handleAudioPauseRequest,
			handleAudioPlayRequest,
			handleAudioStopRequest,
		],
	);
};

export type UseAudioResult = ReturnType<typeof useAudio>;
