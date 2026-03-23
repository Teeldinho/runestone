export const ENEMY_EVENTS = {
	UPDATE_PLAYER_POSITION: "UPDATE_PLAYER_POSITION",
	TAKE_DAMAGE: "TAKE_DAMAGE",
} as const;

export type EnemyEvent = (typeof ENEMY_EVENTS)[keyof typeof ENEMY_EVENTS];
