import { describe, expect, it } from "vitest";

import { resolvePlayerVerticalVelocity } from "./resolvePlayerVerticalVelocity";

describe("resolvePlayerVerticalVelocity", () => {
	it("preserves upward velocity", () => {
		expect(
			resolvePlayerVerticalVelocity({
				currentVerticalVelocity: 5,
			}),
		).toBe(5);
	});

	it("preserves zero velocity", () => {
		expect(
			resolvePlayerVerticalVelocity({
				currentVerticalVelocity: 0,
			}),
		).toBe(0);
	});

	it("multiplies downward velocity by FALL_GRAVITY_SCALE", () => {
		const result = resolvePlayerVerticalVelocity({
			currentVerticalVelocity: -2,
		});

		expect(result).toBeLessThan(-2);
		expect(result).toBe(-3.3);
	});

	it("clamps downward velocity to MAX_FALL_SPEED", () => {
		const result = resolvePlayerVerticalVelocity({
			currentVerticalVelocity: -100,
		});

		expect(result).toBe(-14);
	});
});
