import { describe, expect, it } from "vitest";

import {
	TOUCH_JOYSTICK_CONFIG,
	TOUCH_JOYSTICK_POINTER_ACTIONS,
	TOUCH_JOYSTICK_POINTER_PHASES,
} from "../config";
import {
	resolveTouchJoystickVectorFromPointer,
	shouldHandleTouchJoystickPointerAction,
} from "./touchJoystickRuntime";

describe("touchJoystickRuntime", () => {
	it("resolves joystick vector from pointer using joystick bounds", () => {
		const joystickVector = resolveTouchJoystickVectorFromPointer({
			clientX:
				TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX / 2 +
				TOUCH_JOYSTICK_CONFIG.MAX_RADIUS_PX,
			clientY: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX / 2,
			joystickBounds: {
				left: 0,
				top: 0,
				width: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
				height: TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX,
			},
			maxRadiusPx: TOUCH_JOYSTICK_CONFIG.MAX_RADIUS_PX,
			deadZoneRatio: TOUCH_JOYSTICK_CONFIG.DEAD_ZONE_RATIO,
		});

		expect(joystickVector.knobOffsetX).toBe(
			TOUCH_JOYSTICK_CONFIG.MAX_RADIUS_PX,
		);
		expect(joystickVector.knobOffsetY).toBe(0);
		expect(joystickVector.hasMovement).toBe(true);
		expect(joystickVector.velocity).toEqual([1, 0, 0]);
	});

	it("matches pointer action handling against expected lifecycle action", () => {
		expect(
			shouldHandleTouchJoystickPointerAction({
				activePointerId: null,
				eventPointerId: 1,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.DOWN,
				expectedAction: TOUCH_JOYSTICK_POINTER_ACTIONS.ACTIVATE,
			}),
		).toBe(true);

		expect(
			shouldHandleTouchJoystickPointerAction({
				activePointerId: 1,
				eventPointerId: 2,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.MOVE,
				expectedAction: TOUCH_JOYSTICK_POINTER_ACTIONS.UPDATE,
			}),
		).toBe(false);

		expect(
			shouldHandleTouchJoystickPointerAction({
				activePointerId: 1,
				eventPointerId: 1,
				phase: TOUCH_JOYSTICK_POINTER_PHASES.CANCEL,
				expectedAction: TOUCH_JOYSTICK_POINTER_ACTIONS.RELEASE,
			}),
		).toBe(true);
	});
});
