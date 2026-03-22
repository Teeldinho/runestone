import { CORRIDOR_CONFIG } from "@/shared/config";

export const CORRIDOR_DIRECTIONS = {
	NORTH: "north",
	EAST: "east",
	SOUTH: "south",
	WEST: "west",
} as const;

export const CORRIDOR_DIRECTION_ORDER = [
	CORRIDOR_DIRECTIONS.NORTH,
	CORRIDOR_DIRECTIONS.EAST,
	CORRIDOR_DIRECTIONS.SOUTH,
	CORRIDOR_DIRECTIONS.WEST,
] as const;

export const CORRIDOR_ENTITY_CONFIG = {
	DIMENSIONS: {
		width: CORRIDOR_CONFIG.WIDTH,
		height: CORRIDOR_CONFIG.HEIGHT,
		depth: CORRIDOR_CONFIG.DEPTH,
	},
	SURFACE: {
		BASE_COLOR: "var(--color-dungeon-stone-detail)",
		METALNESS: 0.14,
		ROUGHNESS: 0.86,
		SLAB_HEIGHT: 0.24,
		Y_OFFSET: -0.1,
	},
} as const;
