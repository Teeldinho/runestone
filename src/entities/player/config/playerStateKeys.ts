export const PLAYER_STATE_KEYS = {
	READY: "ready",

	LOCOMOTION_REGION: "locomotionRegion",
	IDLE: "idle",
	WALKING: "walking",
	RUNNING: "running",

	AIRBORNE_REGION: "airborneRegion",
	GROUNDED: "grounded",
	JUMPING: "jumping",
	FALLING: "falling",

	VITALITY_REGION: "vitalityRegion",
	HEALTHY: "healthy",
	DAMAGED: "damaged",
	DEAD: "dead",
} as const;

export type PlayerStateKey =
	(typeof PLAYER_STATE_KEYS)[keyof typeof PLAYER_STATE_KEYS];
