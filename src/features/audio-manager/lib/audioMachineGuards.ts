import { AUDIO_MACHINE_STATES } from "../config";

export const checkWasPlaying = (lastAudibleState: string): boolean =>
	lastAudibleState === AUDIO_MACHINE_STATES.PLAYING;
