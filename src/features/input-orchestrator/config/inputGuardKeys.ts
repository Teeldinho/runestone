export const INPUT_GUARD_KEYS = {
	IS_MOVE_EVENT: "input.guard.isMoveEvent",
	IS_RUN_HELD_EVENT: "input.guard.isRunHeldEvent",
	IS_POINTER_OWNER_EVENT: "input.guard.isPointerOwnerEvent",
	HAS_ACTIVE_MOVEMENT: "input.guard.hasActiveMovement",
} as const;

export type InputGuardKey =
	(typeof INPUT_GUARD_KEYS)[keyof typeof INPUT_GUARD_KEYS];
