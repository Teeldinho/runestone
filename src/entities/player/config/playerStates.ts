export const PLAYER_STATES = {
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
