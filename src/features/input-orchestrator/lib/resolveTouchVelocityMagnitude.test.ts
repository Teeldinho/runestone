import { describe, expect, it } from "vitest";

import { resolveTouchVelocityMagnitude } from "./resolveTouchVelocityMagnitude";

describe("resolveTouchVelocityMagnitude", () => {
	it("returns 0 for zero velocity", () => {
		expect(resolveTouchVelocityMagnitude({ velocity: [0, 0, 0] })).toBeCloseTo(
			0,
		);
	});

	it("computes magnitude from x and z components", () => {
		const result = resolveTouchVelocityMagnitude({ velocity: [3, 0, 4] });

		expect(result).toBeCloseTo(5);
	});

	it("ignores y component", () => {
		const withY = resolveTouchVelocityMagnitude({ velocity: [3, 999, 4] });
		const withoutY = resolveTouchVelocityMagnitude({ velocity: [3, 0, 4] });

		expect(withY).toBeCloseTo(withoutY);
	});
});
