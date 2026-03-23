export const AUDIO_PATHS = {
	MUSIC: "/audio/music/dungeon-loop.ogg",
	SFX: "/audio/sfx/game-sprites.ogg",
} as const;

export const AUDIO_SPRITES = {
	DOOR_OPEN: [0, 900],
	DOOR_LOCKED: [1000, 600],
	RUNE_ACTIVATE: [1800, 700],
	ENEMY_HIT: [2600, 500],
	ENEMY_DIE: [3200, 1000],
	PLAYER_HIT: [4300, 700],
	ACHIEVEMENT: [5100, 1200],
} as const;

export type AudioSpriteId = keyof typeof AUDIO_SPRITES;

export const AUDIO_SPRITE_IDS = {
	DOOR_OPEN: "DOOR_OPEN",
	DOOR_LOCKED: "DOOR_LOCKED",
	RUNE_ACTIVATE: "RUNE_ACTIVATE",
	ENEMY_HIT: "ENEMY_HIT",
	ENEMY_DIE: "ENEMY_DIE",
	PLAYER_HIT: "PLAYER_HIT",
	ACHIEVEMENT: "ACHIEVEMENT",
} as const satisfies Record<string, AudioSpriteId>;

export const AUDIO_DEFAULTS = {
	MASTER_VOLUME: 0.8,
	MUSIC_VOLUME: 0.55,
	SFX_VOLUME: 0.9,
	FADE_IN_SECONDS: 0.8,
	FADE_OUT_SECONDS: 0.8,
	MUSIC_LOOP: true,
} as const;
