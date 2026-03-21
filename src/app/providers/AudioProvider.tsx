import { createContext, type ReactNode, useContext } from "react";

import { type UseAudioResult, useAudio } from "@/features/audio-manager";

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
		throw new Error("useAudioController must be used within AudioProvider");
	}

	return audioContext;
};
