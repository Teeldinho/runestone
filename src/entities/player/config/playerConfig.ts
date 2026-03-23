import type { Vector3Tuple } from "@/shared/types";
import type { PlayerHealthState } from "../model";

const PLAYER_AURA_STYLES_BY_HEALTH: Record<
	PlayerHealthState,
	{
		color: string;
		emissiveIntensity: number;
	}
> = {
	alive: {
		color: "var(--color-dungeon-rune-active)",
		emissiveIntensity: 1.25,
	},
	damaged: {
		color: "var(--color-dungeon-torch)",
		emissiveIntensity: 1.1,
	},
	dead: {
		color: "var(--color-dungeon-fog)",
		emissiveIntensity: 0.15,
	},
};

const PLAYER_ORIGIN: Vector3Tuple = [0, 0, 0];

export const PLAYER_ENTITY_CONFIG = {
	MOVEMENT: {
		SPEED: 5,
	},
	ORIGIN: PLAYER_ORIGIN,
	DEFAULTS: {
		HEALTH_STATE: "alive" as PlayerHealthState,
	},
	TRANSFORM: {
		SPAWN_HEIGHT_OFFSET: 0.45,
	},
	BODY: {
		COLOR: "var(--color-panel-title)",
		HEIGHT: 0.9,
		METALNESS: 0.22,
		POSITION_Y: 0.45,
		RADIUS: 0.24,
		RADIAL_SEGMENTS: 16,
		ROUGHNESS: 0.56,
	},
	HEAD: {
		COLOR: "var(--color-dungeon-rune-open)",
		HEIGHT_SEGMENTS: 16,
		OFFSET_Y: 0.9,
		RADIUS: 0.17,
		WIDTH_SEGMENTS: 16,
	},
	AURA: {
		MATERIAL_OPACITY: 0.85,
		OFFSET_Y: 0.08,
		RADIAL_SEGMENTS: 20,
		RADIUS: 0.35,
		ROTATION_X_RAD: Math.PI / 2,
		TUBULAR_SEGMENTS: 32,
		TUBE_RADIUS: 0.05,
	},
	AURA_STYLES_BY_HEALTH: PLAYER_AURA_STYLES_BY_HEALTH,
} as const;
