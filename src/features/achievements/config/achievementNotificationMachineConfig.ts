export const ACHIEVEMENT_NOTIFICATION_MACHINE_ID = "achievementNotification";

export const ACHIEVEMENT_NOTIFICATION_MACHINE_STATES = {
	IDLE: "idle",
	SHOWING: "showing",
} as const;

export const ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS = {
	SHOW: "SHOW",
	RESET: "RESET",
} as const;

export const ACHIEVEMENT_NOTIFICATION_CONTEXT_KEYS = {
	ACTIVE_ACHIEVEMENT: "activeAchievement",
} as const;
