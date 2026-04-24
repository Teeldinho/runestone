import { type ReactNode, useEffect } from "react";
import * as Tone from "tone";
import {
	AudioContext,
	startBackgroundMusicLoop,
	useAudio,
} from "@/features/audio-manager";
import { useSettingsValues } from "@/features/settings";

import { AUDIO_PROVIDER_UNLOCK_EVENT_LIST } from "./audioProviderEvents";

type AudioProviderProps = {
	children: ReactNode;
};

export function AudioProvider({ children }: AudioProviderProps) {
	const { masterVolume, musicVolume } = useSettingsValues();
	const audioController = useAudio({ masterVolume, musicVolume });

	useEffect(() => {
		const handleFirstInteraction = () => {
			void Tone.start();
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
	}, []);

	return (
		<AudioContext.Provider value={audioController}>
			{children}
		</AudioContext.Provider>
	);
}
