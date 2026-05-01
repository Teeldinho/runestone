import { STORAGE_KEYS } from "@/shared/config";

export const AUTH_STATUS = {
	CHECKING_SESSION: "checkingSession",
	BOOTSTRAP_FAILED: "bootstrapFailed",
	REQUIRES_USERNAME: "requiresUsername",
	SUBMITTING_USERNAME: "submittingUsername",
	AUTHENTICATED: "authenticated",
} as const;

export const USERNAME_RULES = {
	MIN_LENGTH: 3,
	MAX_LENGTH: 20,
} as const;

export const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

export const AUTH_ERROR_MESSAGES = {
	SESSION_BOOTSTRAP_FAILED: "We could not load your profile right now.",
	USERNAME_SUBMIT_FAILED: "We could not create your profile. Please try again.",
	MISSING_CONTEXT: "useAuthContext must be used within AuthProvider",
} as const;

export const AUTH_COPY = {
	MODAL_TITLE: "Choose your name",
	MODAL_DESCRIPTION:
		"Pick a name to save your progress and show on the leaderboard.",
	USERNAME_LABEL: "Name",
	USERNAME_PLACEHOLDER: "Your name",
	USERNAME_SUBMIT_LABEL: "Save and enter",
	USERNAME_SUBMITTING_LABEL: "Saving your name...",
	USERNAME_HELP_TEXT:
		"3-20 characters. Letters, numbers, and underscores only.",
	USERNAME_VALIDATION_ERROR: "Use 3-20 letters, numbers, or underscores.",
	READY_STATUS_PREFIX: "Signed in as",
} as const;

export const AUTH_ROUTE_PATHS = {
	HOME: "/",
	GAME: "/game",
	TUTORIAL: "/tutorial",
} as const;

export const AUTH_STORAGE_KEYS = {
	SESSION_UUID: STORAGE_KEYS.SESSION_UUID,
	USERNAME: STORAGE_KEYS.USERNAME,
} as const;

export const AUTH_MACHINE_ID = "authMachine";
