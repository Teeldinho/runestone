export const INPUT_GUARD_KEYS = {
	HAS_ACTIVE_MOVEMENT: "input.guard.hasActiveMovement",
} as const;

export type InputGuardKey =
	(typeof INPUT_GUARD_KEYS)[keyof typeof INPUT_GUARD_KEYS];
