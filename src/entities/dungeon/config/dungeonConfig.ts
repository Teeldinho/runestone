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
		BASE_COLOR: "var(--color-dungeon-stone-base)",
		DETAIL_COLOR: "var(--color-dungeon-stone-detail)",
	},
	LIGHTING: {
		TORCH_COLOR: "var(--color-dungeon-torch)",
		TORCH_INTENSITY: 3.2,
		AMBIENT_INTENSITY: 0.18,
	},
	FOG: {
		COLOR: "var(--color-dungeon-fog)",
		DENSITY: 0.08,
	},
	RUNES: {
		SEALED: "var(--color-dungeon-rune-sealed)",
		OPEN: "var(--color-dungeon-rune-open)",
		ACTIVE: "var(--color-dungeon-rune-active)",
	},
} as const;

export type DungeonTheme = typeof DUNGEON_THEME;
