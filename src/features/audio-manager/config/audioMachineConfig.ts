import { AUDIO_DEFAULTS } from "./audioAssets";
import { AUDIO_MACHINE_STATES } from "./audioEvents";

export const AUDIO_SETTINGS_DEFAULTS = {
	masterVolume: AUDIO_DEFAULTS.MASTER_VOLUME,
	musicVolume: AUDIO_DEFAULTS.MUSIC_VOLUME,
	sfxVolume: AUDIO_DEFAULTS.SFX_VOLUME,
	isMuted: false,
} as const;

export const AUDIO_DEFAULT_LAST_AUDIBLE_STATE = AUDIO_MACHINE_STATES.PAUSED;

export const AUDIO_INITIAL_CONTEXT = {
	settings: AUDIO_SETTINGS_DEFAULTS,
	lastAudibleState: AUDIO_DEFAULT_LAST_AUDIBLE_STATE,
};
