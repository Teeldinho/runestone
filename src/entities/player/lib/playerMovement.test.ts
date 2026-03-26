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
		it("keeps direction when azimuth is zero", () => {
			expect(rotateVelocityByCameraAzimuth([0, 0, -1], 0)).toEqual([0, 0, -1]);
		});

		it("rotates forward movement with camera yaw", () => {
			const [x, y, z] = rotateVelocityByCameraAzimuth([0, 0, -1], Math.PI / 2);

			expect(y).toBe(0);
			expect(x).toBeCloseTo(1, 6);
			expect(z).toBeCloseTo(0, 6);
		});
	});
});
