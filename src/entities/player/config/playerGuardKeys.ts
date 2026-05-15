export const PLAYER_GUARD_KEYS = {
	WANTS_RUN: "player.guard.wantsRun",
	CAN_JUMP: "player.guard.canJump",
} as const;

export type PlayerGuardKey =
	(typeof PLAYER_GUARD_KEYS)[keyof typeof PLAYER_GUARD_KEYS];
