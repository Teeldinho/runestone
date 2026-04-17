import { describe, expect, it } from "vitest";

import {
	TOUCH_JOYSTICK_POINTER_ACTIONS,
	TOUCH_JOYSTICK_POINTER_PHASES,
	resolveTouchJoystickPointerAction,
} from "./touchJoystickPointerLifecycle";

describe("resolveTouchJoystickPointerAction", () => {
	it("returns activate when no pointer is active on pointer down", () => {
		expect(
			resolveTouchJoystickPointerAction({
				activePointerId: null,
				eventPointerId: 4,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.DOWN,
			}),
		).toBe(TOUCH_JOYSTICK_POINTER_ACTIONS.ACTIVATE);
	});

	it("returns ignore when another pointer is already active on pointer down", () => {
		expect(
			resolveTouchJoystickPointerAction({
				activePointerId: 3,
				eventPointerId: 4,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.DOWN,
			}),
		).toBe(TOUCH_JOYSTICK_POINTER_ACTIONS.IGNORE);
	});

	it("returns update only for the active pointer during move", () => {
		expect(
			resolveTouchJoystickPointerAction({
				activePointerId: 7,
				eventPointerId: 7,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.MOVE,
			}),
		).toBe(TOUCH_JOYSTICK_POINTER_ACTIONS.UPDATE);

		expect(
			resolveTouchJoystickPointerAction({
				activePointerId: 7,
				eventPointerId: 9,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.MOVE,
			}),
		).toBe(TOUCH_JOYSTICK_POINTER_ACTIONS.IGNORE);
	});

	it("returns release only for the active pointer on up/cancel", () => {
		expect(
			resolveTouchJoystickPointerAction({
				activePointerId: 2,
				eventPointerId: 2,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.UP,
			}),
		).toBe(TOUCH_JOYSTICK_POINTER_ACTIONS.RELEASE);

		expect(
			resolveTouchJoystickPointerAction({
				activePointerId: 2,
				eventPointerId: 2,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.CANCEL,
			}),
		).toBe(TOUCH_JOYSTICK_POINTER_ACTIONS.RELEASE);

		expect(
			resolveTouchJoystickPointerAction({
				activePointerId: 2,
				eventPointerId: 3,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.CANCEL,
			}),
		).toBe(TOUCH_JOYSTICK_POINTER_ACTIONS.IGNORE);
	});
});
