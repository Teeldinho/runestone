export const PLAYER_GUARD_KEYS = {
	CAN_MOVE_RUNNING: "player.guard.canMoveRunning",
	CAN_MOVE_WALKING: "player.guard.canMoveWalking",
} as const;

export type PlayerGuardKey =
	(typeof PLAYER_GUARD_KEYS)[keyof typeof PLAYER_GUARD_KEYS];
