import { describe, expect, it } from "vitest";

import { CAMERA_CONTROLS_CONSTANTS, CAMERA_MODE_IDS } from "../config";
import { resolveCameraControlsWorldFacingAzimuth } from "./resolveCameraControlsWorldFacingAzimuth";

describe("resolveCameraControlsWorldFacingAzimuth", () => {
	it("derives non-top-down world-facing azimuth from camera azimuth", () => {
		expect(
			resolveCameraControlsWorldFacingAzimuth({
				mode: CAMERA_MODE_IDS.THIRD_PERSON,
				cameraAzimuthAngle: 0.4,
				previousWorldFacingAzimuth: null,
			}),
		).toBe(0.4 + CAMERA_CONTROLS_CONSTANTS.WORLD_FACING_AZIMUTH_OFFSET);
	});

	it("preserves the previous world-facing azimuth while in top-down", () => {
		expect(
			resolveCameraControlsWorldFacingAzimuth({
				mode: CAMERA_MODE_IDS.TOP_DOWN,
				cameraAzimuthAngle: 2.4,
				previousWorldFacingAzimuth: 1.25,
			}),
		).toBe(1.25);
	});

	it("falls back to the configured default when top-down has no preserved heading yet", () => {
		expect(
			resolveCameraControlsWorldFacingAzimuth({
				mode: CAMERA_MODE_IDS.TOP_DOWN,
				cameraAzimuthAngle: 2.4,
				previousWorldFacingAzimuth: null,
			}),
		).toBe(CAMERA_CONTROLS_CONSTANTS.DEFAULT_WORLD_FACING_AZIMUTH);
	});
});
