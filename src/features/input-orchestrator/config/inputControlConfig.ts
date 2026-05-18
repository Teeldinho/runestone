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
} as const;

export const INPUT_KEYBOARD_EVENT_NAMES = {
	KEY_DOWN: "keydown",
	KEY_UP: "keyup",
} as const;

export const INPUT_MOVEMENT_CONFIG = {
	MOVEMENT_EPSILON: 0.001,
} as const;
