export const TOUCH_JOYSTICK_POINTER_PHASES = {
	DOWN: "down",
	MOVE: "move",
	UP: "up",
	CANCEL: "cancel",
} as const;

export type TouchJoystickPointerPhase =
	(typeof TOUCH_JOYSTICK_POINTER_PHASES)[keyof typeof TOUCH_JOYSTICK_POINTER_PHASES];

export const TOUCH_JOYSTICK_POINTER_ACTIONS = {
	ACTIVATE: "activate",
	UPDATE: "update",
	RELEASE: "release",
	IGNORE: "ignore",
} as const;

export type TouchJoystickPointerAction =
	(typeof TOUCH_JOYSTICK_POINTER_ACTIONS)[keyof typeof TOUCH_JOYSTICK_POINTER_ACTIONS];
