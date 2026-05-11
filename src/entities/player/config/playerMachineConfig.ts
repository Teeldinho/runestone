export const PLAYER_GUARDS = {
	IS_LETHAL_DAMAGE: "isLethalDamage",
	IS_PLAYER_ALIVE: "isPlayerAlive",
} as const;

export const PLAYER_CONTEXT_KEYS = {
	IS_SPRINTING: "isSprinting",
	POSITION: "position",
	VELOCITY: "velocity",
	STATS: "stats",
	MOVE_VECTOR: "moveVector",
	IS_RUN_HELD: "isRunHeld",
	WANTS_JUMP_IMPULSE: "wantsJumpImpulse",
} as const;
