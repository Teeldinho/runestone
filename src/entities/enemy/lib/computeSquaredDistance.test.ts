import { describe, expect, it } from "vitest";

import { computeSquaredDistance } from "./computeSquaredDistance";

describe("computeSquaredDistance", () => {
	it("returns 0 for identical positions", () => {
		expect(computeSquaredDistance([0, 0, 0], [0, 0, 0])).toBe(0);
		expect(computeSquaredDistance([1, 2, 3], [1, 2, 3])).toBe(0);
	});

	it("computes correct squared distance for simple offsets", () => {
		expect(computeSquaredDistance([0, 0, 0], [3, 4, 0])).toBe(25);
		expect(computeSquaredDistance([0, 0, 0], [1, 0, 0])).toBe(1);
		expect(computeSquaredDistance([0, 0, 0], [0, 2, 0])).toBe(4);
	});

	it("is equivalent to squared Euclidean distance", () => {
		const a: [number, number, number] = [1, 2, 3];
		const b: [number, number, number] = [4, 6, 3];
		const dx = a[0] - b[0];
		const dy = a[1] - b[1];
		const dz = a[2] - b[2];
		const expected = dx * dx + dy * dy + dz * dz;
		expect(computeSquaredDistance(a, b)).toBe(expected);
	});
});
