import { describe, expect, it } from "vitest";

import { CAMERA_CONFIG } from "@/shared/config";

import { CAMERA_LIMITS, CAMERA_MODE_IDS } from "../config";
import { resolveOrbitControlDistanceLimits } from "./resolveOrbitControlDistanceLimits";

describe("resolveOrbitControlDistanceLimits", () => {
	it("returns third-person orbit limits", () => {
		expect(
			resolveOrbitControlDistanceLimits(CAMERA_MODE_IDS.THIRD_PERSON),
		).toEqual({
			maxDistance: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MAX_DISTANCE,
			minDistance: CAMERA_CONFIG.THIRD_PERSON.ORBIT.MIN_DISTANCE,
		});
	});

	it("returns top-down orbit limits", () => {
		expect(resolveOrbitControlDistanceLimits(CAMERA_MODE_IDS.TOP_DOWN)).toEqual(
			{
				maxDistance: CAMERA_CONFIG.TOP_DOWN.MAX_DISTANCE,
				minDistance: CAMERA_CONFIG.TOP_DOWN.MIN_DISTANCE,
			},
		);
	});

	it("locks first-person to the fixed orbit distance", () => {
		expect(
			resolveOrbitControlDistanceLimits(CAMERA_MODE_IDS.FIRST_PERSON),
		).toEqual({
			maxDistance: CAMERA_LIMITS.FIRST_PERSON_ORBIT_DISTANCE,
			minDistance: CAMERA_LIMITS.FIRST_PERSON_ORBIT_DISTANCE,
		});
	});

	it("returns free-orbit limits", () => {
		expect(
			resolveOrbitControlDistanceLimits(CAMERA_MODE_IDS.FREE_ORBIT),
		).toEqual({
			maxDistance: CAMERA_CONFIG.FREE_ORBITAL.MAX_DISTANCE,
			minDistance: CAMERA_CONFIG.FREE_ORBITAL.MIN_DISTANCE,
		});
	});
});
