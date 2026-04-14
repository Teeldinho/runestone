export const LOW_HP_THRESHOLD_PERCENT = 30;

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
		PLAYER_HP: "Player HP",
		ROOM_STATE: "Room State",
		TREASURE_KEY: "Treasure Key",
	},
	VITALITY: "VITALITY",
} as const;
