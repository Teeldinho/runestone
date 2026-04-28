import { DUNGEON_EVENTS } from "@/entities/dungeon";

export const HUD_DISPLAY_VARIANTS = {
	BADGE: "badge",
	TEXT: "text",
} as const;

export const HUD_COPY = {
	ACTIONS: {
		TITLE: "Actions",
		RESET_BUTTON: "Reset Run",
	},
	DISCOVERED_ROOMS: {
		TITLE: "Discovered Rooms",
	},
	MACHINE_SNAPSHOT: {
		TITLE: "Machine Snapshot",
	},
	SNAPSHOT_LABELS: {
		CURRENT_ROOM: "Current Room",
		ENEMIES_REMAINING: "Enemies Remaining",
		NEAR_INTERACTABLE: "Near Interactable",
		PLAYER_HP: "Player HP",
		TREASURE_KEY: "Treasure Key",
	},
} as const;

export const HUD_EVENT_FILTERS = {
	SIDEBAR_EXCLUDED_EVENT_TYPES: [
		DUNGEON_EVENTS.PICK_UP_KEY,
		DUNGEON_EVENTS.ENEMY_DIED,
	] as readonly string[],
} as const;

export const HUD_HEALTH = {
	LOW_HP_THRESHOLD_PERCENT: 30,
	PERCENT_MAX: 100,
	PERCENT_MIN: 0,
} as const;

export const HUD_LABELS = {
	VITALITY: "VITALITY",
} as const;

export const HUD_MACHINE_SNAPSHOT = {
	SIDEBAR_EXCLUDED_LABELS: [
		HUD_COPY.SNAPSHOT_LABELS.PLAYER_HP,
	] as readonly string[],
} as const;
