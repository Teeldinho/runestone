export const INPUT_STATE_KEYS = {
	READY: "ready",

	MOVEMENT_REGION: "movementRegion",
	MOVEMENT_IDLE: "movementIdle",
	MOVEMENT_ACTIVE: "movementActive",

	RUN_TOGGLE_REGION: "runToggleRegion",
	RUN_TOGGLE_OFF: "runToggleOff",
	RUN_TOGGLE_ON: "runToggleOn",
} as const;

export type InputStateKey =
	(typeof INPUT_STATE_KEYS)[keyof typeof INPUT_STATE_KEYS];
