import { AUDIO_SPRITES, type AudioSpriteId } from "../config";

export const AUDIO_SPRITE_DEFINITIONS: Record<AudioSpriteId, [number, number]> =
	Object.fromEntries(
		Object.entries(AUDIO_SPRITES).map(([spriteId, spriteWindow]) => [
			spriteId,
			[spriteWindow[0], spriteWindow[1]],
		]),
	) as Record<AudioSpriteId, [number, number]>;
