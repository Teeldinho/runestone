import { type ReactNode, useEffect } from "react";
import * as Tone from "tone";

import {
	AudioContext,
	startBackgroundMusicLoop,
	useAudio,
} from "@/features/audio-manager";
import { useHaptics } from "@/features/haptics-feedback";

import { AUDIO_PROVIDER_UNLOCK_EVENT_LIST } from "./audioProviderEvents";

type AudioProviderProps = {
	children: ReactNode;
};

export function AudioProvider({ children }: AudioProviderProps) {
	const audioController = useAudio();
	const { onCameraSwitch } = useHaptics();

	useEffect(() => {
		const handleFirstInteraction = () => {
			void Tone.start();
			onCameraSwitch();

			void startBackgroundMusicLoop();

			for (const eventName of AUDIO_PROVIDER_UNLOCK_EVENT_LIST) {
				window.removeEventListener(eventName, handleFirstInteraction);
			}
		};

		for (const eventName of AUDIO_PROVIDER_UNLOCK_EVENT_LIST) {
			window.addEventListener(eventName, handleFirstInteraction);
		}

		return () => {
			for (const eventName of AUDIO_PROVIDER_UNLOCK_EVENT_LIST) {
				window.removeEventListener(eventName, handleFirstInteraction);
			}
		};
	}, [onCameraSwitch]);

	return (
		<AudioContext.Provider value={audioController}>
			{children}
		</AudioContext.Provider>
	);
}
