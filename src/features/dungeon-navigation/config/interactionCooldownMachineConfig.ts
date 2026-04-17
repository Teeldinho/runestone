export const INTERACTION_COOLDOWN_MACHINE_ID = "interactionCooldown";

export const INTERACTION_COOLDOWN_MACHINE_STATES = {
	READY: "ready",
	COOLDOWN: "cooldown",
} as const;

export const INTERACTION_COOLDOWN_MACHINE_EVENTS = {
	START_INTERACT: "START_INTERACT",
	START_ATTACK: "START_ATTACK",
	RESET: "RESET",
} as const;

export const INTERACTION_COOLDOWN_MACHINE_CONTEXT_KEYS = {
	COOLDOWN_MS: "cooldownMs",
} as const;

export const INTERACTION_COOLDOWN_MACHINE_DELAYS = {
	RELEASE: "releaseCooldown",
} as const;

export const INTERACTION_COOLDOWN_MACHINE_DEFAULT_MS = 0;
