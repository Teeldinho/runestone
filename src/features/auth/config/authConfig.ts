import { STORAGE_KEYS } from "@/shared/config";

export const AUTH_STATUS = {
	CHECKING_SESSION: "checkingSession",
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
	USERNAME_SUBMIT_FAILED: "We could not create your profile. Please try again.",
	MISSING_CONTEXT: "useAuthContext must be used within AuthProvider",
} as const;

export const AUTH_COPY = {
	MODAL_TITLE: "Claim your rune name",
	MODAL_DESCRIPTION:
		"Choose a username to begin your dungeon run. You can use letters, numbers, and underscores.",
	USERNAME_LABEL: "Username",
	USERNAME_PLACEHOLDER: "runestone_hero",
	USERNAME_SUBMIT_LABEL: "Enter Dungeon",
	USERNAME_SUBMITTING_LABEL: "Summoning profile...",
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
