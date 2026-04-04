import { type ReactNode, useEffect } from "react";
import * as Tone from "tone";

import { AudioContext, useAudio } from "@/features/audio-manager";

type AudioProviderProps = {
	children: ReactNode;
};

export function AudioProvider({ children }: AudioProviderProps) {
	const audioController = useAudio();

	useEffect(() => {
		const handleFirstInteraction = () => {
			void Tone.start();
			window.removeEventListener("pointerdown", handleFirstInteraction);
			window.removeEventListener("keydown", handleFirstInteraction);
		};

		window.addEventListener("pointerdown", handleFirstInteraction);
		window.addEventListener("keydown", handleFirstInteraction);

		return () => {
			window.removeEventListener("pointerdown", handleFirstInteraction);
			window.removeEventListener("keydown", handleFirstInteraction);
		};
	}, []);

	return (
		<AudioContext.Provider value={audioController}>
			{children}
		</AudioContext.Provider>
	);
}
