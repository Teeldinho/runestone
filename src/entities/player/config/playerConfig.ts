import type { Vector3Tuple } from "@/shared/types";

import type { PlayerHealthState } from "./playerStates";
import { PLAYER_STATES } from "./playerStates";

const PLAYER_AURA_STYLES_BY_HEALTH: Record<
	PlayerHealthState,
	{
		color: string;
		emissiveIntensity: number;
	}
> = {
	[PLAYER_STATES.HEALTH.ALIVE]: {
		color: "#00d7ff",
		emissiveIntensity: 2.0,
	},
	[PLAYER_STATES.HEALTH.DAMAGED]: {
		color: "#ffb347",
		emissiveIntensity: 1.1,
	},
	[PLAYER_STATES.HEALTH.DEAD]: {
		color: "#06090f",
		emissiveIntensity: 0.15,
	},
};

const PLAYER_ORIGIN: Vector3Tuple = [0, 0, 0];

export const PLAYER_ENTITY_CONFIG = {
	MOVEMENT: {
		SPEED: 7,
		SPRINT_SPEED: 11,
	},
	ORIGIN: PLAYER_ORIGIN,
	DEFAULTS: {
		HEALTH_STATE: PLAYER_STATES.HEALTH.ALIVE,
	},
	CAPSULE: {
		HALF_HEIGHT: 0.55,
		RADIUS: 0.35,
	},
	PHYSICS: {
		LINEAR_DAMPING: 12,
	},
	TRANSFORM: {
		SPAWN_HEIGHT_OFFSET: 1.5,
	},
	BODY: {
		COLOR: "#a5f3fc",
		HEIGHT: 1.5,
		METALNESS: 0.22,
		POSITION_Y: 0.75,
		RADIUS: 0.38,
		RADIAL_SEGMENTS: 16,
		ROUGHNESS: 0.56,
	},
	HEAD: {
		COLOR: "#f5c451",
		HEIGHT_SEGMENTS: 16,
		OFFSET_Y: 1.65,
		RADIUS: 0.26,
		WIDTH_SEGMENTS: 16,
	},
	AURA: {
		MATERIAL_OPACITY: 0.85,
		OFFSET_Y: 0.08,
		RADIAL_SEGMENTS: 20,
		RADIUS: 0.55,
		ROTATION_X_RAD: Math.PI / 2,
		TUBULAR_SEGMENTS: 32,
		TUBE_RADIUS: 0.08,
	},
	AURA_STYLES_BY_HEALTH: PLAYER_AURA_STYLES_BY_HEALTH,
} as const;
