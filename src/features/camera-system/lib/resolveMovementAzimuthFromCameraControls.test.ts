import { describe, expect, it } from "vitest";

import { CAMERA_MODE_IDS } from "../config";
import { resolveMovementAzimuthFromCameraControls } from "./resolveMovementAzimuthFromCameraControls";

describe("resolveMovementAzimuthFromCameraControls", () => {
	it("locks top-down movement azimuth", () => {
		expect(
			resolveMovementAzimuthFromCameraControls({
				mode: CAMERA_MODE_IDS.TOP_DOWN,
				azimuthAngle: 0.7,
			}),
		).toBe(0);
	});

	it("returns the raw azimuth for other modes", () => {
		expect(
			resolveMovementAzimuthFromCameraControls({
				mode: CAMERA_MODE_IDS.THIRD_PERSON,
				azimuthAngle: 0.7,
			}),
		).toBeCloseTo(0.7 + Math.PI, 6);
	});
});
