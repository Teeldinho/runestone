import { describe, expect, it } from "vitest";

import { resolveMovementVelocityMagnitude } from "./resolveMovementVelocityMagnitude";

describe("resolveMovementVelocityMagnitude", () => {
	it("returns the vector magnitude on the movement plane", () => {
		expect(resolveMovementVelocityMagnitude({ velocity: [3, 0, 4] })).toBe(5);
	});

	it("returns zero for a stationary vector", () => {
		expect(resolveMovementVelocityMagnitude({ velocity: [0, 0, 0] })).toBe(0);
	});
});
