export const GAME_MACHINE_RUNTIME_ERRORS = {
	MISSING_PROVIDER:
		"useGameMachineRuntime must be used within DungeonGameMachineProvider",
} as const;

export const NAVIGATION_INTENTS = {
	MOVE: "move",
	INTERACT: "interact",
	INSPECT: "inspect",
} as const;
