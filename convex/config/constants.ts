export const SCORE_LIMITS = {
	LEADERBOARD_MIN_LIMIT: 1,
	LEADERBOARD_MAX_LIMIT: 50,
	SCORE_MIN: 0,
	SCORE_MAX: 200000,
	TIME_MS_MIN: 1,
	TIME_MS_MAX: 7200000,
	ROOMS_DISCOVERED_MIN: 0,
	ROOMS_DISCOVERED_MAX: 50,
} as const;

export const GAME_PROGRESS_LIMITS = {
	SAVE_SLOT_MIN: 1,
	SAVE_SLOT_MAX: 3,
} as const;

export const USERNAME_RULES = {
	MIN_LENGTH: 3,
	MAX_LENGTH: 20,
	PATTERN: /^[A-Za-z0-9_]+$/,
} as const;

export const DISCRIMINATOR_RULES = {
	PREFIX: "#",
	PADDING: 4,
	START: 1,
	LIMIT: 9999,
} as const;

export const BACKEND_ERROR_MESSAGES = {
	SCORE_OUT_OF_BOUNDS: "Score is out of accepted bounds.",
	RUN_TIME_OUT_OF_BOUNDS: "Run time is out of accepted bounds.",
	ROOM_DISCOVERY_OUT_OF_BOUNDS: "Rooms discovered is out of accepted bounds.",
	SAVE_SLOT_OUT_OF_BOUNDS: "Save slot is out of accepted bounds.",
	INVALID_USERNAME:
		"Username must be 3-20 characters and contain only letters, numbers, or underscores.",
	DISCRIMINATOR_EXHAUSTED:
		"No discriminator slots available for this username.",
	USER_NOT_FOUND: "Cannot submit score for unknown user.",
	USER_CREATION_FAILED: "User creation failed.",
} as const;
