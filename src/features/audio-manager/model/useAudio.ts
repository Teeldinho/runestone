import { useMachine } from "@xstate/react";
import { useCallback, useEffect, useMemo } from "react";
import * as Tone from "tone";

import {
	AUDIO_EVENTS,
	AUDIO_MACHINE_STATES,
	AUDIO_SETTINGS_DEFAULTS,
} from "../config";
import {
	setBackgroundMusicVolume,
	stopBackgroundMusicLoop,
} from "../lib";

import { audioMachine } from "./audioMachine";
import { useAudioPlaybackLifecycle } from "./useAudioPlaybackLifecycle";

type UseAudioSettings = {
	masterVolume?: number;
	musicVolume?: number;
};

export const useAudio = ({
	masterVolume = AUDIO_SETTINGS_DEFAULTS.masterVolume,
	musicVolume = AUDIO_SETTINGS_DEFAULTS.musicVolume,
}: UseAudioSettings = {}) => {
	const [audioSnapshot, sendAudioEvent] = useMachine(audioMachine);
	useAudioPlaybackLifecycle(audioSnapshot.value);

	useEffect(() => {
		Tone.getDestination().volume.value = Tone.gainToDb(masterVolume);
		setBackgroundMusicVolume(musicVolume);
	}, [masterVolume, musicVolume]);

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
