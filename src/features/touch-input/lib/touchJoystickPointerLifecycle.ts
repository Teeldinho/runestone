import {
	TOUCH_JOYSTICK_POINTER_ACTIONS,
	TOUCH_JOYSTICK_POINTER_PHASES,
	type TouchJoystickPointerAction,
	type TouchJoystickPointerPhase,
} from "../config";

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
