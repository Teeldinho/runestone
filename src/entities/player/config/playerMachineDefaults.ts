export const PLAYER_MACHINE_RUNTIME_ERRORS = {
	MISSING_PROVIDER:
		"usePlayerMachineRuntime must be used within PlayerMachineProvider",
} as const;

export const PLAYER_MACHINE_DEFAULTS = {
	POSITION: [0, 0, 0] as const,
	VELOCITY: [0, 0, 0] as const,
	STATS: {
		MAX_HP: 100,
		HP: 100,
		SCORE: 0,
		KEY_COUNT: 0,
		CHAIN_MULTIPLIER: 1,
	},
} as const;
