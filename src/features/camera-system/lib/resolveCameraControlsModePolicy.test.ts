import { describe, expect, it } from "vitest";

import { CAMERA_CONFIG, TOP_DOWN_CAMERA_POLAR_ANGLE } from "@/shared/config";

import { CAMERA_MODE_IDS } from "../config";
import { resolveCameraControlsModePolicy } from "./resolveCameraControlsModePolicy";

describe("resolveCameraControlsModePolicy", () => {
	it("returns the third-person control policy", () => {
		expect(
			resolveCameraControlsModePolicy(CAMERA_MODE_IDS.THIRD_PERSON),
		).toEqual(
			expect.objectContaining({
				minDistance: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_DISTANCE,
				maxDistance: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_DISTANCE,
				azimuthRotateSpeed: 1,
				dollySpeed: 1,
			}),
		);
	});

	it("returns the top-down control policy", () => {
		expect(resolveCameraControlsModePolicy(CAMERA_MODE_IDS.TOP_DOWN)).toEqual(
			expect.objectContaining({
				minPolarAngle: TOP_DOWN_CAMERA_POLAR_ANGLE,
				maxPolarAngle: TOP_DOWN_CAMERA_POLAR_ANGLE,
				azimuthRotateSpeed: 0,
				dollySpeed: CAMERA_CONFIG.TOP_DOWN.ZOOM_SPEED,
			}),
		);
	});

	it("returns the first-person control policy", () => {
		expect(
			resolveCameraControlsModePolicy(CAMERA_MODE_IDS.FIRST_PERSON),
		).toEqual(
			expect.objectContaining({
				minDistance: 0.01,
				maxDistance: 0.01,
				draggingSmoothTime: 0.035,
			}),
		);
	});

	it("returns the free-orbit control policy", () => {
		expect(resolveCameraControlsModePolicy(CAMERA_MODE_IDS.FREE_ORBIT)).toEqual(
			expect.objectContaining({
				minDistance: CAMERA_CONFIG.FREE_ORBITAL.MIN_DISTANCE,
				maxDistance: CAMERA_CONFIG.FREE_ORBITAL.MAX_DISTANCE,
				truckSpeed: CAMERA_CONFIG.FREE_ORBITAL.PAN_SPEED,
			}),
		);
	});
});
