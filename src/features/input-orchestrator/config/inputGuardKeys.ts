export const INPUT_GUARD_KEYS = {
	IS_MOVE_EVENT: "input.guard.isMoveEvent",
	IS_LOOK_EVENT: "input.guard.isLookEvent",
	IS_ZOOM_EVENT: "input.guard.isZoomEvent",
	IS_RUN_HELD_EVENT: "input.guard.isRunHeldEvent",
	IS_POINTER_OWNER_EVENT: "input.guard.isPointerOwnerEvent",
} as const;

export type InputGuardKey =
	(typeof INPUT_GUARD_KEYS)[keyof typeof INPUT_GUARD_KEYS];
