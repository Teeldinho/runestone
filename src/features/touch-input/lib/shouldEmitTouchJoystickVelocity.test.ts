import { describe, expect, it } from "vitest";

import { TOUCH_JOYSTICK_CONFIG } from "../config";
import { shouldEmitTouchJoystickVelocity } from "./shouldEmitTouchJoystickVelocity";

describe("shouldEmitTouchJoystickVelocity", () => {
	it("emits when there is no previous velocity", () => {
		expect(
			shouldEmitTouchJoystickVelocity({
				nextVelocity: [1, 0, 0],
				previousVelocity: null,
				threshold: TOUCH_JOYSTICK_CONFIG.VELOCITY_CHANGE_THRESHOLD,
			}),
		).toBe(true);
	});

	it("does not emit when the velocity delta stays within threshold", () => {
		expect(
			shouldEmitTouchJoystickVelocity({
				nextVelocity: [0.25, 0.5, 0],
				previousVelocity: [0.249, 0.499, 0],
				threshold: TOUCH_JOYSTICK_CONFIG.VELOCITY_CHANGE_THRESHOLD,
			}),
		).toBe(false);
	});

	it("emits when any velocity axis crosses the threshold", () => {
		expect(
			shouldEmitTouchJoystickVelocity({
				nextVelocity: [0.4, 0.5, 0],
				previousVelocity: [0.1, 0.5, 0],
				threshold: TOUCH_JOYSTICK_CONFIG.VELOCITY_CHANGE_THRESHOLD,
			}),
		).toBe(true);
	});
});
