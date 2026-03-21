import { Howl } from "howler";

import {
	AUDIO_DEFAULTS,
	AUDIO_PATHS,
	AUDIO_SPRITES,
	type AudioSpriteId,
} from "../config";

let soundEffectHowl: Howl | null = null;

const SOUND_EFFECT_SPRITE_DEFINITIONS = Object.fromEntries(
	Object.entries(AUDIO_SPRITES).map(([spriteId, spriteWindow]) => [
		spriteId,
		[spriteWindow[0], spriteWindow[1]],
	]),
) as Record<AudioSpriteId, [number, number]>;

const getSoundEffectHowl = (): Howl => {
	if (!soundEffectHowl) {
		soundEffectHowl = new Howl({
			src: [AUDIO_PATHS.SFX],
			sprite: SOUND_EFFECT_SPRITE_DEFINITIONS,
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
