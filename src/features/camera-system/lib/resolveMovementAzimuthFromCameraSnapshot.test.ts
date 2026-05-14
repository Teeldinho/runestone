import { describe, expect, it } from "vitest";

import { CAMERA_MODE_IDS } from "../config";
import { resolveMovementAzimuthFromCameraSnapshot } from "./resolveMovementAzimuthFromCameraSnapshot";

describe("resolveMovementAzimuthFromCameraSnapshot", () => {
	it("returns zero azimuth in top-down mode", () => {
		expect(
			resolveMovementAzimuthFromCameraSnapshot({
				mode: CAMERA_MODE_IDS.TOP_DOWN,
				yaw: 1.75,
			}),
		).toBe(0);
	});

	it("returns the snapshot yaw in third-person mode", () => {
		expect(
			resolveMovementAzimuthFromCameraSnapshot({
				mode: CAMERA_MODE_IDS.THIRD_PERSON,
				yaw: -0.45,
			}),
		).toBe(-0.45);
	});

	it("returns the snapshot yaw in first-person mode", () => {
		expect(
			resolveMovementAzimuthFromCameraSnapshot({
				mode: CAMERA_MODE_IDS.FIRST_PERSON,
				yaw: 0.92,
			}),
		).toBe(0.92);
	});

	it("returns the snapshot yaw in free-orbit mode", () => {
		expect(
			resolveMovementAzimuthFromCameraSnapshot({
				mode: CAMERA_MODE_IDS.FREE_ORBIT,
				yaw: Math.PI / 3,
			}),
		).toBeCloseTo(Math.PI / 3, 6);
	});
});
