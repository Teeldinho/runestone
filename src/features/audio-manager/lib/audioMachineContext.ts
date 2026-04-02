import { AUDIO_CONTEXT_KEYS, AUDIO_MACHINE_STATES } from "../config";

import type { AudioMachineContext } from "../model";

export const createMutedAudioContext = (
	context: AudioMachineContext,
): AudioMachineContext => ({
	[AUDIO_CONTEXT_KEYS.SETTINGS]: {
		...context.settings,
		isMuted: true,
	},
	[AUDIO_CONTEXT_KEYS.LAST_AUDIBLE_STATE]:
		context.lastAudibleState === AUDIO_MACHINE_STATES.PLAYING
			? AUDIO_MACHINE_STATES.PLAYING
			: AUDIO_MACHINE_STATES.PAUSED,
});

export const createUnmutedAudioContext = (
	context: AudioMachineContext,
): Partial<AudioMachineContext> => ({
	[AUDIO_CONTEXT_KEYS.SETTINGS]: {
		...context.settings,
		isMuted: false,
	},
});
