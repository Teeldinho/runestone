import { describe, expect, it } from "vitest";

import { addVec3, distanceVec3, normalizeVec3, subtractVec3 } from "./vec3";

describe("vec3", () => {
	it("adds vectors", () => {
		expect(addVec3([1, 2, 3], [3, 2, 1])).toEqual([4, 4, 4]);
	});

	it("subtracts vectors", () => {
		expect(subtractVec3([5, 5, 5], [2, 3, 4])).toEqual([3, 2, 1]);
	});

	it("calculates distance", () => {
		expect(distanceVec3([0, 0, 0], [3, 4, 0])).toBe(5);
	});

	it("normalizes vectors", () => {
		expect(normalizeVec3([0, 0, 0])).toEqual([0, 0, 0]);
		const normalizedVector = normalizeVec3([0, 3, 4]);

		expect(normalizedVector[0]).toBeCloseTo(0, 8);
		expect(normalizedVector[1]).toBeCloseTo(0.6, 8);
		expect(normalizedVector[2]).toBeCloseTo(0.8, 8);
	});
});
