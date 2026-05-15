import { describe, expect, it } from "vitest";

import { clampCameraControlsPolarAngle } from "./clampCameraControlsPolarAngle";

describe("clampCameraControlsPolarAngle", () => {
	it("keeps a polar angle that is already within range", () => {
		expect(
			clampCameraControlsPolarAngle({
				polarAngle: 0.8,
				minPolarAngle: 0.2,
				maxPolarAngle: 1.2,
			}),
		).toBe(0.8);
	});

	it("clamps a polar angle below the minimum", () => {
		expect(
			clampCameraControlsPolarAngle({
				polarAngle: 0.1,
				minPolarAngle: 0.2,
				maxPolarAngle: 1.2,
			}),
		).toBe(0.2);
	});

	it("clamps a polar angle above the maximum", () => {
		expect(
			clampCameraControlsPolarAngle({
				polarAngle: 1.5,
				minPolarAngle: 0.2,
				maxPolarAngle: 1.2,
			}),
		).toBe(1.2);
	});
});
