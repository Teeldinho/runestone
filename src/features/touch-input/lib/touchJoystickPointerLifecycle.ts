const TOUCH_JOYSTICK_POINTER_PHASES = {
	DOWN: "down",
	MOVE: "move",
	UP: "up",
	CANCEL: "cancel",
} as const;

const TOUCH_JOYSTICK_POINTER_ACTIONS = {
	ACTIVATE: "activate",
	UPDATE: "update",
	RELEASE: "release",
	IGNORE: "ignore",
} as const;

type TouchJoystickPointerPhase =
	(typeof TOUCH_JOYSTICK_POINTER_PHASES)[keyof typeof TOUCH_JOYSTICK_POINTER_PHASES];

type TouchJoystickPointerAction =
	(typeof TOUCH_JOYSTICK_POINTER_ACTIONS)[keyof typeof TOUCH_JOYSTICK_POINTER_ACTIONS];

const shouldUpdatePointer = (
	activePointerId: number | null,
	eventPointerId: number,
): boolean => {
	return activePointerId !== null && eventPointerId === activePointerId;
};

export const resolveTouchJoystickPointerAction = ({
	activePointerId,
	eventPointerId,
	phase,
}: {
	activePointerId: number | null;
	eventPointerId: number;
	phase: TouchJoystickPointerPhase;
}): TouchJoystickPointerAction => {
	if (phase === TOUCH_JOYSTICK_POINTER_PHASES.DOWN) {
		return activePointerId === null
			? TOUCH_JOYSTICK_POINTER_ACTIONS.ACTIVATE
			: TOUCH_JOYSTICK_POINTER_ACTIONS.IGNORE;
	}

	if (phase === TOUCH_JOYSTICK_POINTER_PHASES.MOVE) {
		return shouldUpdatePointer(activePointerId, eventPointerId)
			? TOUCH_JOYSTICK_POINTER_ACTIONS.UPDATE
			: TOUCH_JOYSTICK_POINTER_ACTIONS.IGNORE;
	}

	return shouldUpdatePointer(activePointerId, eventPointerId)
		? TOUCH_JOYSTICK_POINTER_ACTIONS.RELEASE
		: TOUCH_JOYSTICK_POINTER_ACTIONS.IGNORE;
};

export type { TouchJoystickPointerAction, TouchJoystickPointerPhase };
export { TOUCH_JOYSTICK_POINTER_ACTIONS, TOUCH_JOYSTICK_POINTER_PHASES };
