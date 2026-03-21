import { AUDIO_MACHINE_STATES } from "../config";

import type { AudioMachineContext } from "../model";

export const createMutedAudioContext = (
	context: AudioMachineContext,
): AudioMachineContext => ({
	settings: {
		...context.settings,
		isMuted: true,
	},
	lastAudibleState:
		context.lastAudibleState === AUDIO_MACHINE_STATES.PLAYING
			? AUDIO_MACHINE_STATES.PLAYING
			: AUDIO_MACHINE_STATES.PAUSED,
});

export const createUnmutedAudioContext = (
	context: AudioMachineContext,
): Partial<AudioMachineContext> => ({
	settings: {
		...context.settings,
		isMuted: false,
	},
});
