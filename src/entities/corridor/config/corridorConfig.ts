import { CORRIDOR_CONFIG, DUNGEON_THEME_COLORS } from "@/shared/config";

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

export const CORRIDOR_GLTF_CONFIG = {
	WALL: {
		PATH: "/models/dungeon/wall.gltf",
		SCALE: [1, 1, 1] as const,
	},
	WALL_CRACKED: {
		PATH: "/models/dungeon/wall_cracked.gltf",
		SCALE: [1, 1, 1] as const,
	},
	WALL_SHELVES: {
		PATH: "/models/dungeon/wall_shelves.gltf",
		SCALE: [1, 1, 1] as const,
	},
	FLOOR_TILE: {
		PATH: "/models/dungeon/floor_tile_small.gltf",
		TILE_SIZE: 1,
		SCALE: [1, 1, 1] as const,
	},
	TORCH: {
		PATH: "/models/dungeon/torch_mounted.gltf",
		SCALE: [1, 1, 1] as const,
	},
} as const;

export const CORRIDOR_ENTITY_CONFIG = {
	DIMENSIONS: {
		width: CORRIDOR_CONFIG.WIDTH,
		height: CORRIDOR_CONFIG.HEIGHT,
		depth: CORRIDOR_CONFIG.DEPTH,
		WALL_HEIGHT: 3,
	},
	GEOMETRY: {
		CENTER_OFFSET_DIVISOR: 2,
		HORIZONTAL_ROTATION_Y_RAD: Math.PI / 2,
	},
	SURFACE: {
		BASE_COLOR: DUNGEON_THEME_COLORS.CORRIDOR_SURFACE_BASE,
		METALNESS: 0.14,
		ROUGHNESS: 0.86,
		SLAB_HEIGHT: 0.24,
		Y_OFFSET: -0.12,
	},
} as const;

export const CORRIDOR_FLOOR_COLLIDER = {
	HALF_HEIGHT: 0.3,
	POSITION_Y: -0.18,
} as const;

export const CORRIDOR_LIGHT_CONFIG = {
	INTENSITY: 4.6,
	DECAY: 2,
	HEIGHT: 2.0,
	COLOR: DUNGEON_THEME_COLORS.TORCH_LIGHT,
} as const;
