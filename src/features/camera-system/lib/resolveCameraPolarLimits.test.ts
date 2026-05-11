import { describe, expect, it } from "vitest";

import { CAMERA_LIMITS, CAMERA_MODE_IDS } from "../config";
import { resolveCameraPolarLimits } from "./resolveCameraPolarLimits";

describe("resolveCameraPolarLimits", () => {
	it("returns top-down polar angle for top-down mode", () => {
		const limits = resolveCameraPolarLimits(CAMERA_MODE_IDS.TOP_DOWN);

		expect(limits.minPolarAngle).toBe(CAMERA_LIMITS.TOP_DOWN_POLAR_ANGLE);
		expect(limits.maxPolarAngle).toBe(CAMERA_LIMITS.TOP_DOWN_POLAR_ANGLE);
	});

	it("returns free-orbit limits for free-orbit mode", () => {
		const limits = resolveCameraPolarLimits(CAMERA_MODE_IDS.FREE_ORBIT);

		expect(limits.minPolarAngle).toBe(CAMERA_LIMITS.FREE_ORBIT_MIN_POLAR_ANGLE);
		expect(limits.maxPolarAngle).toBe(CAMERA_LIMITS.FREE_ORBIT_MAX_POLAR_ANGLE);
	});

	it("returns third-person limits as default", () => {
		const limits = resolveCameraPolarLimits(CAMERA_MODE_IDS.THIRD_PERSON);

		expect(limits.minPolarAngle).toBe(
			CAMERA_LIMITS.THIRD_PERSON_MIN_POLAR_ANGLE,
		);
		expect(limits.maxPolarAngle).toBe(
			CAMERA_LIMITS.THIRD_PERSON_MAX_POLAR_ANGLE,
		);
	});
});
