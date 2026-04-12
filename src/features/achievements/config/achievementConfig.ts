export const ACHIEVEMENT_IDS = {
	FIRST_STEPS: "FIRST_STEPS",
	KEY_HUNTER: "KEY_HUNTER",
	COMBAT_MASTER: "COMBAT_MASTER",
	ESCAPE_ARTIST: "ESCAPE_ARTIST",
} as const;

export const ACHIEVEMENT_COPY = {
	FIRST_STEPS: {
		label: "First Steps",
		description: "Explored the Library",
	},
	KEY_HUNTER: {
		label: "Key Hunter",
		description: "Collected the treasure key",
	},
	COMBAT_MASTER: {
		label: "Combat Master",
		description: "Defeated all enemies",
	},
	ESCAPE_ARTIST: {
		label: "Escape Artist",
		description: "Escaped the dungeon",
	},
} as const;

export const ACHIEVEMENT_DISPLAY_DURATION_MS = 3000;

export const ACHIEVEMENT_NOTIFICATION_BADGE_LABEL = "Achievement Unlocked";
