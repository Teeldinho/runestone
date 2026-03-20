export const ROOM_IDS = {
	ENTRANCE: "entrance",
	LIBRARY: "library",
	GUARD_ROOM: "guardRoom",
	TREASURY: "treasury",
	EXIT: "exit",
} as const;

export type RoomId = (typeof ROOM_IDS)[keyof typeof ROOM_IDS];

export const FLOOR_IDS = {
	FLOOR_ONE: "floor-one",
} as const;

export type FloorId = (typeof FLOOR_IDS)[keyof typeof FLOOR_IDS];

export const DUNGEON_THEME = {
	STONE: {
		BASE_COLOR: "#0f1319",
		DETAIL_COLOR: "#1b2430",
	},
	LIGHTING: {
		TORCH_COLOR: "#ffb347",
		TORCH_INTENSITY: 3.2,
		AMBIENT_INTENSITY: 0.18,
	},
	FOG: {
		COLOR: "#06090f",
		DENSITY: 0.08,
	},
	RUNES: {
		SEALED: "#ff2ecf",
		OPEN: "#f5c451",
		ACTIVE: "#00d7ff",
	},
} as const;

export type DungeonTheme = typeof DUNGEON_THEME;
