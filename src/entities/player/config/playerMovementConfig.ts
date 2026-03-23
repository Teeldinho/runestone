export const PLAYER_MOVEMENT_KEYS = {
	FORWARD: "w",
	BACKWARD: "s",
	LEFT: "a",
	RIGHT: "d",
} as const;

export type PlayerMovementKey =
	(typeof PLAYER_MOVEMENT_KEYS)[keyof typeof PLAYER_MOVEMENT_KEYS];

export const PLAYER_MOVEMENT_DIRECTIONS = {
	[PLAYER_MOVEMENT_KEYS.FORWARD]: [0, 0, -1] as const,
	[PLAYER_MOVEMENT_KEYS.BACKWARD]: [0, 0, 1] as const,
	[PLAYER_MOVEMENT_KEYS.LEFT]: [-1, 0, 0] as const,
	[PLAYER_MOVEMENT_KEYS.RIGHT]: [1, 0, 0] as const,
} as const;
