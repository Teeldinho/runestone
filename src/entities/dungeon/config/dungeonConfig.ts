export const ROOM_IDS = {
	ENTRANCE: "entrance",
	LIBRARY: "library",
	GUARD_ROOM: "guardRoom",
	TREASURY: "treasury",
	EXIT: "exit",
} as const;

export type RoomId = (typeof ROOM_IDS)[keyof typeof ROOM_IDS];

export const ROOM_LABELS: Record<RoomId, string> = {
	[ROOM_IDS.ENTRANCE]: "Entrance",
	[ROOM_IDS.LIBRARY]: "Library",
	[ROOM_IDS.GUARD_ROOM]: "Guard Room",
	[ROOM_IDS.TREASURY]: "Treasury",
	[ROOM_IDS.EXIT]: "Exit",
};

export const FLOOR_IDS = {
	FLOOR_ONE: "floor-one",
} as const;

export type FloorId = (typeof FLOOR_IDS)[keyof typeof FLOOR_IDS];

export const DUNGEON_DEFAULTS = {
	INITIAL_ENEMIES_REMAINING: 1,
} as const;

export const DUNGEON_RUNE_STATES = {
	SEALED: "sealed",
	OPEN: "open",
	ACTIVE: "active",
} as const;

export type DungeonRuneState =
	(typeof DUNGEON_RUNE_STATES)[keyof typeof DUNGEON_RUNE_STATES];

export const DUNGEON_THEME = {
	STONE: {
		BASE_COLOR: "#4a596b",
		DETAIL_COLOR: "#5f7085",
	},
	LIGHTING: {
		TORCH_COLOR: "#ffbb7a",
		TORCH_INTENSITY: 1.35,
		AMBIENT_INTENSITY: 0.55,
	},
	FOG: {
		COLOR: "#06090f",
		DENSITY: 0.018,
	},
	RUNES: {
		SEALED: "#ff2ecf",
		OPEN: "#f5c451",
		ACTIVE: "#00d7ff",
	},
} as const;

export type DungeonTheme = typeof DUNGEON_THEME;
