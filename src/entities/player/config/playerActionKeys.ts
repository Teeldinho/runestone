export const PLAYER_ACTION_KEYS = {
	ASSIGN_MOVE_VECTOR: "player.action.assignMoveVector",
	CLEAR_MOVE_VECTOR: "player.action.clearMoveVector",
	REQUEST_JUMP_IMPULSE: "player.action.requestJumpImpulse",
	CLEAR_JUMP_REQUEST: "player.action.clearJumpRequest",
} as const;

export type PlayerActionKey =
	(typeof PLAYER_ACTION_KEYS)[keyof typeof PLAYER_ACTION_KEYS];
