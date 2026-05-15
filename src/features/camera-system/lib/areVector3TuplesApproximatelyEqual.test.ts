import { describe, expect, it } from "vitest";

import { areVector3TuplesApproximatelyEqual } from "./areVector3TuplesApproximatelyEqual";

describe("areVector3TuplesApproximatelyEqual", () => {
	it("returns true when all coordinates are within epsilon", () => {
		expect(
			areVector3TuplesApproximatelyEqual({
				left: [1, 2, 3],
				right: [1.001, 2.001, 2.999],
				epsilon: 0.01,
			}),
		).toBe(true);
	});

	it("returns false when one coordinate exceeds epsilon", () => {
		expect(
			areVector3TuplesApproximatelyEqual({
				left: [1, 2, 3],
				right: [1.02, 2, 3],
				epsilon: 0.01,
			}),
		).toBe(false);
	});
});
