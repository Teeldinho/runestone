export const PLAYER_STATES = {
	REGIONS: {
		MOVEMENT: "movement",
		HEALTH: "health",
		AIRBORNE: "airborne",
	} as const,
	MOVEMENT: {
		IDLE: "idle",
		WALKING: "walking",
		RUNNING: "running",
	} as const,
	AIRBORNE: {
		GROUNDED: "grounded",
		JUMPING: "jumping",
		FALLING: "falling",
	} as const,
	HEALTH: {
		ALIVE: "alive",
		DAMAGED: "damaged",
		DEAD: "dead",
	} as const,
} as const;

export const PLAYER_MACHINE_ID = "playerMachine" as const;

export type PlayerHealthState =
	(typeof PLAYER_STATES.HEALTH)[keyof typeof PLAYER_STATES.HEALTH];

export type PlayerMovementState =
	| (typeof PLAYER_STATES.MOVEMENT)[keyof typeof PLAYER_STATES.MOVEMENT]
	| (typeof PLAYER_STATES.AIRBORNE)[keyof typeof PLAYER_STATES.AIRBORNE];
