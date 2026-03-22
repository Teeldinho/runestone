import { createContext, type ReactNode, useContext } from "react";

import {
	AUDIO_CONTEXT_ERRORS,
	type UseAudioResult,
	useAudio,
} from "@/features/audio-manager";

type AudioProviderProps = {
	children: ReactNode;
};

const AudioContext = createContext<UseAudioResult | null>(null);

export function AudioProvider({ children }: AudioProviderProps) {
	const audioController = useAudio();

	return (
		<AudioContext.Provider value={audioController}>
			{children}
		</AudioContext.Provider>
	);
}

export const useAudioController = (): UseAudioResult => {
	const audioContext = useContext(AudioContext);

	if (!audioContext) {
		throw new Error(AUDIO_CONTEXT_ERRORS.MISSING_PROVIDER);
	}

	return audioContext;
};
