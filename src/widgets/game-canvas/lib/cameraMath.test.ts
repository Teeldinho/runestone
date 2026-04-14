import { describe, expect, it } from "vitest";
import { CAMERA_TRANSITION_MS } from "@/shared/config";
import {
	computeCameraRigLerpAlpha,
	computeCameraRigTransitionJumpDistance,
} from "./cameraMath";

describe("cameraMath", () => {
	describe("computeCameraRigLerpAlpha", () => {
		it("should compute exponential decay lerp alpha from transition ms", () => {
			const result = computeCameraRigLerpAlpha(CAMERA_TRANSITION_MS);
			expect(result).toBeGreaterThan(0);
			expect(result).toBeLessThan(1);
		});

		it("should return consistent value for same transition ms", () => {
			const result1 = computeCameraRigLerpAlpha(CAMERA_TRANSITION_MS);
			const result2 = computeCameraRigLerpAlpha(CAMERA_TRANSITION_MS);
			expect(result1).toBeCloseTo(result2);
		});
	});

	describe("computeCameraRigTransitionJumpDistance", () => {
		it("should compute half of room width", () => {
			const result = computeCameraRigTransitionJumpDistance();
			expect(result).toBe(6);
		});
	});
});
