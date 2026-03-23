export const SCORE_VALUES = {
	ROOM_DISCOVERY: 100,
	CORRECT_TRANSITION: 50,
	GUARD_SOLVED: 150,
	ACTOR_INTERACTION: 200,
	FLOOR_COMPLETE: 500,
	ENEMY_DEFEATED: 120,
} as const;

export const CHAIN_MULTIPLIERS = [1, 1, 1.5, 1.5, 2, 2, 2.5, 3] as const;
export const CHAIN_MULTIPLIER_MAX_INDEX = CHAIN_MULTIPLIERS.length - 1;

export const TIME_BONUS_CAP_PERCENT = 0.05;
export const CAMERA_TRANSITION_MS = 800;
export const CAMERA_DEFAULT_ZOOM = 1;
export const HAPTIC_THROTTLE_MS = 50;
export const PLAYER_EYE_HEIGHT = 1.7;
export const WORLD_SCALE_FACTOR = 0.15;

export const STORAGE_KEYS = {
	SESSION_UUID: "rs_uuid",
	USERNAME: "rs_username",
	SETTINGS: "rs_settings",
} as const;

export const MACHINE_STATE_TYPES = {
	ATOMIC: "atomic",
	COMPOUND: "compound",
	PARALLEL: "parallel",
	FINAL: "final",
	HISTORY: "history",
} as const;

export type ScoreValueKey = keyof typeof SCORE_VALUES;
export type ChainMultiplier = (typeof CHAIN_MULTIPLIERS)[number];
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
