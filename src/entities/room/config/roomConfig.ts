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

export const ROOM_GEOMETRY = {
	HALF_WIDTH: 6,
	HALF_DEPTH: 6,
	WALL_Y: 0,
	WALL_TILE_POSITIONS: [-4, 0, 4] as const,
	TORCH_INSET: 0.2,
} as const;

export const ROOM_WALL_LAYOUT = {
	north: { rotationY: 0, isNorthSouth: true, offsetSign: -1 },
	south: { rotationY: Math.PI, isNorthSouth: true, offsetSign: 1 },
	east: { rotationY: -Math.PI / 2, isNorthSouth: false, offsetSign: 1 },
	west: { rotationY: Math.PI / 2, isNorthSouth: false, offsetSign: -1 },
} as const;

export type RoomWallSide = keyof typeof ROOM_WALL_LAYOUT;

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
		ROUGHNESS: 0.45,
		METALNESS: 0.55,
	},
	COLLIDERS: {
		COLUMN: {
			HALF_WIDTH: 0.42,
			HALF_HEIGHT: 1.6,
			HALF_DEPTH: 0.42,
			POSITION_Y: 1.6,
		},
		TREASURY_CHEST: {
			POSITION_Z_RATIO: 0.25,
			HALF_WIDTH: 0.72,
			HALF_HEIGHT: 0.52,
			HALF_DEPTH: 0.46,
			POSITION_Y: 0.52,
		},
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
	TREASURE_KEY: {
		HEIGHT: 1.15,
		RING_RADIUS: 0.18,
		RING_TUBE_RADIUS: 0.03,
		RING_RADIAL_SEGMENTS: 16,
		RING_TUBULAR_SEGMENTS: 24,
		SHAFT_LENGTH: 0.34,
		SHAFT_RADIUS: 0.03,
		SHAFT_RADIAL_SEGMENTS: 12,
		TOOTH_WIDTH: 0.08,
		TOOTH_HEIGHT: 0.11,
		TOOTH_DEPTH: 0.05,
		COLOR: DUNGEON_THEME_COLORS.RUNE_OPEN,
		EMISSIVE_INTENSITY: 0.9,
		RING_METALNESS: 0.8,
		RING_ROUGHNESS: 0.25,
		SHAFT_METALNESS: 0.85,
		SHAFT_ROUGHNESS: 0.2,
		TOOTH_METALNESS: 0.8,
		TOOTH_ROUGHNESS: 0.25,
	},
	LABEL: {
		TEXT: "Rune Chamber",
		COLOR: DUNGEON_THEME_COLORS.ROOM_LABEL,
		FONT_SIZE: 0.42,
		HEIGHT_OFFSET: 7,
		DISTANCE_FACTOR: 14,
		DOM_Z_INDEX_RANGE: [8, 0] as const,
		MAX_WIDTH: 10,
		OUTLINE_COLOR: DUNGEON_THEME_COLORS.FOG_BASE,
		OUTLINE_WIDTH: 0.025,
	},
	GEOMETRY: {
		EDGE_DIVISOR: 2,
	},
} as const;
