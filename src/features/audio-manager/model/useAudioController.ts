import { createContext, useContext } from "react";

import { AUDIO_CONTEXT_ERRORS } from "../config";

import type { UseAudioResult } from "./useAudio";

export const AudioContext = createContext<UseAudioResult | null>(null);

export const useAudioController = (): UseAudioResult => {
	const audioContext = useContext(AudioContext);

	if (!audioContext) {
		throw new Error(AUDIO_CONTEXT_ERRORS.MISSING_PROVIDER);
	}

	return audioContext;
};
