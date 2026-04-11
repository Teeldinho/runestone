import { describe, expect, it } from "vitest";

import { resolveJoystickVector } from "./resolveJoystickVector";

describe("resolveJoystickVector", () => {
	it("returns no movement when pointer delta is zero", () => {
		const result = resolveJoystickVector({
			deltaX: 0,
			deltaY: 0,
			maxRadiusPx: 40,
			deadZoneRatio: 0.2,
		});

		expect(result.hasMovement).toBe(false);
		expect(result.velocity).toEqual([0, 0, 0]);
	});

	it("clamps knob movement at max radius and normalizes velocity", () => {
		const result = resolveJoystickVector({
			deltaX: 100,
			deltaY: 0,
			maxRadiusPx: 40,
			deadZoneRatio: 0.2,
		});

		expect(result.knobOffsetX).toBe(40);
		expect(result.knobOffsetY).toBe(0);
		expect(result.hasMovement).toBe(true);
		expect(result.velocity).toEqual([1, 0, 0]);
	});

	it("suppresses movement in dead zone", () => {
		const result = resolveJoystickVector({
			deltaX: 3,
			deltaY: 2,
			maxRadiusPx: 44,
			deadZoneRatio: 0.2,
		});

		expect(result.hasMovement).toBe(false);
		expect(result.velocity).toEqual([0, 0, 0]);
	});
});
