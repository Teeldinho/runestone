export type { PointerRole } from "@/shared/config";
export {
	INPUT_POINTER_DATA_ATTRIBUTE_VALUES,
	INPUT_POINTER_DATA_ATTRIBUTES,
	POINTER_ROLES,
} from "@/shared/config";

export const INPUT_KEYBOARD_CODES = {
	SHIFT_LEFT: "ShiftLeft",
	SHIFT_RIGHT: "ShiftRight",
	SPACE: "Space",
	KEY_E: "KeyE",
	KEY_F: "KeyF",
	MOUSE_PRIMARY: "MousePrimary",
} as const;

export const MOBILE_RUN_CONFIG = {
	WALK_MAGNITUDE_MAX: 0.72,
	RUN_MAGNITUDE_MIN: 0.73,
} as const;

export const INPUT_MOVEMENT_CONFIG = {
	MOVEMENT_EPSILON: 0.001,
} as const;

export const INPUT_VECTOR_DEFAULTS = {
	ZERO_X: 0,
	ZERO_Y: 0,
	ZERO_Z: 0,
} as const;

export const TOUCH_CONTROL_CLASS_NAMES = {
	TOUCH_NONE: "touch-none",
	SELECT_NONE: "select-none",
	POINTER_EVENTS_AUTO: "pointer-events-auto",
} as const;
