import type { ReactNode } from "react";

import { AudioContext, useAudio } from "@/features/audio-manager";

type AudioProviderProps = {
	children: ReactNode;
};

export function AudioProvider({ children }: AudioProviderProps) {
	const audioController = useAudio();

	return (
		<AudioContext.Provider value={audioController}>
			{children}
		</AudioContext.Provider>
	);
}
