import { ROOM_CONFIG } from "@/shared/config";

export const ROOM_LIGHT_CONFIG = {
	INTENSITY: 3,
	DISTANCE: 20,
	DECAY: 2,
	HEIGHT: 3.0,
	COLOR: "#ffb347",
} as const;

export const ROOM_KINDS = {
	START: "start",
	EXPLORATION: "exploration",
	COMBAT: "combat",
	REWARD: "reward",
	EXIT: "exit",
} as const;

export const ROOM_DOOR_GUARDS = {
	NONE: "none",
	KEY_RUNE: "keyRune",
	COMBAT_RUNE: "combatRune",
	PUZZLE_RUNE: "puzzleRune",
} as const;

export const ROOM_GLTF_CONFIG = {
	FLOOR_TILE: {
		PATH: "/models/dungeon/floor_tile_large.gltf",
		TILE_SIZE: 2,
		SCALE: [1, 1, 1] as const,
	},
	WALL: {
		PATH: "/models/dungeon/wall.gltf",
		SCALE: [1, 1, 1] as const,
	},
	WALL_DOORWAY: {
		PATH: "/models/dungeon/wall_doorway.gltf",
		SCALE: [1, 1, 1] as const,
	},
	WALL_CORNER: {
		PATH: "/models/dungeon/wall_corner.gltf",
		SCALE: [1, 1, 1] as const,
	},
	COLUMN: {
		PATH: "/models/dungeon/column.gltf",
		SCALE: [1, 1, 1] as const,
	},
	TORCH: {
		PATH: "/models/dungeon/torch_mounted.gltf",
		SCALE: [1, 1, 1] as const,
	},
	CHEST: {
		PATH: "/models/dungeon/chest_gold.gltf",
		SCALE: [1, 1, 1] as const,
	},
} as const;

export const ROOM_ENTITY_CONFIG = {
	DIMENSIONS: {
		width: ROOM_CONFIG.WIDTH,
		height: ROOM_CONFIG.HEIGHT,
		depth: ROOM_CONFIG.DEPTH,
	},
	ORIGIN: [0, 0, 0] as const,
	TORCH: {
		HEIGHT: 2.2,
		INSET: 4,
		COLOR: "#ffb347",
		ORB_RADIUS: 0.08,
		ORB_WIDTH_SEGMENTS: 10,
		ORB_HEIGHT_SEGMENTS: 10,
		ORB_EMISSIVE_INTENSITY: 1.4,
	},
	LABEL: {
		TEXT: "Rune Chamber",
		COLOR: "#a5f3fc",
		FONT_SIZE: 0.42,
		HEIGHT_OFFSET: 7,
		DISTANCE_FACTOR: 12,
		MAX_WIDTH: 10,
		OUTLINE_COLOR: "#06090f",
		OUTLINE_WIDTH: 0.025,
	},
	GEOMETRY: {
		EDGE_DIVISOR: 2,
	},
} as const;
