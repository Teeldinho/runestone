import { ROOM_CONFIG } from "@/shared/config";

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
	},
	LABEL: {
		HEIGHT_OFFSET: 7,
	},
} as const;
