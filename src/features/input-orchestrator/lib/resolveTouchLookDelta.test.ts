import { describe, expect, it } from "vitest";

import { TOUCH_LOOK_CONFIG } from "../config";
import { resolveTouchLookDelta } from "./resolveTouchLookDelta";

describe("resolveTouchLookDelta", () => {
	it("returns zero delta when the pointer does not move", () => {
		expect(
			resolveTouchLookDelta({
				current: { x: 0, y: 0 },
				previous: { x: 0, y: 0 },
				viewportHeight: 720,
				viewportWidth: 1280,
			}),
		).toEqual({ x: 0, y: 0 });
	});

	it("maps a full-width drag to the configured yaw rotation", () => {
		const delta = resolveTouchLookDelta({
			current: { x: 1280, y: 0 },
			previous: { x: 0, y: 0 },
			viewportHeight: 720,
			viewportWidth: 1280,
		});

		expect(delta.x).toBeCloseTo(
			TOUCH_LOOK_CONFIG.YAW_RADIANS_PER_FULL_VIEWPORT_DRAG,
		);
		expect(delta.y).toBe(0);
	});

	it("maps a full-height drag to the configured pitch rotation", () => {
		const delta = resolveTouchLookDelta({
			current: { x: 0, y: 720 },
			previous: { x: 0, y: 0 },
			viewportHeight: 720,
			viewportWidth: 1280,
		});

		expect(delta.x).toBe(0);
		expect(delta.y).toBeCloseTo(
			TOUCH_LOOK_CONFIG.PITCH_RADIANS_PER_FULL_VIEWPORT_DRAG,
		);
	});

	it("clamps viewport dimensions to a minimum size of one pixel", () => {
		const delta = resolveTouchLookDelta({
			current: { x: 1, y: 1 },
			previous: { x: 0, y: 0 },
			viewportHeight: 0,
			viewportWidth: 0,
		});

		expect(delta.x).toBeCloseTo(
			TOUCH_LOOK_CONFIG.YAW_RADIANS_PER_FULL_VIEWPORT_DRAG,
		);
		expect(delta.y).toBeCloseTo(
			TOUCH_LOOK_CONFIG.PITCH_RADIANS_PER_FULL_VIEWPORT_DRAG,
		);
	});
});
