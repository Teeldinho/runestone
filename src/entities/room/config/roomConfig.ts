import { DUNGEON_THEME_COLORS, ROOM_CONFIG } from "@/shared/config";

export const ROOM_LIGHT_CONFIG = {
	INTENSITY: 3.6,
	DISTANCE: 22,
	DECAY: 2,
	HEIGHT: 3.0,
	COLOR: DUNGEON_THEME_COLORS.TORCH_LIGHT,
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

export const ROOM_FLOOR_COLLIDER = {
	HALF_HEIGHT: 0.3,
	POSITION_Y: -0.3,
} as const;

export const ROOM_ENTITY_CONFIG = {
	DIMENSIONS: {
		width: ROOM_CONFIG.WIDTH,
		height: ROOM_CONFIG.HEIGHT,
		depth: ROOM_CONFIG.DEPTH,
	},
	DOORWAY_GATE: {
		WIDTH: 2.7,
		HEIGHT: 3.2,
		THICKNESS: 0.35,
		POSITION_Y: 1.6,
		COLOR: DUNGEON_THEME_COLORS.DOORWAY_GATE,
		EMISSIVE: DUNGEON_THEME_COLORS.DOORWAY_GATE_EMISSIVE,
		EMISSIVE_INTENSITY: 0.28,
	},
	ORIGIN: [0, 0, 0] as const,
	TORCH: {
		HEIGHT: 2.2,
		INSET: 4,
		COLOR: DUNGEON_THEME_COLORS.TORCH_FLAME,
		ORB_RADIUS: 0.08,
		ORB_WIDTH_SEGMENTS: 10,
		ORB_HEIGHT_SEGMENTS: 10,
		ORB_EMISSIVE_INTENSITY: 1.4,
	},
	LABEL: {
		TEXT: "Rune Chamber",
		COLOR: DUNGEON_THEME_COLORS.ROOM_LABEL,
		FONT_SIZE: 0.42,
		HEIGHT_OFFSET: 7,
		DISTANCE_FACTOR: 12,
		MAX_WIDTH: 10,
		OUTLINE_COLOR: DUNGEON_THEME_COLORS.FOG_BASE,
		OUTLINE_WIDTH: 0.025,
	},
	GEOMETRY: {
		EDGE_DIVISOR: 2,
	},
} as const;
