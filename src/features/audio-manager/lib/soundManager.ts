import { Howl } from "howler";

import {
	AUDIO_DEFAULTS,
	AUDIO_PATHS,
	AUDIO_SPRITE_DEFINITIONS,
	type AudioSpriteId,
} from "../config";

let soundEffectHowl: Howl | null = null;

const getSoundEffectHowl = (): Howl => {
	if (!soundEffectHowl) {
		soundEffectHowl = new Howl({
			src: [AUDIO_PATHS.SFX],
			sprite: AUDIO_SPRITE_DEFINITIONS,
			volume: AUDIO_DEFAULTS.SFX_VOLUME,
		});
	}

	return soundEffectHowl;
};

export const playSoundEffect = (soundEffectId: AudioSpriteId): void => {
	getSoundEffectHowl().play(soundEffectId);
};

export const setSoundEffectsVolume = (volume: number): void => {
	getSoundEffectHowl().volume(volume);
};

export const stopAllSoundEffects = (): void => {
	getSoundEffectHowl().stop();
};

export const disposeSoundManager = (): void => {
	if (!soundEffectHowl) {
		return;
	}

	soundEffectHowl.unload();
	soundEffectHowl = null;
};
