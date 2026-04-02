import { ENEMY_CONFIG } from "@/shared/config";

export const ENEMY_MACHINE_DEFAULTS = {
	POSITION: [0, 0, 0] as const,
	PLAYER_POSITION: [0, 0, 0] as const,
	HP: ENEMY_CONFIG.MAX_HP,
	MAX_HP: ENEMY_CONFIG.MAX_HP,
} as const;

export const ENEMY_MACHINE_RUNTIME_ERRORS = {
	MISSING_PROVIDER:
		"useEnemyMachineRuntime must be used within EnemyMachineProvider",
} as const;

export const ENEMY_DETECT_DELAY_MS = 500 as const;
