import { describe, expect, it } from "vitest";

import {
	addVec3,
	checkVector3TupleEqual,
	createVector3Tuple,
	distanceVec3,
	getQuaternionFromXZ,
	normalizeVec3,
	subtractVec3,
} from "./vec3";

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

	it("calculates quaternion orientation from XZ vector", () => {
		const qForward = getQuaternionFromXZ(0, 1);
		expect(qForward.y).toBeCloseTo(0);
		expect(qForward.w).toBeCloseTo(1);

		const qRight = getQuaternionFromXZ(1, 0);
		expect(qRight.y).toBeCloseTo(Math.sin(Math.PI / 4));
		expect(qRight.w).toBeCloseTo(Math.cos(Math.PI / 4));
	});

	it("creates a vector3 tuple from three numbers", () => {
		expect(createVector3Tuple(1, 2, 3)).toEqual([1, 2, 3]);
	});

	it("checks equality of two vector3 tuples", () => {
		expect(checkVector3TupleEqual([1, 2, 3], [1, 2, 3])).toBe(true);
		expect(checkVector3TupleEqual([1, 2, 3], [1, 2, 4])).toBe(false);
		expect(checkVector3TupleEqual([0, 0, 0], [0, 0, 0])).toBe(true);
	});
});
