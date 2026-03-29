import { describe, expect, it } from "vitest";

import {
	normalizeMovementVelocity,
	rotateVelocityByCameraAzimuth,
} from "./playerMovement";

describe("playerMovement", () => {
	describe("normalizeMovementVelocity", () => {
		it("returns zero velocity when input is zero", () => {
			expect(normalizeMovementVelocity([0, 0, 0])).toEqual([0, 0, 0]);
		});

		it("normalizes diagonal movement on XZ plane", () => {
			const [x, y, z] = normalizeMovementVelocity([1, 0, -1]);

			expect(y).toBe(0);
			expect(x).toBeCloseTo(Math.SQRT1_2, 6);
			expect(z).toBeCloseTo(-Math.SQRT1_2, 6);
			expect(Math.hypot(x, z)).toBeCloseTo(1, 6);
		});
	});

	describe("rotateVelocityByCameraAzimuth", () => {
		it("keeps forward movement aligned when camera faces world north", () => {
			const [x, y, z] = rotateVelocityByCameraAzimuth([0, 0, -1], Math.PI);

			expect(y).toBe(0);
			expect(x).toBeCloseTo(0, 6);
			expect(z).toBeCloseTo(-1, 6);
		});

		it("maps forward movement to world east when camera faces east", () => {
			const [x, y, z] = rotateVelocityByCameraAzimuth([0, 0, -1], Math.PI / 2);

			expect(y).toBe(0);
			expect(x).toBeCloseTo(1, 6);
			expect(z).toBeCloseTo(0, 6);
		});

		it("maps forward movement to world south when camera faces south", () => {
			const [x, y, z] = rotateVelocityByCameraAzimuth([0, 0, -1], 0);

			expect(y).toBe(0);
			expect(x).toBeCloseTo(0, 6);
			expect(z).toBeCloseTo(1, 6);
		});

		it("maps forward movement to world west when camera faces west", () => {
			const [x, y, z] = rotateVelocityByCameraAzimuth([0, 0, -1], -Math.PI / 2);

			expect(y).toBe(0);
			expect(x).toBeCloseTo(-1, 6);
			expect(z).toBeCloseTo(0, 6);
		});

		it("preserves movement magnitude at arbitrary camera headings", () => {
			const arbitraryAzimuth = (37 * Math.PI) / 180;
			const [x, y, z] = rotateVelocityByCameraAzimuth(
				[1, 0, -1],
				arbitraryAzimuth,
			);

			expect(y).toBe(0);
			expect(Math.hypot(x, z)).toBeCloseTo(Math.hypot(1, -1), 6);
		});
	});
});
