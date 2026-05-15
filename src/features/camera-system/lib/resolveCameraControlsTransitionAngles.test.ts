import { describe, expect, it } from "vitest";

import {
	CAMERA_CONTROLS_CONSTANTS,
	CAMERA_CONTROLS_TOP_DOWN_AZIMUTH,
	CAMERA_MODE_IDS,
} from "../config";
import { resolveCameraControlsTransitionAngles } from "./resolveCameraControlsTransitionAngles";

describe("resolveCameraControlsTransitionAngles", () => {
	it("preserves world-facing azimuth when transitioning to a non-top-down mode", () => {
		const preservedWorldFacingAzimuth = 2.2;

		expect(
			resolveCameraControlsTransitionAngles({
				destinationMode: CAMERA_MODE_IDS.THIRD_PERSON,
				preservedWorldFacingAzimuth,
				preservedPolarAngle: 0.8,
				destinationMinPolarAngle: 0.2,
				destinationMaxPolarAngle: 1.5,
			}),
		).toEqual({
			azimuthAngle:
				preservedWorldFacingAzimuth -
				CAMERA_CONTROLS_CONSTANTS.WORLD_FACING_AZIMUTH_OFFSET,
			polarAngle: 0.8,
		});
	});

	it("uses the top-down locked azimuth when transitioning to top-down", () => {
		expect(
			resolveCameraControlsTransitionAngles({
				destinationMode: CAMERA_MODE_IDS.TOP_DOWN,
				preservedWorldFacingAzimuth: 2.2,
				preservedPolarAngle: 0.8,
				destinationMinPolarAngle: Math.PI / 2,
				destinationMaxPolarAngle: Math.PI / 2,
			}),
		).toEqual({
			azimuthAngle: CAMERA_CONTROLS_TOP_DOWN_AZIMUTH,
			polarAngle: Math.PI / 2,
		});
	});

	it("clamps preserved polar angle into the destination mode range", () => {
		expect(
			resolveCameraControlsTransitionAngles({
				destinationMode: CAMERA_MODE_IDS.FREE_ORBIT,
				preservedWorldFacingAzimuth: 1.2,
				preservedPolarAngle: 2.4,
				destinationMinPolarAngle: 0.2,
				destinationMaxPolarAngle: 1.5,
			}).polarAngle,
		).toBe(1.5);
	});

	it("uses a midpoint polar fallback when no polar history exists", () => {
		expect(
			resolveCameraControlsTransitionAngles({
				destinationMode: CAMERA_MODE_IDS.FIRST_PERSON,
				preservedWorldFacingAzimuth: null,
				preservedPolarAngle: null,
				destinationMinPolarAngle: 0.4,
				destinationMaxPolarAngle: 1.4,
			}).polarAngle,
		).toBeCloseTo(0.9, 6);
	});
});
