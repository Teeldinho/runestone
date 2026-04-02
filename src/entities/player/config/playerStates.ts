export const PLAYER_STATES = {
	REGIONS: {
		MOVEMENT: "movement",
		HEALTH: "health",
	} as const,
	MOVEMENT: {
		IDLE: "idle",
		WALKING: "walking",
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
