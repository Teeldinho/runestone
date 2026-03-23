import type { EnemyBehaviorState } from "./enemyMachineStates";
import { ENEMY_MACHINE_STATES } from "./enemyMachineStates";

export const ENEMY_ENTITY_CONFIG = {
	BODY: {
		RADIUS: 0.22,
		HEIGHT: 0.85,
		POSITION_Y: 0.43,
		RADIAL_SEGMENTS: 14,
		COLOR: "var(--color-dungeon-rune-sealed)",
		ROUGHNESS: 0.72,
		METALNESS: 0.18,
	},
	HEAD: {
		RADIUS: 0.16,
		OFFSET_Y: 0.88,
		WIDTH_SEGMENTS: 14,
		HEIGHT_SEGMENTS: 14,
		COLOR: "var(--color-dungeon-torch)",
	},
	GLOW: {
		RADIUS: 0.32,
		TUBE_RADIUS: 0.04,
		RADIAL_SEGMENTS: 18,
		TUBULAR_SEGMENTS: 28,
		OFFSET_Y: 0.06,
		ROTATION_X_RAD: Math.PI / 2,
		MATERIAL_OPACITY: 0.75,
	},
} as const;

export const ENEMY_GLOW_COLORS_BY_STATE: Record<EnemyBehaviorState, string> = {
	[ENEMY_MACHINE_STATES.PATROL]: "var(--color-dungeon-rune-sealed)",
	[ENEMY_MACHINE_STATES.DETECT]: "var(--color-dungeon-torch)",
	[ENEMY_MACHINE_STATES.CHASE]: "var(--color-dungeon-rune-open)",
	[ENEMY_MACHINE_STATES.ATTACK]: "var(--color-dungeon-rune-active)",
	[ENEMY_MACHINE_STATES.DEAD]: "var(--color-dungeon-fog)",
};

export const ENEMY_GLOW_EMISSIVE_INTENSITY_BY_STATE: Record<
	EnemyBehaviorState,
	number
> = {
	[ENEMY_MACHINE_STATES.PATROL]: 0.4,
	[ENEMY_MACHINE_STATES.DETECT]: 0.9,
	[ENEMY_MACHINE_STATES.CHASE]: 1.2,
	[ENEMY_MACHINE_STATES.ATTACK]: 1.8,
	[ENEMY_MACHINE_STATES.DEAD]: 0.05,
};
